const { sendOpenAIResponse } = require('../utils/response-utils');
const { DeviceIdManager } = require('../utils/device-id-manager');

function setupSocketHandler(io, connectedR1s, pendingRequests, requestDeviceMap, debugStreams, deviceLogs, debugDataStore, performanceMetrics, deviceIdManager = null) {
  // Initialize device ID manager if not provided
  if (!deviceIdManager) {
    deviceIdManager = new DeviceIdManager();
  }

  // Get PIN configuration from environment
  const enablePin = process.env.DISABLE_PIN !== 'true'; // Default to enabled, disable if DISABLE_PIN=true

  // Socket.IO connection handling
  io.on('connection', async (socket) => {
    // Get client info for device identification
    const userAgent = socket.handshake.headers['user-agent'];
    const ipAddress = socket.handshake.address || socket.request.connection.remoteAddress;
    
    // Extract device secret from cookie
    const cookies = socket.handshake.headers.cookie;
    let deviceSecret = null;
    if (cookies) {
      const cookieMatch = cookies.match(/r1_device_secret=([^;]+)/);
      if (cookieMatch) {
        deviceSecret = decodeURIComponent(cookieMatch[1]);
      }
    }

    // Get or create persistent device ID
    console.log(`🔌 New socket connection: ${socket.id}`);
    console.log(`🍪 Device secret from cookie: ${deviceSecret ? 'present' : 'none'}`);
    
    const result = await deviceIdManager.registerDevice(socket.id, null, deviceSecret, userAgent, ipAddress, enablePin);
    const { deviceId, pinCode, deviceSecret: newDeviceSecret, isReconnection } = result;
    connectedR1s.set(deviceId, socket);

    console.log(`R1 device ${isReconnection ? 'reconnected' : 'connected'}`);
    console.log(`Total connected devices: ${connectedR1s.size}`);

    // Don't broadcast device connections to prevent device ID leakage

    // Send welcome message with device ID, PIN code, and device secret for cookie
    socket.emit('connected', {
      deviceId: deviceId,
      pinCode: pinCode,
      pinEnabled: pinCode !== null,
      deviceSecret: newDeviceSecret, // Only sent for new devices
      isReconnection: isReconnection,
      message: isReconnection ? 'Reconnected to R-API server' : 'Connected to R-API server'
    });
    
    // Remove debug logging to prevent device ID leakage

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`R1 device disconnected`);
      connectedR1s.delete(deviceId);
      deviceIdManager.unregisterDevice(socket.id);

      console.log(`Total connected devices after disconnect: ${connectedR1s.size}`);
    });

    // Debug data streaming handlers - store locally only
    socket.on('hardware_event', (data) => {
      // Store locally but don't log device IDs
    });

    socket.on('camera_event', (data) => {
      // Store locally but don't log device IDs
    });

    socket.on('llm_event', (data) => {
      // Store locally but don't log device IDs
    });

    socket.on('storage_event', (data) => {
      // Store locally but don't log device IDs
    });

    socket.on('audio_event', (data) => {
      // Store locally but don't log device IDs
    });

    socket.on('performance_event', (data) => {
      // Store locally but don't log device IDs
    });

    socket.on('device_event', (data) => {
      // Store locally but don't log device IDs
    });

    // Handle media control events
    socket.on('media_control', (data) => {
      console.log(`🎵 Media control received:`, data);
      // Forward to the target device
      const { command, deviceId: targetDeviceId } = data;
      const targetSocket = connectedR1s.get(targetDeviceId);
      if (targetSocket) {
        targetSocket.emit('media_control', {
          command,
          timestamp: Date.now()
        });
      } else {
        console.log(`❌ Target device ${targetDeviceId} not connected`);
      }
    });

    socket.on('music_play', (data) => {
      console.log(`🎵 Music play request:`, data);
      // Handle music playback requests
    });

    socket.on('volume_control', (data) => {
      console.log(`🔊 Volume control:`, data);
      // Handle volume changes
    });

    socket.on('file_share', (data) => {
      console.log(`📁 File share request:`, data);
      // Handle file sharing
    });

    socket.on('system_info', (data) => {
      console.log(`System info received`);
      // Store system info for analytics (without exposing device ID)
      if (!global.systemInfo) global.systemInfo = {};
      global.systemInfo[deviceId] = {
        ...data.systemInfo,
        lastUpdated: new Date().toISOString()
      };
    });

    // Handle ping/heartbeat from client
    socket.on('ping', (data) => {
      // Respond with pong to keep connection alive (without exposing device ID)
      socket.emit('pong', {
        timestamp: Date.now(),
        serverTime: new Date().toISOString()
      });
    });

    // Handle chat completion requests from server
    socket.on('chat_completion', (data) => {
      console.log(`💬 Chat completion request received`);
      
      // Forward to the R1 device - the R1 app should handle this
      // The R1 device will process the messages and send back a response via 'response' event
      console.log(`📨 Forwarding chat completion to R1 device:`, JSON.stringify(data, null, 2));
    });

    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log(`Message from device:`, message);

        // Handle different message types from R1
        switch (message.type) {
          case 'status':
            console.log(`R1 device status:`, message.data);
            break;
          case 'response':
            console.log(`R1 device response:`, message.data);
            break;
          case 'error':
            console.error(`R1 device error:`, message.data);
            break;
          default:
            console.log(`Unknown message type from device:`, message);
        }
      } catch (error) {
        console.error(`Error parsing message from ${deviceId}:`, error);
      }
    });

    // Handle response events from R1 devices
    socket.on('response', async (data) => {
      console.log(`🔄 Socket Response received`);

      const { requestId, response, originalMessage, model, timestamp } = data;

      console.log(`Looking for pending request: ${requestId}`);

      // Only process responses with valid request IDs to prevent cross-contamination
      if (requestId && pendingRequests.has(requestId)) {
        console.log(`✅ Found matching request, sending response to client`);
        const { res, timeout, stream } = pendingRequests.get(requestId);

        // Verify this request was actually sent to this device
        const expectedDeviceId = requestDeviceMap.get(requestId);
        if (expectedDeviceId !== deviceId) {
          console.log(`❌ Security violation: Response from wrong device`);
          return;
        }

        // Clear timeout and remove from pending requests
        clearTimeout(timeout);
        pendingRequests.delete(requestId);
        requestDeviceMap.delete(requestId);
        console.log(`🗑️ Removed pending request, remaining: ${pendingRequests.size}`);

        sendOpenAIResponse(res, response, originalMessage, model, stream);
      }
      else {
        console.log(`❌ No matching requests found for response`);
      }
    });

    // Handle error events from R1 devices
    socket.on('error', (data) => {
      console.error(`Error from device:`, data);

      const { requestId, error } = data;

      // Only process errors with valid request IDs to prevent cross-contamination
      if (requestId && pendingRequests.has(requestId)) {
        // Verify this request was actually sent to this device
        const expectedDeviceId = requestDeviceMap.get(requestId);
        if (expectedDeviceId !== deviceId) {
          console.log(`❌ Security violation: Error from wrong device`);
          return;
        }

        const { res, timeout } = pendingRequests.get(requestId);

        // Clear timeout and remove from pending requests
        clearTimeout(timeout);
        pendingRequests.delete(requestId);
        requestDeviceMap.delete(requestId);

        // Send error response
        res.status(500).json({
          error: {
            message: error || 'Error from R1 device',
            type: 'r1_error'
          }
        });
      }
    });

    socket.on('disconnect', () => {
      connectedR1s.delete(deviceId);
      console.log(`R1 device disconnected`);
      console.log(`Total connected devices: ${connectedR1s.size}`);
    });
  });
}

module.exports = { setupSocketHandler };
