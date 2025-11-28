# 3D Particle System with Hand Gesture Control

An interactive 3D particle visualization system that uses hand gestures to control particle behavior in real-time. Built with Three.js for rendering and MediaPipe Hands for gesture recognition.

## Features

### Core Functionality
- **Real-time 3D Particle System**: A dense point cloud with smooth animations and transitions
- **Hand Gesture Control**: Use your webcam to detect hand gestures that control:
  - **Scale**: Open/close your hand to scale the particle system
  - **Diffusion**: Spread your fingers to scatter particles
- **Shape Morphing**: Smooth transitions between 5 different shapes:
  - ❤️ **Heart**: Parametric 3D heart shape
  - 🌸 **Flower**: Multi-petal flower pattern
  - 🪐 **Saturn**: Planet with orbital ring
  - 🧘 **Buddha**: Meditative seated figure
  - 🎆 **Fireworks**: Explosion burst pattern

### User Interface
- **Control Panel**: Floating panel (top-right) to:
  - Select active shape from dropdown
  - Pick particle color
  - Adjust particle size
  - Control rotation speed
- **Fullscreen Mode**: Modern semi-transparent button for immersive viewing
- **Hand Feedback**: Real-time indicator showing hand detection status

## Technology Stack

- **[Three.js](https://threejs.org/)**: 3D graphics rendering
- **[MediaPipe Hands](https://mediapipe.dev/)**: Real-time hand tracking
- **[Lil-GUI](https://lil-gui.georgealways.com/)**: Control panel interface

## Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended)
2. Allow camera access when prompted
3. Use the control panel to select shapes and colors
4. Move your hands in front of the camera to control the particles

## File Structure

```
├── index.html    # Main HTML file with canvas and CDN links
├── style.css     # Modern CSS styling for UI elements
├── script.js     # Three.js and MediaPipe logic
└── README.md     # This file
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 14+ (limited MediaPipe support)

## Requirements

- Modern web browser with WebGL support
- Webcam for hand gesture detection
- Camera permissions must be granted

## Usage Tips

- For best hand detection, ensure good lighting
- Keep hands within the camera frame
- Open/close hands to see particle scale changes
- Spread fingers to increase particle diffusion
- Use the control panel to experiment with different shapes and colors

## Notes

- The application handles camera permission errors gracefully
- Particles will still animate without hand tracking if camera access is denied
- All dependencies are loaded via CDN - no build step required
