# Media Gallery Viewer

A dynamic media gallery viewer with server-side file scanning capabilities. Browse and view images, videos, and audio files with an elegant dark-themed interface.

## Features

- 🖼️ **Multi-format Support**: Images (JPG, PNG, GIF, WebP), Videos (MP4, MOV, WebM), Audio (MP3, WAV, OGG)
- 🔍 **Real-time Search**: Filter media files instantly
- 📁 **Folder Navigation**: Browse through directory structure
- 🎬 **Video Preview**: Hover to play video previews
- 🎵 **Audio Visualization**: Colorful animated audio file display
- 🖱️ **Context Menu**: Right-click to copy path, open files/folders
- 🌙 **Dark Theme**: Eye-friendly dark interface
- ⚡ **Performance Optimized**: Lazy loading and virtual scrolling

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dai-motoki/media-gallery-viewer.git
cd media-gallery-viewer
```

2. No additional dependencies required - uses native Node.js modules

## Configuration

1. Copy the sample configuration file:
```bash
cp .env.sample .env
```

2. Edit `.env` to set your target directory:
```bash
# .env file
# Scan target absolute path
SCAN_PATH=/path/to/your/media/directory  # Change this to your directory

# Server port
PORT=3333

# Scan settings
MAX_DEPTH=5
EXCLUDE_DIRS=node_modules,.git,.next,dist,build,.cache
```

### Important Configuration Notes

- **SCAN_PATH**: Set the absolute path to the directory you want to scan
- **PORT**: Default is 3333, change if needed
- **MAX_DEPTH**: How deep to scan subdirectories
- **EXCLUDE_DIRS**: Comma-separated list of directories to exclude

## Usage

1. Start the server:
```bash
node server.js
```
Or using npm:
```bash
npm start
```

2. Open your browser and navigate to:
```bash
http://localhost:3333
```

**重要**: 必ず `http://localhost:3333` 経由でアクセスしてください。`file:///` で直接HTMLファイルを開くと、画像・動画・音声が正しく表示されません。

## Features in Detail

### Media Display
- **Images**: Display with thumbnails
- **Videos**: Show first frame as thumbnail, play on hover
- **Audio**: Animated waveform visualization with colorful gradients

### Interactive Elements
- **Right-click menu**: 
  - Copy file path to clipboard
  - Open file with default application
  - Open containing folder
- **Hover effects**: Videos play automatically on mouse hover
- **Lightbox**: Click any media to view in fullscreen

### Performance
- **Lazy Loading**: Images load as you scroll
- **Virtual Scrolling**: Load files in batches of 50
- **Memory Management**: Automatic cleanup of video elements

## Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Any modern browser with ES6 support

## License

MIT License

## Author

[dai-motoki](https://github.com/dai-motoki)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.