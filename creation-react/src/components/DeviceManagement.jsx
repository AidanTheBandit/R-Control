import { useState } from 'react'

const DeviceManagement = ({ onBack, deviceInfo, onRefreshDeviceInfo, onChangePin, onDisablePin, onEnablePin }) => {
  const [pinEnabled, setPinEnabled] = useState(true)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const handlePinToggle = () => {
    if (pinEnabled) {
      onDisablePin()
      setPinEnabled(false)
    } else {
      onEnablePin()
      setPinEnabled(true)
    }
  }

  const handlePinChange = () => {
    if (newPin !== confirmPin) {
      alert('PINs do not match')
      return
    }
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      alert('PIN must be 6 digits')
      return
    }
    onChangePin(newPin)
    setNewPin('')
    setConfirmPin('')
  }

  return (
    <div className="main-content bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="p-6">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
        >
          ← Back to Navigation
        </button>

        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-white">Device Management</h2>

          {/* Device Info */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Device Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Device ID</label>
                <p className="text-white font-mono">{deviceInfo?.deviceId || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Battery</label>
                <p className="text-white">{deviceInfo?.battery || 'Unknown'}%</p>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Storage Used</label>
                <p className="text-white">{deviceInfo?.storageUsed || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Total Storage</label>
                <p className="text-white">{deviceInfo?.storageTotal || 'Unknown'}</p>
              </div>
            </div>
            <button
              onClick={onRefreshDeviceInfo}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Info
            </button>
          </div>

          {/* PIN Management */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">PIN Security</h3>

            <div className="flex items-center justify-between mb-4">
              <span className="text-white">PIN Protection</span>
              <button
                onClick={handlePinToggle}
                className={`px-4 py-2 rounded transition-colors ${
                  pinEnabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {pinEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {pinEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">New PIN (6 digits)</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter new PIN"
                    maxLength="6"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Confirm PIN</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Confirm new PIN"
                    maxLength="6"
                  />
                </div>
                <button
                  onClick={handlePinChange}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Change PIN
                </button>
              </div>
            )}
          </div>

          {/* Device Actions */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Device Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-3 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Restart Device
              </button>
              <button className="px-4 py-3 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Factory Reset
              </button>
              <button className="px-4 py-3 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Update Firmware
              </button>
              <button className="px-4 py-3 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Backup Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceManagement