import Carousel from './Carousel'

const menuItems = [
  { title: "Apps Management", subtitle: "Manage your applications", image: "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=Apps" },
  { title: "Device Info", subtitle: "View device information", image: "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=Device" },
  { title: "File Sharing", subtitle: "Share files with device", image: "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=Files" },
  { title: "Media Controls", subtitle: "Control media playback", image: "https://via.placeholder.com/80x80/F7DC6F/FFFFFF?text=Media" },
  { title: "Console Panel", subtitle: "Access console commands", image: "https://via.placeholder.com/80x80/BB8FCE/FFFFFF?text=Console" },
  { title: "Logs Panel", subtitle: "View system logs", image: "https://via.placeholder.com/80x80/85C1E9/FFFFFF?text=Logs" },
  { title: "Settings", subtitle: "Configure application", image: "https://via.placeholder.com/80x80/F8C471/FFFFFF?text=Settings" },
]

export default function MainNavigation({ onNavigate }) {
  const handleItemSelect = (item, index) => {
    // Map item titles to view IDs
    const viewMap = {
      "Apps Management": "apps",
      "Device Info": "device",
      "File Sharing": "files",
      "Media Controls": "media",
      "Console Panel": "console",
      "Logs Panel": "logs",
      "Settings": "settings",
    }
    const viewId = viewMap[item.title] || "navigation"
    onNavigate(viewId, item, "select")
  }

  return (
    <div className="w-full h-screen bg-black">
      <Carousel items={menuItems} onItemSelect={handleItemSelect} />
    </div>
  )
}
