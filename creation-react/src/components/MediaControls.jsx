import { useState, useEffect } from 'react'

const MediaControls = ({ onBack, socket }) => {
  const [currentService, setCurrentService] = useState('spotify')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    title: 'No track playing',
    artist: '',
    album: ''
  })

  const services = [
    { id: 'spotify', name: 'Spotify', color: 'from-green-400 to-green-600' },
    { id: 'youtube', name: 'YouTube Music', color: 'from-red-400 to-red-600' },
    { id: 'apple', name: 'Apple Music', color: 'from-pink-400 to-pink-600' },
    { id: 'jellyfin', name: 'Jellyfin', color: 'from-blue-400 to-blue-600' },
    { id: 'plex', name: 'Plex', color: 'from-orange-400 to-orange-600' },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (socket && socket.current) {
      socket.current.emit('media_control', {
        action: isPlaying ? 'pause' : 'play',
        service: currentService,
        timestamp: Date.now()
      })
    }
  }

  const handleNext = () => {
    if (socket && socket.current) {
      socket.current.emit('media_control', {
        action: 'next',
        service: currentService,
        timestamp: Date.now()
      })
    }
  }

  const handlePrevious = () => {
    if (socket && socket.current) {
      socket.current.emit('media_control', {
        action: 'previous',
        service: currentService,
        timestamp: Date.now()
      })
    }
  }

  const handleVolumeChange = (volume) => {
    if (socket && socket.current) {
      socket.current.emit('volume_control', {
        volume: parseInt(volume),
        service: currentService,
        timestamp: Date.now()
      })
    }
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
          {/* Service Selection */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Media Controls</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setCurrentService(service.id)}
                  className={`p-4 rounded-lg text-white font-medium transition-all ${
                    currentService === service.id
                      ? `bg-gradient-to-r ${service.color} shadow-lg scale-105`
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>

          {/* Now Playing */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Now Playing</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-700 rounded flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{currentTrack.title}</h4>
                <p className="text-slate-400">{currentTrack.artist}</p>
                <p className="text-slate-500 text-sm">{currentTrack.album}</p>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={handlePrevious}
                className="p-3 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors"
              >
                ⏮️
              </button>
              <button
                onClick={handlePlayPause}
                className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xl"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors"
              >
                ⏭️
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Volume</h3>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              onChange={(e) => handleVolumeChange(e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaControls