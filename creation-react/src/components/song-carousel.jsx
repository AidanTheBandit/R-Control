import { useState, useEffect, useCallback } from "react"
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
  const [lastScrollTime, setLastScrollTime] = useState(0)

  // Default renderer
  const defaultRenderItem = (item, index) => ({
    title: item.title || item.name || `Item ${index + 1}`,
    subtitle: item.subtitle || item.artist || item.description || '',
    difficulty: item.difficulty || 'normal',
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

  const ItemCard = ({
    item,
    index,
    position,
    onClick,
    isAnimating,
  }) => {
    const itemData = getItemData(item, index)

    const getCardStyles = () => {
      const baseClasses =
        "absolute right-0 rounded-l-lg flex items-center cursor-pointer overflow-hidden transition-all duration-500 ease-out transform-gpu"

      switch (position) {
        case 0: // Center card - fully expanded
          return cn(
            baseClasses,
            "w-[600px] z-50 translate-x-0 scale-100 opacity-100 shadow-2xl",
            isAnimating && "transition-all duration-500 ease-out",
          )
        case 1:
        case -1: // Adjacent cards
          return cn(
            baseClasses,
            "w-[550px] z-40 translate-x-8 scale-[0.97] opacity-95",
            isAnimating && "transition-all duration-450 ease-out",
          )
        case 2:
        case -2: // Second tier
          return cn(
            baseClasses,
            "w-[500px] z-30 translate-x-16 scale-[0.94] opacity-85",
            isAnimating && "transition-all duration-400 ease-out",
          )
        case 3:
        case -3: // Third tier
          return cn(
            baseClasses,
            "w-[450px] z-20 translate-x-24 scale-[0.91] opacity-75",
            isAnimating && "transition-all duration-350 ease-out",
          )
        case 4:
        case -4: // Fourth tier
          return cn(
            baseClasses,
            "w-[400px] z-10 translate-x-32 scale-[0.88] opacity-65",
            isAnimating && "transition-all duration-300 ease-out",
          )
        case 5:
        case -5: // Fifth tier
          return cn(
            baseClasses,
            "w-[350px] z-5 translate-x-40 scale-[0.85] opacity-55",
            isAnimating && "transition-all duration-250 ease-out",
          )
        default: // Hidden cards
          return cn(
            baseClasses,
            "w-[300px] z-0 translate-x-52 scale-75 opacity-0",
            isAnimating && "transition-all duration-200 ease-out",
          )
      }
    }

    return (
      <div
        className={cn(
          getCardStyles(),
          `bg-gradient-to-r ${difficultyColors[itemData.difficulty] || 'from-gray-400 to-gray-600'}`,
          "hover:translate-x-[-20px] hover:scale-105 hover:shadow-3xl hover:z-[100]",
        )}
        onClick={onClick}
        style={{
          top: `${position * (itemHeight + 2) + 250}px`,
          height: `${itemHeight}px`,
          transformOrigin: "right center",
        }}
      >
        <div
          className="w-20 h-full flex-shrink-0 bg-cover bg-center"
          style={{ background: itemData.image || albumArts[index % albumArts.length] }}
        />
        <div className="flex-1 px-5 py-3 min-w-0">
          <div className="text-white font-bold text-base mb-1 truncate">{itemData.title}</div>
          <div className="text-white/90 text-sm truncate">{itemData.subtitle}</div>
        </div>
      </div>
    )
  }

  const moveSelection = useCallback(
    (direction) => {
      const newIndex = selectedIndex + direction
      if (newIndex >= 0 && newIndex < items.length) {
        setIsAnimating(true)
        setSelectedIndex(newIndex)

        setTimeout(() => setIsAnimating(false), 500)

        if (onItemSelect) {
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
        moveSelection(-1)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        moveSelection(1)
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollTime < 300) return

      setLastScrollTime(now)

      if (e.deltaY > 0) {
        moveSelection(1)
      } else {
        moveSelection(-1)
      }
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

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex flex-col justify-center items-end perspective-1000">
        <div className="relative h-[500px] w-[650px]">
          {items.map((item, index) => {
            const relativePosition = index - selectedIndex

            if (Math.abs(relativePosition) > Math.floor(maxVisibleItems / 2)) return null

            return (
              <ItemCard
                key={index}
                item={item}
                index={index}
                position={relativePosition}
                onClick={() => handleCardClick(index)}
                isAnimating={isAnimating}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SongCarousel