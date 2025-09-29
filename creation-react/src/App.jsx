import { useEffect, useState } from 'react'
import './App.css'
import MainNavigation from './components/MainNavigation'
import { useConsole } from './hooks/useConsole'
import { useSocket } from './hooks/useSocket'
import { useDeviceManagement } from './hooks/useDeviceManagement'
import { useR1SDK } from './hooks/useR1SDK'
import MediaControls from './components/MediaControls'

function App() {
  const [currentView, setCurrentView] = useState('navigation') // 'navigation', 'console', 'media', etc.

  // Enable hooks for backend functionality
  const { consoleLogs, consoleRef, addConsoleLog, sendErrorToServer } = useConsole()
  const {
    isConnected,
    deviceId,
    deviceInfo,
    socketRef,
    connectSocket,
    handleReconnect,
    setDeviceInfo
  } = useSocket(addConsoleLog, sendErrorToServer)
  const { handleRefreshDeviceInfo, handleDisablePin, handleEnablePin, handleChangePin } = useDeviceManagement(deviceId, deviceInfo, setDeviceInfo, addConsoleLog, sendErrorToServer)
  useR1SDK(addConsoleLog, sendErrorToServer, socketRef)

  // Initialize on mount
  useEffect(() => {
    addConsoleLog('R1 Anywhere Console initialized (backend disabled for UI testing)')

    // Override console methods for error logging
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.error = (...args) => {
      const message = args.join(' ')
      sendErrorToServer('error', message)
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

    // Skip socket connection for UI testing
    connectSocket()

    // Cleanup
    return () => {
      // if (socketRef.current) {
      //   if (socketRef.current._heartbeatInterval) {
      //     clearInterval(socketRef.current._heartbeatInterval)
      //   }
      //   socketRef.current.disconnect()
      // }
    }
  }, [addConsoleLog, sendErrorToServer])

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
      case 'apps':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Apps Management</h2>
              <p className="text-blue-200 mb-8 text-lg">Manage your applications</p>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'device':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Device Info</h2>
              <p className="text-green-200 mb-8 text-lg">View device information</p>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'files':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">File Sharing</h2>
              <p className="text-purple-200 mb-8 text-lg">Share files with device</p>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'media':
        return <MediaControls onBack={() => setCurrentView('navigation')} socket={socketRef} />
      case 'console':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Console Panel</h2>
              <p className="text-yellow-200 mb-8 text-lg">Access console commands</p>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'logs':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Logs Panel</h2>
              <p className="text-indigo-200 mb-8 text-lg">View system logs</p>
              <button
                onClick={() => setCurrentView('navigation')}
                className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xl font-semibold"
              >
                ← Back to Navigation
              </button>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="main-content flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Settings</h2>
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