import { useState, useEffect } from 'react'

const AppsManagement = ({ onBack }) => {
  const [apps, setApps] = useState([
    {
      id: 'spotify-controller',
      name: 'Spotify Controller',
      description: 'Control Spotify playback and playlists',
      status: 'running',
      version: '1.0.0',
      type: 'media'
    },
    {
      id: 'youtube-music',
      name: 'YouTube Music',
      description: 'Stream music from YouTube with ad blocking',
      status: 'stopped',
      version: '1.2.1',
      type: 'media'
    },
    {
      id: 'jellyfin-client',
      name: 'Jellyfin Client',
      description: 'Access your Jellyfin media server',
      status: 'running',
      version: '0.9.5',
      type: 'media'
    },
    {
      id: 'copy-party',
      name: 'CopyParty',
      description: 'File sharing and synchronization',
      status: 'running',
      version: '2.1.0',
      type: 'utility'
    },
    {
      id: 'boop-share',
      name: 'Boop Share',
      description: 'High-frequency audio file transfer',
      status: 'stopped',
      version: '0.5.2',
      type: 'utility'
    }
  ])

  const [mcpServers, setMcpServers] = useState([
    {
      id: 'filesystem',
      name: 'File System',
      description: 'Access and manage device files',
      status: 'running',
      tools: ['read_file', 'write_file', 'list_dir']
    },
    {
      id: 'spotify-api',
      name: 'Spotify API',
      description: 'Spotify Web API integration',
      status: 'running',
      tools: ['search_tracks', 'get_playlist', 'control_playback']
    },
    {
      id: 'youtube-api',
      name: 'YouTube API',
      description: 'YouTube Data API integration',
      status: 'stopped',
      tools: ['search_videos', 'get_channel_info']
    }
  ])

  const toggleAppStatus = (appId) => {
    setApps(apps.map(app =>
      app.id === appId
        ? { ...app, status: app.status === 'running' ? 'stopped' : 'running' }
        : app
    ))
  }

  const toggleMcpServer = (serverId) => {
    setMcpServers(mcpServers.map(server =>
      server.id === serverId
        ? { ...server, status: server.status === 'running' ? 'stopped' : 'running' }
        : server
    ))
  }

  const getStatusColor = (status) => {
    return status === 'running' ? 'text-green-400' : 'text-red-400'
  }

  const getStatusIcon = (status) => {
    return status === 'running' ? '🟢' : '🔴'
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

        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-white">Apps & Plugins</h2>

          {/* Apps Section */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Installed Apps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apps.map((app) => (
                <div key={app.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{app.name}</h4>
                      <p className="text-slate-400 text-sm">{app.description}</p>
                    </div>
                    <span className={`text-sm ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs">v{app.version}</span>
                    <button
                      onClick={() => toggleAppStatus(app.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        app.status === 'running'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {app.status === 'running' ? 'Stop' : 'Start'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MCP Servers Section */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">MCP Servers</h3>
            <p className="text-slate-400 mb-6">
              Model Context Protocol servers provide AI capabilities and integrations.
            </p>
            <div className="space-y-4">
              {mcpServers.map((server) => (
                <div key={server.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{server.name}</h4>
                      <p className="text-slate-400 text-sm mb-2">{server.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {server.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm block mb-2 ${getStatusColor(server.status)}`}>
                        {getStatusIcon(server.status)} {server.status}
                      </span>
                      <button
                        onClick={() => toggleMcpServer(server.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          server.status === 'running'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {server.status === 'running' ? 'Stop' : 'Start'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plugin Management */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Plugin Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                <div className="text-2xl mb-2">📦</div>
                <div className="font-medium">Install Plugin</div>
                <div className="text-sm text-slate-400">Add new functionality</div>
              </button>
              <button className="p-4 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-medium">Update All</div>
                <div className="text-sm text-slate-400">Update to latest versions</div>
              </button>
              <button className="p-4 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                <div className="text-2xl mb-2">🗂️</div>
                <div className="font-medium">Plugin Store</div>
                <div className="text-sm text-slate-400">Browse available plugins</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppsManagement