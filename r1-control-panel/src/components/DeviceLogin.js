import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const DeviceLogin = ({
    deviceId,
    pinCode,
    onDeviceIdChange,
    onPinCodeChange,
    onLogin,
    error
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await onLogin(deviceId, pinCode);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-md space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">R-Control One</CardTitle>
                        <CardDescription>Connect to your R1 device</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="deviceId">Device ID *</Label>
                                <Input
                                    id="deviceId"
                                    type="text"
                                    value={deviceId}
                                    onChange={(e) => onDeviceIdChange(e.target.value)}
                                    placeholder="e.g., green-wolf-23"
                                    required
                                    disabled={isLoading}
                                />
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Your unique R1 device identifier
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pinCode">PIN Code (optional)</Label>
                                <Input
                                    id="pinCode"
                                    type="password"
                                    value={pinCode}
                                    onChange={(e) => onPinCodeChange(e.target.value)}
                                    placeholder="6-digit PIN (if enabled)"
                                    disabled={isLoading}
                                />
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Leave empty if PIN authentication is disabled
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !deviceId.trim()}
                            >
                                {isLoading ? 'Connecting...' : 'Connect to Device'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Install R1 Creation</CardTitle>
                        <CardDescription>Scan this QR code on your R1 device</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <QRCode
                            value={JSON.stringify({
                                title: "R1 Creation",
                                url: "https://r1a.boondit.site/creation",
                                description: "R-Control One UI for R1",
                                iconUrl: "https://boondit.site/icons/r1a.png",
                                themeColor: "#ff61f2"
                            })}
                            size={200}
                            fgColor="#1e293b"
                            bgColor="#ffffff"
                            level="M"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Security & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <h4 className="font-medium mb-1">🔒 Your Data Stays Private</h4>
                            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                                <li>• Device credentials stored locally in your browser</li>
                                <li>• Only you can access your R1 device</li>
                                <li>• No data shared with other users</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Need Help?</h4>
                            <p className="text-slate-600 dark:text-slate-400">
                                Find your device ID in the R1 Creation app. The PIN is shown when your R1 first connects.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeviceLogin;