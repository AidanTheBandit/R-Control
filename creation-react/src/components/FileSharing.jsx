import { useState } from 'react'

const FileSharing = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('copyparty')
  const [files, setFiles] = useState([])
  const [isReceiving, setIsReceiving] = useState(false)

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles(selectedFiles)
  }

  const handleSendFile = () => {
    // TODO: Implement file sending
    console.log('Sending files:', files)
  }

  const handleReceiveFile = () => {
    setIsReceiving(!isReceiving)
    // TODO: Implement file receiving
    console.log('Toggling receive mode:', !isReceiving)
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
          <h2 className="text-2xl font-bold text-white">File Sharing</h2>

          {/* Service Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('copyparty')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'copyparty'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              CopyParty
            </button>
            <button
              onClick={() => setActiveTab('boop')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'boop'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Boop Share
            </button>
          </div>

          {/* CopyParty Interface */}
          {activeTab === 'copyparty' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">CopyParty File Sharing</h3>
                <p className="text-slate-400 mb-4">
                  Share files with other devices on the same network using CopyParty protocol.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Select Files</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="bg-slate-700 rounded p-4">
                      <h4 className="text-white font-medium mb-2">Selected Files:</h4>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li key={index} className="text-slate-300 text-sm">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSendFile}
                      disabled={files.length === 0}
                      className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                      Send Files
                    </button>
                    <button
                      onClick={handleReceiveFile}
                      className={`px-6 py-3 rounded transition-colors ${
                        isReceiving
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isReceiving ? 'Stop Receiving' : 'Receive Files'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transfer History */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Transfer History</h3>
                <div className="text-center text-slate-400 py-8">
                  No recent transfers
                </div>
              </div>
            </div>
          )}

          {/* Boop Share Interface */}
          {activeTab === 'boop' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Boop Share</h3>
                <p className="text-slate-400 mb-4">
                  Share files using high-frequency audio signals. Perfect for quick sharing between nearby devices.
                </p>

                <div className="space-y-4">
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-4">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Boop Share works best when devices are close together (within 1-2 meters).
                      File size is limited to avoid long transfer times.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Select Small File</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e)}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                      accept=".txt,.jpg,.png,.pdf"
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="bg-slate-700 rounded p-4">
                      <h4 className="text-white font-medium mb-2">Selected File:</h4>
                      <p className="text-slate-300 text-sm">
                        {files[0].name} ({(files[0].size / 1024).toFixed(2)} KB)
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSendFile}
                      disabled={files.length === 0}
                      className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                      🎵 Send via Boop
                    </button>
                    <button
                      onClick={handleReceiveFile}
                      className={`px-6 py-3 rounded transition-colors ${
                        isReceiving
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isReceiving ? '🎵 Stop Listening' : '🎵 Listen for Boop'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileSharing