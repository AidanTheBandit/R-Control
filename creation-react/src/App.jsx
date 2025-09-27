import { useEffect, useState } from 'react'
import './App.css'
import StatusBar from './components/StatusBar'
import ConsolePanel from './components/ConsolePanel'
import MainNavigation from './components/MainNavigation'
import MediaControls from './components/MediaControls'
import DeviceManagement from './components/DeviceManagement'
import FileSharing from './components/FileSharing'
import AppsManagement from './components/AppsManagement'
import { useConsole } from './hooks/useConsole'
import { useSocket } from './hooks/useSocket'
import { useR1SDK } from './hooks/useR1SDK'
import { useDeviceManagement } from './hooks/useDeviceManagement'

function App() {
  const [currentView, setCurrentView] = useState('navigation') // 'navigation', 'console', 'media', etc.

  // Console logging hook
  const { consoleLogs, consoleRef, addConsoleLog, sendErrorToServer } = useConsole()

  // Socket connection hook
  const {
    isConnected,
    deviceId,
    deviceInfo,
    socketRef,
    connectSocket,
    handleReconnect,
    setDeviceInfo
  } = useSocket(addConsoleLog, sendErrorToServer)

  // R1 SDK hook
  useR1SDK(addConsoleLog, sendErrorToServer, socketRef)

  // Device management hook
  const {
    handleRefreshDeviceInfo,
    handleDisablePin,
    handleEnablePin,
    handleChangePin
  } = useDeviceManagement(deviceId, deviceInfo, setDeviceInfo, addConsoleLog, sendErrorToServer)

  // Initialize on mount
  useEffect(() => {
    addConsoleLog('R1 Anywhere Console initialized')

    // Override console methods for error logging
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.error = (...args) => {
      const message = args.join(' ')
      const stack = new Error().stack
      sendErrorToServer('error', message, stack)
      originalConsoleError.apply(console, args)
    }

    console.warn = (...args) => {
      const message = args.join(' ')
      sendErrorToServer('warn', message)
      originalConsoleWarn.apply(console, args)
    }

    // Global error handlers
    window.addEventListener('error', (event) => {
      sendErrorToServer('error', event.message, event.error?.stack)
    })

    window.addEventListener('unhandledrejection', (event) => {
      sendErrorToServer('error', `Unhandled promise rejection: ${event.reason}`, event.reason?.stack)
    })

    // Connect socket after hooks are initialized
    connectSocket()

    // Cleanup
    return () => {
      if (socketRef.current) {
        if (socketRef.current._heartbeatInterval) {
          clearInterval(socketRef.current._heartbeatInterval)
        }
        socketRef.current.disconnect()
      }
    }
  }, [addConsoleLog, sendErrorToServer, connectSocket, socketRef])

  const handleNavigate = (viewId, item, action) => {
    console.log('Navigating to:', viewId, 'with action:', action)
    setCurrentView(viewId)

    // Handle specific actions
    switch (viewId) {
      case 'music':
        addConsoleLog(`Opening music player: ${item.title}`)
        break
      case 'media':
        addConsoleLog(`Opening media controls: ${item.title}`)
        break
      case 'options':
        addConsoleLog(`Opening options: ${item.title}`)
        break
      default:
        addConsoleLog(`Unknown navigation: ${viewId}`)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'music':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Music Player</h2>
              <p className="text-green-200 mb-8 text-lg">Play music from Spotify, YouTube Music, Apple Music & Copyparty</p>
              <div className="space-y-4">
                <p className="text-green-300">Share songs using Boop</p>
                <p className="text-green-400">Stream from multiple services</p>
              </div>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'media':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Media Controls</h2>
              <p className="text-blue-200 mb-8 text-lg">Control media playback on other devices</p>
              <div className="space-y-4">
                <p className="text-blue-300">Android, Apple TV, Jellyfin, Plex</p>
                <p className="text-blue-400">Universal remote control</p>
              </div>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'options':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Options</h2>
              <p className="text-gray-200 mb-8 text-lg">Settings, device management, and configuration</p>
              <div className="space-y-4">
                <p className="text-gray-300">Device settings</p>
                <p className="text-gray-400">PIN management</p>
                <p className="text-gray-400">Storage configuration</p>
              </div>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      default:
        return (
          <MainNavigation onNavigate={handleNavigate} />
        )
    }
  }

  return (
    <div className="app">
      {/* Main Content */}
      {renderCurrentView()}
    </div>
  )
}

export default App