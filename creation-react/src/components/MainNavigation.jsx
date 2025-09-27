import { useState } from 'react'
import SongCarousel from './song-carousel'

const MainNavigation = ({ onNavigate }) => {
  const navigationItems = [
    {
      id: 'media',
      title: 'Media Controls',
      subtitle: 'Spotify, YouTube Music, Apple Music',
      difficulty: 'normal',
      stars: 4,
      image: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)', // Spotify green
    },
    {
      id: 'device',
      title: 'Device Management',
      subtitle: 'Storage, PIN, Settings',
      difficulty: 'hard',
      stars: 3,
      image: 'linear-gradient(135deg, #007acc 0%, #005999 100%)', // Blue
    },
    {
      id: 'sharing',
      title: 'File Sharing',
      subtitle: 'CopyParty & Boop Share',
      difficulty: 'expert',
      stars: 5,
      image: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', // Orange
    },
    {
      id: 'apps',
      title: 'Apps & Plugins',
      subtitle: 'MCP Servers, Extensions',
      difficulty: 'insane',
      stars: 6,
      image: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)', // Purple
    },
    {
      id: 'console',
      title: 'Console & Logs',
      subtitle: 'System monitoring',
      difficulty: 'normal',
      stars: 2,
      image: 'linear-gradient(135deg, #424242 0%, #212121 100%)', // Gray
    },
  ]

  const handleItemSelect = (item, index) => {
    console.log('Selected navigation item:', item)
    if (onNavigate) {
      onNavigate(item.id, item)
    }
  }

  const handleAction = (action, item, index) => {
    console.log('Action triggered:', action, 'for item:', item)
    if (onNavigate) {
      onNavigate(item.id, item, action)
    }
  }

  const renderActions = (item, index) => [
    {
      label: 'Open',
      action: 'open',
      variant: 'primary'
    },
    {
      label: 'Info',
      action: 'info',
      variant: 'secondary'
    }
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          R-Control One
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Select an option to continue
        </p>

        <SongCarousel
          items={navigationItems}
          onItemSelect={handleItemSelect}
          onAction={handleAction}
          renderActions={renderActions}
          itemHeight={100}
          maxVisibleItems={5}
          className="h-[600px]"
        />
      </div>
    </div>
  )
}

export default MainNavigation