import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import DeviceLogin from './components/DeviceLogin';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [storageData, setStorageData] = useState(null);

  useEffect(() => {
    // Check for saved credentials
    const savedDeviceId = localStorage.getItem('r1-device-id');
    const savedPinCode = localStorage.getItem('r1-pin-code');

    if (savedDeviceId) {
      setDeviceId(savedDeviceId);
      setPinCode(savedPinCode || '');
      // Auto-authenticate if we have saved credentials
      handleLogin(savedDeviceId, savedPinCode || '');
    }
  }, []);

  const handleLogin = async (deviceIdInput, pinCodeInput) => {
    setAuthError('');

    if (!deviceIdInput.trim()) {
      setAuthError('Device ID is required');
      return;
    }

    try {
      // Test the device connection
      const headers = {
        'Content-Type': 'application/json'
      };

      if (pinCodeInput.trim()) {
        headers['Authorization'] = `Bearer ${pinCodeInput}`;
      }

      const response = await fetch(`/${deviceIdInput}/v1/models`, {
        headers: headers
      });

      if (response.ok) {
        // Authentication successful
        setDeviceId(deviceIdInput);
        setPinCode(pinCodeInput);
        setIsAuthenticated(true);

        // Save credentials
        localStorage.setItem('r1-device-id', deviceIdInput);
        if (pinCodeInput) {
          localStorage.setItem('r1-pin-code', pinCodeInput);
        } else {
          localStorage.removeItem('r1-pin-code');
        }

        // Initialize socket connection
        const newSocket = io();
        setSocket(newSocket);

        newSocket.on('connect', () => {
          console.log('Connected to R-API server');
        });

        newSocket.on('mcp_event', (data) => {
          console.log('MCP Event:', data);
        });

        // Fetch device info
        fetchDeviceInfo(deviceIdInput, pinCodeInput);

      } else {
        const error = await response.json();
        setAuthError(error.error?.message || 'Authentication failed');
      }
    } catch (error) {
      setAuthError(`Connection failed: ${error.message}`);
    }
  };

  const fetchDeviceInfo = async (deviceId, pinCode) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (pinCode) {
        headers['Authorization'] = `Bearer ${pinCode}`;
      }

      const response = await fetch(`/${deviceId}/v1/device/info`, {
        headers: headers
      });

      if (response.ok) {
        const info = await response.json();
        setDeviceInfo(info);
      }
    } catch (error) {
      console.error('Failed to fetch device info:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDeviceId('');
    setPinCode('');
    setAuthError('');
    setDeviceInfo(null);
    setStorageData(null);
    localStorage.removeItem('r1-device-id');
    localStorage.removeItem('r1-pin-code');

    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <DeviceLogin
        deviceId={deviceId}
        pinCode={pinCode}
        onDeviceIdChange={setDeviceId}
        onPinCodeChange={setPinCode}
        onLogin={handleLogin}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              R-Control One
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Device Management Panel
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Device ID</p>
              <p className="font-mono text-slate-900 dark:text-slate-100">{deviceId}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Device Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Status</CardTitle>
                  <CardDescription>Current connection and health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Connection:</span>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span>{deviceInfo?.battery || 'Unknown'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span>{deviceInfo?.storage || 'Unknown'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest device interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Device connected successfully</p>
                    <p>• Media controls initialized</p>
                    <p>• Storage synced</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common device operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Refresh Device Info
                  </Button>
                  <Button className="w-full" variant="outline">
                    Sync Storage
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Storage Management</CardTitle>
                <CardDescription>Manage files and data stored on your R1 device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="storage-used">Storage Used</Label>
                      <Input id="storage-used" value={deviceInfo?.storageUsed || '0 MB'} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="storage-total">Total Storage</Label>
                      <Input id="storage-total" value={deviceInfo?.storageTotal || 'Unknown'} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full">Browse Files</Button>
                    <Button variant="outline" className="w-full">Upload File</Button>
                    <Button variant="outline" className="w-full">Download Backup</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage PIN codes and access controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-pin">Current PIN</Label>
                    <Input
                      id="current-pin"
                      type="password"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="Enter current PIN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-pin">New PIN</Label>
                    <Input
                      id="new-pin"
                      type="password"
                      placeholder="Enter new PIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full">Update PIN</Button>
                    <Button variant="outline" className="w-full">
                      {pinCode ? 'Disable PIN' : 'Enable PIN'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Management</CardTitle>
                <CardDescription>Control MCP servers and plugins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    App management features coming soon...
                  </p>
                  <Button variant="outline" className="w-full">
                    View Installed Apps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;