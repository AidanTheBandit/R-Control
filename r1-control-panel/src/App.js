import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';import io from 'socket.io-client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

import { Button } from './components/ui/button';import { Button } from './components/ui/button';

import { Input } from './components/ui/input';import { Input } from './components/ui/input';

import { Label } from './components/ui/label';import { Label } from './components/ui/label';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

import DeviceLogin from './components/DeviceLogin';import DeviceLogin from './components/DeviceLogin';

import './App.css';import './App.css';



function App() {function App() {

  const [socket, setSocket] = useState(null);  const [socket, setSocket] = useState(null);

  const [deviceId, setDeviceId] = useState('');  const [deviceId, setDeviceId] = useState('');

  const [pinCode, setPinCode] = useState('');  const [pinCode, setPinCode] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authError, setAuthError] = useState('');  const [authError, setAuthError] = useState('');

  const [deviceInfo, setDeviceInfo] = useState(null);  const [deviceInfo, setDeviceInfo] = useState(null);

  const [storageData, setStorageData] = useState(null);  const [storageData, setStorageData] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {

  useEffect(() => {    // Check for saved credentials

    // Check for saved credentials    const savedDeviceId = localStorage.getItem('r1-device-id');

    const savedDeviceId = localStorage.getItem('r1-device-id');    const savedPinCode = localStorage.getItem('r1-pin-code');

    const savedPinCode = localStorage.getItem('r1-pin-code');

    if (savedDeviceId) {

    if (savedDeviceId) {      setDeviceId(savedDeviceId);

      setDeviceId(savedDeviceId);      setPinCode(savedPinCode || '');

      setPinCode(savedPinCode || '');      // Auto-authenticate if we have saved credentials

      // Auto-authenticate if we have saved credentials      handleLogin(savedDeviceId, savedPinCode || '');

      handleLogin(savedDeviceId, savedPinCode || '');    }

    }  }, []);

  }, []);

  const handleLogin = async (deviceIdInput, pinCodeInput) => {

  const handleLogin = async (deviceIdInput, pinCodeInput) => {    setAuthError('');

    setAuthError('');

    if (!deviceIdInput.trim()) {

    if (!deviceIdInput.trim()) {      setAuthError('Device ID is required');

      setAuthError('Device ID is required');      return;

      return;    }

    }

    try {

    try {      // Test the device connection

      // Test the device connection      const headers = {

      const headers = {        'Content-Type': 'application/json'

        'Content-Type': 'application/json'      };

      };

      if (pinCodeInput.trim()) {

      if (pinCodeInput.trim()) {        headers['Authorization'] = `Bearer ${pinCodeInput}`;

        headers['Authorization'] = `Bearer ${pinCodeInput}`;      }

      }

      const response = await fetch(`/${deviceIdInput}/v1/models`, {

      const response = await fetch(`/${deviceIdInput}/v1/models`, {        headers: headers

        headers: headers      });

      });

      if (response.ok) {

      if (response.ok) {        // Authentication successful

        // Authentication successful        setDeviceId(deviceIdInput);

        setDeviceId(deviceIdInput);        setPinCode(pinCodeInput);

        setPinCode(pinCodeInput);        setIsAuthenticated(true);

        setIsAuthenticated(true);

        // Save credentials

        // Save credentials        localStorage.setItem('r1-device-id', deviceIdInput);

        localStorage.setItem('r1-device-id', deviceIdInput);        if (pinCodeInput) {

        if (pinCodeInput) {          localStorage.setItem('r1-pin-code', pinCodeInput);

          localStorage.setItem('r1-pin-code', pinCodeInput);        } else {

        } else {          localStorage.removeItem('r1-pin-code');

          localStorage.removeItem('r1-pin-code');        }

        }

        // Initialize socket connection

        // Initialize socket connection        const newSocket = io();

        const newSocket = io();        setSocket(newSocket);

        setSocket(newSocket);

        newSocket.on('connect', () => {

        newSocket.on('connect', () => {          console.log('Connected to R-API server');

          console.log('Connected to R-API server');        });

        });

        newSocket.on('mcp_event', (data) => {

        newSocket.on('mcp_event', (data) => {          console.log('MCP Event:', data);

          console.log('MCP Event:', data);        });

        });

        // Fetch device info

        // Fetch device info        fetchDeviceInfo(deviceIdInput, pinCodeInput);

        fetchDeviceInfo(deviceIdInput, pinCodeInput);

      } else {

      } else {        const error = await response.json();

        const error = await response.json();        setAuthError(error.error?.message || 'Authentication failed');

        setAuthError(error.error?.message || 'Authentication failed');      }

      }    } catch (error) {

    } catch (error) {      setAuthError(`Connection failed: ${error.message}`);

      setAuthError(`Connection failed: ${error.message}`);    }

    }  };

  };

  const fetchDeviceInfo = async (deviceId, pinCode) => {

  const fetchDeviceInfo = async (deviceId, pinCode) => {    try {

    try {      const headers = {

      const headers = {        'Content-Type': 'application/json'

        'Content-Type': 'application/json'      };

      };

      if (pinCode) {

      if (pinCode) {        headers['Authorization'] = `Bearer ${pinCode}`;

        headers['Authorization'] = `Bearer ${pinCode}`;      }

      }

      const response = await fetch(`/${deviceId}/v1/device/info`, {

      const response = await fetch(`/${deviceId}/v1/device/info`, {        headers: headers

        headers: headers      });

      });

      if (response.ok) {

      if (response.ok) {        const info = await response.json();

        const info = await response.json();        setDeviceInfo(info);

        setDeviceInfo(info);      }

      }    } catch (error) {

    } catch (error) {      console.error('Failed to fetch device info:', error);

      console.error('Failed to fetch device info:', error);    }

    }  };

  };

  const handleLogout = () => {

  const handleLogout = () => {    setIsAuthenticated(false);

    setIsAuthenticated(false);    setDeviceId('');

    setDeviceId('');    setPinCode('');

    setPinCode('');    setAuthError('');

    setAuthError('');    setDeviceInfo(null);

    setDeviceInfo(null);    setStorageData(null);

    setStorageData(null);    localStorage.removeItem('r1-device-id');

    localStorage.removeItem('r1-device-id');    localStorage.removeItem('r1-pin-code');

    localStorage.removeItem('r1-pin-code');

    if (socket) {

    if (socket) {      socket.close();

      socket.close();      setSocket(null);

      setSocket(null);    }

    }  };

  };

  if (!isAuthenticated) {

  if (!isAuthenticated) {    return (

    return (      <DeviceLogin

      <DeviceLogin        deviceId={deviceId}

        deviceId={deviceId}        pinCode={pinCode}

        pinCode={pinCode}        onDeviceIdChange={setDeviceId}

        onDeviceIdChange={setDeviceId}        onPinCodeChange={setPinCode}

        onPinCodeChange={setPinCode}        onLogin={handleLogin}

        onLogin={handleLogin}        error={authError}

        error={authError}      />

      />    );

    );  }

  }

  return (

  return (    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">      <div className="container mx-auto p-6">

      {/* Header */}        {/* Header */}

      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">        <div className="flex justify-between items-center mb-8">

        <div className="flex justify-between items-center">          <div>

          <div>            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">

            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">              R-Control One

              R-Control Panel            </h1>

            </h1>            <p className="text-slate-600 dark:text-slate-400">

            <p className="text-slate-600 dark:text-slate-400 text-sm">              Device Management Panel

              Device: <span className="font-mono">{deviceId}</span>            </p>

            </p>          </div>

          </div>          <div className="flex items-center gap-4">

          <Button variant="outline" onClick={handleLogout}>            <div className="text-right">

            Logout              <p className="text-sm text-slate-600 dark:text-slate-400">Device ID</p>

          </Button>              <p className="font-mono text-slate-900 dark:text-slate-100">{deviceId}</p>

        </div>            </div>

      </header>            <Button variant="outline" onClick={handleLogout}>

              Logout

      {/* Main Content */}            </Button>

      <main className="container mx-auto p-6">          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">        </div>

          <TabsList className="grid w-full grid-cols-5">

            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>        {/* Main Content */}

            <TabsTrigger value="media">Media</TabsTrigger>        <Tabs defaultValue="overview" className="space-y-6">

            <TabsTrigger value="storage">Storage</TabsTrigger>          <TabsList className="grid w-full grid-cols-4">

            <TabsTrigger value="security">Security</TabsTrigger>            <TabsTrigger value="overview">Overview</TabsTrigger>

            <TabsTrigger value="apps">Apps</TabsTrigger>            <TabsTrigger value="storage">Storage</TabsTrigger>

          </TabsList>            <TabsTrigger value="security">Security</TabsTrigger>

            <TabsTrigger value="apps">Apps</TabsTrigger>

          <TabsContent value="dashboard" className="space-y-6">          </TabsList>

            {/* Device Status Overview */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">          <TabsContent value="overview" className="space-y-6">

              <Card>            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">              {/* Device Status Card */}

                  <CardTitle className="text-sm font-medium">Connection</CardTitle>              <Card>

                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>                <CardHeader>

                </CardHeader>                  <CardTitle>Device Status</CardTitle>

                <CardContent>                  <CardDescription>Current connection and health</CardDescription>

                  <div className="text-2xl font-bold text-green-600">Online</div>                </CardHeader>

                  <p className="text-xs text-slate-600 dark:text-slate-400">                <CardContent>

                    Connected to device                  <div className="space-y-2">

                  </p>                    <div className="flex justify-between">

                </CardContent>                      <span>Connection:</span>

              </Card>                      <span className="text-green-600 font-medium">Connected</span>

                    </div>

              <Card>                    <div className="flex justify-between">

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">                      <span>Battery:</span>

                  <CardTitle className="text-sm font-medium">Battery</CardTitle>                      <span>{deviceInfo?.battery || 'Unknown'}%</span>

                  <div className="text-lg">🔋</div>                    </div>

                </CardHeader>                    <div className="flex justify-between">

                <CardContent>                      <span>Storage:</span>

                  <div className="text-2xl font-bold">{deviceInfo?.battery || '85'}%</div>                      <span>{deviceInfo?.storage || 'Unknown'}</span>

                  <p className="text-xs text-slate-600 dark:text-slate-400">                    </div>

                    {deviceInfo?.battery > 20 ? 'Good' : 'Low'}                  </div>

                  </p>                </CardContent>

                </CardContent>              </Card>

              </Card>

              {/* Recent Activity Card */}

              <Card>              <Card>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">                <CardHeader>

                  <CardTitle className="text-sm font-medium">Storage</CardTitle>                  <CardTitle>Recent Activity</CardTitle>

                  <div className="text-lg">💾</div>                  <CardDescription>Latest device interactions</CardDescription>

                </CardHeader>                </CardHeader>

                <CardContent>                <CardContent>

                  <div className="text-2xl font-bold">{deviceInfo?.storageUsed || '2.4'}GB</div>                  <div className="space-y-2 text-sm">

                  <p className="text-xs text-slate-600 dark:text-slate-400">                    <p>• Device connected successfully</p>

                    of {deviceInfo?.storageTotal || '8'}GB used                    <p>• Media controls initialized</p>

                  </p>                    <p>• Storage synced</p>

                </CardContent>                  </div>

              </Card>                </CardContent>

              </Card>

              <Card>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">              {/* Quick Actions Card */}

                  <CardTitle className="text-sm font-medium">Apps</CardTitle>              <Card>

                  <div className="text-lg">📱</div>                <CardHeader>

                </CardHeader>                  <CardTitle>Quick Actions</CardTitle>

                <CardContent>                  <CardDescription>Common device operations</CardDescription>

                  <div className="text-2xl font-bold">5</div>                </CardHeader>

                  <p className="text-xs text-slate-600 dark:text-slate-400">                <CardContent className="space-y-2">

                    Active apps                  <Button className="w-full" variant="outline">

                  </p>                    Refresh Device Info

                </CardContent>                  </Button>

              </Card>                  <Button className="w-full" variant="outline">

            </div>                    Sync Storage

                  </Button>

            {/* Recent Activity */}                  <Button className="w-full" variant="outline">

            <Card>                    View Logs

              <CardHeader>                  </Button>

                <CardTitle>Recent Activity</CardTitle>                </CardContent>

                <CardDescription>Latest device interactions and events</CardDescription>              </Card>

              </CardHeader>            </div>

              <CardContent>          </TabsContent>

                <div className="space-y-4">

                  <div className="flex items-center space-x-4">          <TabsContent value="storage" className="space-y-6">

                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>            <Card>

                    <div className="flex-1">              <CardHeader>

                      <p className="text-sm font-medium">Device connected successfully</p>                <CardTitle>Device Storage Management</CardTitle>

                      <p className="text-xs text-slate-600 dark:text-slate-400">2 minutes ago</p>                <CardDescription>Manage files and data stored on your R1 device</CardDescription>

                    </div>              </CardHeader>

                  </div>              <CardContent>

                  <div className="flex items-center space-x-4">                <div className="space-y-4">

                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>                  <div className="grid grid-cols-2 gap-4">

                    <div className="flex-1">                    <div>

                      <p className="text-sm font-medium">Media controls initialized</p>                      <Label htmlFor="storage-used">Storage Used</Label>

                      <p className="text-xs text-slate-600 dark:text-slate-400">5 minutes ago</p>                      <Input id="storage-used" value={deviceInfo?.storageUsed || '0 MB'} readOnly />

                    </div>                    </div>

                  </div>                    <div>

                  <div className="flex items-center space-x-4">                      <Label htmlFor="storage-total">Total Storage</Label>

                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>                      <Input id="storage-total" value={deviceInfo?.storageTotal || 'Unknown'} readOnly />

                    <div className="flex-1">                    </div>

                      <p className="text-sm font-medium">Storage synced</p>                  </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">10 minutes ago</p>                  <div className="space-y-2">

                    </div>                    <Button className="w-full">Browse Files</Button>

                  </div>                    <Button variant="outline" className="w-full">Upload File</Button>

                </div>                    <Button variant="outline" className="w-full">Download Backup</Button>

              </CardContent>                  </div>

            </Card>                </div>

          </TabsContent>              </CardContent>

            </Card>

          <TabsContent value="media" className="space-y-6">          </TabsContent>

            <Card>

              <CardHeader>          <TabsContent value="security" className="space-y-6">

                <CardTitle>Media Control</CardTitle>            <Card>

                <CardDescription>Control music playback on your R1 device</CardDescription>              <CardHeader>

              </CardHeader>                <CardTitle>Security Settings</CardTitle>

              <CardContent className="space-y-4">                <CardDescription>Manage PIN codes and access controls</CardDescription>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">              </CardHeader>

                  <Button className="h-16" variant="outline">              <CardContent>

                    <div className="text-center">                <div className="space-y-4">

                      <div className="text-2xl mb-1">🎵</div>                  <div>

                      <div className="text-xs">Spotify</div>                    <Label htmlFor="current-pin">Current PIN</Label>

                    </div>                    <Input

                  </Button>                      id="current-pin"

                  <Button className="h-16" variant="outline">                      type="password"

                    <div className="text-center">                      value={pinCode}

                      <div className="text-2xl mb-1">▶️</div>                      onChange={(e) => setPinCode(e.target.value)}

                      <div className="text-xs">YouTube</div>                      placeholder="Enter current PIN"

                    </div>                    />

                  </Button>                  </div>

                  <Button className="h-16" variant="outline">                  <div>

                    <div className="text-center">                    <Label htmlFor="new-pin">New PIN</Label>

                      <div className="text-2xl mb-1">🎶</div>                    <Input

                      <div className="text-xs">Apple Music</div>                      id="new-pin"

                    </div>                      type="password"

                  </Button>                      placeholder="Enter new PIN"

                  <Button className="h-16" variant="outline">                    />

                    <div className="text-center">                  </div>

                      <div className="text-2xl mb-1">🏠</div>                  <div className="space-y-2">

                      <div className="text-xs">Jellyfin</div>                    <Button className="w-full">Update PIN</Button>

                    </div>                    <Button variant="outline" className="w-full">

                  </Button>                      {pinCode ? 'Disable PIN' : 'Enable PIN'}

                </div>                    </Button>

                  </div>

                <div className="border-t pt-4">                </div>

                  <h4 className="font-medium mb-2">Now Playing</h4>              </CardContent>

                  <div className="flex items-center space-x-3">            </Card>

                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>          </TabsContent>

                    <div>

                      <p className="font-medium">No track playing</p>          <TabsContent value="apps" className="space-y-6">

                      <p className="text-sm text-slate-600 dark:text-slate-400">Select a service above</p>            <Card>

                    </div>              <CardHeader>

                  </div>                <CardTitle>App Management</CardTitle>

                </div>                <CardDescription>Control MCP servers and plugins</CardDescription>

              </CardContent>              </CardHeader>

            </Card>              <CardContent>

          </TabsContent>                <div className="space-y-4">

                  <p className="text-sm text-slate-600 dark:text-slate-400">

          <TabsContent value="storage" className="space-y-6">                    App management features coming soon...

            <Card>                  </p>

              <CardHeader>                  <Button variant="outline" className="w-full">

                <CardTitle>Storage Management</CardTitle>                    View Installed Apps

                <CardDescription>Manage files and data stored on your R1 device</CardDescription>                  </Button>

              </CardHeader>                </div>

              <CardContent className="space-y-4">              </CardContent>

                <div className="grid grid-cols-2 gap-4">            </Card>

                  <div>          </TabsContent>

                    <Label htmlFor="storage-used">Storage Used</Label>        </Tabs>

                    <Input id="storage-used" value={deviceInfo?.storageUsed || '2.4 GB'} readOnly />      </div>

                  </div>    </div>

                  <div>  );

                    <Label htmlFor="storage-total">Total Storage</Label>}

                    <Input id="storage-total" value={deviceInfo?.storageTotal || '8 GB'} readOnly />

                  </div>export default App;
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">30% of storage used</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button>Browse Files</Button>
                  <Button variant="outline">Upload File</Button>
                  <Button variant="outline">Download Backup</Button>
                  <Button variant="outline">Free Up Space</Button>
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">PIN Protection</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Require PIN for device access</p>
                  </div>
                  <Button variant={pinCode ? "default" : "outline"}>
                    {pinCode ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="border-t pt-4 space-y-4">
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
                  <Button>Update PIN</Button>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Spotify Controller</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Control Spotify playback</p>
                      <Button size="sm" variant="outline">Running</Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">File System MCP</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">File management server</p>
                      <Button size="sm" variant="outline">Running</Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">CopyParty</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">File sharing service</p>
                      <Button size="sm" variant="outline">Stopped</Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">YouTube API</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">YouTube integration</p>
                      <Button size="sm" variant="outline">Stopped</Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Button>Add New App</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;