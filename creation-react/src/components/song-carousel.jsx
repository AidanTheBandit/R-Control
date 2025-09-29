import React, { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "../lib/utils"

const SongCarousel = ({
  items = [],
  onItemSelect,
  className,
  renderItem,
  itemHeight = 80,
  maxVisibleItems = 5,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(Math.min(2, items.length - 1))
  const [isAnimating, setIsAnimating] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [lastScrollTime, setLastScrollTime] = useState(0)
  const containerRef = useRef(null)

  // Default renderer
  const defaultRenderItem = (item, index) => ({
    title: item.title || item.name || `Item ${index + 1}`,
    artist: item.artist || item.subtitle || item.description || '',
    difficulty: item.difficulty || 'normal',
    stars: item.stars || 5,
    image: item.image || item.albumArt,
  })

  const getItemData = (item, index) => {
    if (renderItem) {
      return renderItem(item, index)
    }
    return defaultRenderItem(item, index)
  }

  const albumArts = [
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #91a7ff 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  ]

  const difficultyColors = {
    normal: "from-teal-400 to-teal-600",
    hard: "from-yellow-300 to-orange-400",
    insane: "from-pink-400 to-pink-600",
    expert: "from-purple-400 to-purple-600",
    extra: "from-pink-500 to-pink-700",
  }

  const StarRating = ({ stars }) => {
    const fullStars = Math.floor(stars)
    const hasHalf = stars % 1 !== 0
    const emptyStars = 6 - Math.ceil(stars)

    return (
      <div className="flex gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <div
            key={`full-${i}`}
            className="w-3 h-3 bg-yellow-400"
            style={{
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        ))}
        {hasHalf && (
          <div
            className="w-3 h-3"
            style={{
              background: "linear-gradient(90deg, #fbbf24 50%, #6b7280 50%)",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-3 h-3 bg-gray-500"
            style={{
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        ))}
      </div>
    )
  }

  const ItemCard = ({
    item,
    index,
    angle,
    distance,
    onClick,
    isSelected,
  }) => {
    const itemData = getItemData(item, index)

    return (
      <div
        className={cn(
          "absolute w-[120px] h-[60px] rounded-lg flex items-center cursor-pointer overflow-hidden transition-all duration-300 ease-out transform-gpu song-card",
          `bg-gradient-to-r ${difficultyColors[itemData.difficulty] || 'from-gray-400 to-gray-600'}`,
          isSelected && "scale-110 shadow-2xl z-50",
          "hover:scale-105 hover:shadow-xl",
        )}
        onClick={onClick}
        style={{
          transform: `rotate(${angle}deg) translate(${distance}px) rotate(-${angle}deg)`,
          transformOrigin: '0 0',
          left: '50%',
          top: '50%',
          marginLeft: '-60px', // Half of 120px
          marginTop: '-30px', // Half of 60px
        }}
      >
        <div
          className="w-12 h-full flex-shrink-0 bg-cover bg-center rounded-l-lg"
          style={{ background: itemData.image || albumArts[index % albumArts.length] }}
        />
        <div className="flex-1 px-2 py-1 min-w-0">
          <div className="text-white font-bold text-xs truncate">{itemData.title}</div>
        </div>
      </div>
    )
  }

  const moveSelection = useCallback(
    (direction, triggerCallback = true) => {
      const newIndex = selectedIndex + direction
      if (newIndex >= 0 && newIndex < items.length) {
        setIsAnimating(true)
        setSelectedIndex(newIndex)

        setTimeout(() => setIsAnimating(false), 500)

        if (triggerCallback && onItemSelect) {
          onItemSelect(items[newIndex], newIndex)
        }
      }
    },
    [selectedIndex, items, onItemSelect],
  )

  const handleCardClick = useCallback(
    (index) => {
      if (index !== selectedIndex) {
        setIsAnimating(true)
        setSelectedIndex(index)

        setTimeout(() => setIsAnimating(false), 500)

        if (onItemSelect) {
          onItemSelect(items[index], index)
        }
      }
    },
    [selectedIndex, items, onItemSelect],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        moveSelection(-1, false)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        moveSelection(1, false)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (onItemSelect) {
          onItemSelect(items[selectedIndex], selectedIndex)
        }
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollTime < 300) return

      setLastScrollTime(now)

      const delta = e.deltaY > 0 ? 1 : -1
      setRotation(prev => prev + delta * 30) // Rotate by 30 degrees per scroll
      moveSelection(delta, false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("wheel", handleWheel)
    }
  }, [moveSelection, lastScrollTime])

  if (items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full text-white", className)}>
        No items to display
      </div>
    )
  }

  const rootRef = useRef(null)

  useEffect(() => {
    if (!rootRef.current) return

    const el = rootRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-viewport')
          } else {
            el.classList.remove('in-viewport')
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const numPetals = Math.min(items.length, maxVisibleItems)
  const angleStep = 360 / numPetals
  const centerRadius = 48 // 24 * 4px = 96px width, radius 48px
  const distance = centerRadius + 20 // Attach petals right after center edge

  return (
    <div ref={rootRef} className={cn("relative w-full h-full overflow-hidden song-carousel-animate", className)}>
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateX(${window.innerWidth * 0.1}px)`, // Center slightly right
        }}
      >
        <div
          className="relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Central circle */}
          <div
            className="absolute w-24 h-24 bg-white/20 rounded-full border-4 border-white/50 flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            R1
          </div>
          {items.slice(0, numPetals).map((item, index) => {
            const angle = index * angleStep
            const isSelected = index === selectedIndex % numPetals

            return (
              <ItemCard
                key={index}
                item={item}
                index={index}
                angle={angle}
                distance={distance}
                onClick={() => handleCardClick(index)}
                isSelected={isSelected}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SongCarousel