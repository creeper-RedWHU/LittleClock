# 3D Interactive Particle System

A real-time interactive 3D particle system web application using **Three.js** for 3D rendering and **MediaPipe Hands** for webcam-based hand tracking.

## Demo

Use your hands to interact with beautiful 3D particle formations! Open/close your hands or change the distance between them to control particle expansion and diffusion in real-time.

## Features

### Core Technology
- **Three.js** for stunning 3D WebGL rendering
- **MediaPipe Hands** for real-time webcam-based hand tracking
- **lil-gui** for an elegant control panel

### Hand Interaction
- Real-time hand detection via webcam
- Open/close hand gestures to control particle expansion
- Two-hand distance detection for scaling effects
- Visual feedback showing detected hand landmarks

### Particle Shapes
The particle system can morph between five beautiful shapes:
- ❤️ **Heart** - Romantic heart shape
- 🌸 **Flower** - Multi-petal flower pattern
- 🪐 **Saturn** - Planet with ring system
- 🧘 **Buddha** - Abstract meditative figure
- 🎆 **Fireworks** - Explosive burst effect

### User Interface
- Modern, minimalist design with glass-morphism effects
- Control panel for:
  - Shape selection
  - Particle color picker
  - Particle size adjustment
  - Auto-rotation toggle
  - Rotation speed control
- Fullscreen toggle button
- Live webcam preview with hand tracking overlay

## Quick Start

### Option 1: Open directly in browser
Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended).

### Option 2: Use a local server
For the best experience, serve the files using a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## File Structure

```
├── index.html      # Main HTML file with CDN dependencies
├── style.css       # Modern UI styling
├── script.js       # Core application logic
└── README.md       # This documentation
```

## Browser Requirements

- Modern browser with WebGL support
- Camera access permission (for hand tracking)
- Chrome, Firefox, or Edge recommended

## How to Use

1. **Allow camera access** when prompted
2. **Use the control panel** (top-left) to:
   - Switch between particle shapes
   - Pick custom particle colors
   - Adjust particle size and rotation
3. **Interact with your hands**:
   - Hold up one hand and open/close it to control particle spread
   - Use two hands and vary the distance between them to scale the effect
4. **Click the fullscreen button** (top-right) for an immersive experience

## Dependencies (loaded via CDN)

- [Three.js](https://threejs.org/) v0.160.0 - 3D graphics library
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) - Hand tracking solution
- [lil-gui](https://lil-gui.georgealways.com/) v0.19 - GUI control panel

## Legacy Content

The `WindowsFormsApp2/` directory contains the original Windows Forms timer application written in C#/.NET Framework. This web application replaces the previous functionality with a modern, cross-platform 3D interactive experience.

## Contributing

Feel free to submit Pull Requests or report issues. This repository welcomes contributions to enhance the particle effects, add new shapes, or improve the hand tracking interaction.

## License

This project does not have an explicit license. Please add an appropriate license before using or distributing.
