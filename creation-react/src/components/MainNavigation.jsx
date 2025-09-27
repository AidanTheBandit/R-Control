import { useState } from 'react'
import SongCarousel from './song-carousel'

const MainNavigation = ({ onNavigate }) => {
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')

  const navigationItems = [
    {
      id: 'music',
      title: 'Music',
      subtitle: 'Play from Spotify, YouTube Music, Apple Music & Copyparty',
      difficulty: 'normal',
      image: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)', // Spotify green
    },
    {
      id: 'media',
      title: 'Media Controls',
      subtitle: 'Control media playback on other devices',
      difficulty: 'hard',
      image: 'linear-gradient(135deg, #007acc 0%, #005999 100%)', // Blue
    },
    {
      id: 'options',
      title: 'Options',
      subtitle: 'Settings, device management, and configuration',
      difficulty: 'expert',
      image: 'linear-gradient(135deg, #424242 0%, #212121 100%)', // Gray
    },
  ]

  const handleAction = (action, item, index) => {
    console.log('Action triggered:', action, 'for item:', item)
    if (onNavigate) {
      onNavigate(item.id, item, action)
    }
  }

  const handleItemChange = (item, index) => {
    // Update background based on selected item
    const gradients = {
      music: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
      media: 'linear-gradient(135deg, #007acc 0%, #005999 100%)',
      options: 'linear-gradient(135deg, #424242 0%, #212121 100%)',
    }
    setBackgroundGradient(gradients[item.id] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  }

  return (
    <div
      className="w-full h-full transition-all duration-1000 ease-in-out"
      style={{ background: backgroundGradient }}
    >
      <div className="p-6">
        <SongCarousel
          items={navigationItems}
          onItemSelect={(item, index) => {
            handleItemSelect(item, index)
            handleItemChange(item, index)
          }}
          onAction={handleAction}
          itemHeight={100}
          maxVisibleItems={5}
          className="h-[600px]"
        />
      </div>
    </div>
  )
}

export default MainNavigation