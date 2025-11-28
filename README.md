# 3D Particle System with Hand Tracking

A real-time interactive 3D particle system built with Three.js and MediaPipe Hands. Control particle expansion and diffusion using your webcam and hand gestures!

## Features

### 🖐️ Hand Tracking
- Uses **MediaPipe Hands** to detect hand gestures from your webcam
- Detects hand openness and distance between hands
- Controls particle expansion and scale in real-time

### 🎨 3D Particle Models
The particle system can morph into different shapes:
- **Heart**: Beautiful parametric heart shape
- **Flower**: Rose curve-based floral pattern
- **Saturn**: Planet sphere with surrounding rings
- **Buddha**: Meditating figure (geometric approximation)
- **Fireworks**: Dynamic exploding particles

### 🎛️ UI Control Panel
- Select different particle shapes
- Adjust particle color with color picker
- Control particle size, morph speed, and rotation
- Toggle auto-rotation

### ✨ Additional Features
- Fullscreen toggle button
- Webcam preview showing hand tracking status
- Smooth morphing transitions between shapes
- High-performance rendering with `THREE.Points` and `THREE.BufferGeometry`

## Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge)
2. Allow webcam access when prompted
3. Use the control panel to select shapes and colors
4. Open/close your hand to control particle expansion

## Technical Details

- **Three.js** for 3D rendering
- **MediaPipe Hands** for hand tracking
- **lil-gui** for the control panel
- All libraries loaded via CDN - no installation required!

## Browser Requirements

- Modern browser with WebGL support
- Webcam for hand tracking features
- HTTPS or localhost for camera access

## Controls

| Action | Effect |
|--------|--------|
| Open hand | Expand particles outward |
| Close hand | Contract particles |
| Two hands apart | Greater expansion |
| Control panel | Change shapes and colors |
| Fullscreen button | Toggle fullscreen mode |

## Files

- `index.html` - Single-file application with HTML, CSS, and JavaScript

## License

This project is open source. Feel free to use and modify as needed.
