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
      case 'console':
        if (action === 'info') {
          addConsoleLog(`Opening console info for ${item.title}`)
        }
        break
      case 'media':
        addConsoleLog(`Opening media controls: ${item.title}`)
        break
      case 'device':
        addConsoleLog(`Opening device management: ${item.title}`)
        break
      case 'sharing':
        addConsoleLog(`Opening file sharing: ${item.title}`)
        break
      case 'apps':
        addConsoleLog(`Opening apps & plugins: ${item.title}`)
        break
      default:
        addConsoleLog(`Unknown navigation: ${viewId}`)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'console':
        return (
          <div className="main-content">
            <div className="p-4">
              <button
                onClick={() => setCurrentView('navigation')}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ← Back to Navigation
              </button>
            </div>
            <ConsolePanel consoleLogs={consoleLogs} ref={consoleRef} />
          </div>
        )
      case 'media':
        return (
          <MediaControls onBack={() => setCurrentView('navigation')} />
        )
      case 'device':
        return (
          <DeviceManagement
            onBack={() => setCurrentView('navigation')}
            deviceInfo={deviceInfo}
            onRefreshDeviceInfo={handleRefreshDeviceInfo}
            onChangePin={handleChangePin}
            onDisablePin={handleDisablePin}
            onEnablePin={handleEnablePin}
          />
        )
      case 'sharing':
        return (
          <FileSharing onBack={() => setCurrentView('navigation')} />
        )
      case 'apps':
        return (
          <AppsManagement onBack={() => setCurrentView('navigation')} />
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