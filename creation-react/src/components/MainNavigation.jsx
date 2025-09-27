import { useState } from 'react'
import SongCarousel from './song-carousel'

const MainNavigation = ({ onNavigate }) => {
  const navigationItems = [
    {
      id: 'media',
      title: 'Media Controls',
      subtitle: 'Spotify, YouTube Music, Apple Music',
      difficulty: 'normal',
      image: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)', // Spotify green
    },
    {
      id: 'device',
      title: 'Device Management',
      subtitle: 'Storage, PIN, Settings',
      difficulty: 'hard',
      image: 'linear-gradient(135deg, #007acc 0%, #005999 100%)', // Blue
    },
    {
      id: 'sharing',
      title: 'File Sharing',
      subtitle: 'CopyParty & Boop Share',
      difficulty: 'expert',
      image: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', // Orange
    },
    {
      id: 'apps',
      title: 'Apps & Plugins',
      subtitle: 'MCP Servers, Extensions',
      difficulty: 'insane',
      image: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)', // Purple
    },
    {
      id: 'console',
      title: 'Console & Logs',
      subtitle: 'System monitoring',
      difficulty: 'normal',
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
      <SongCarousel
        items={navigationItems}
        onItemSelect={handleItemSelect}
        onAction={handleAction}
        renderActions={renderActions}
        itemHeight={100}
        maxVisibleItems={5}
        className="h-full"
      />
    </div>
  )
}

export default MainNavigation