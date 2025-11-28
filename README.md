# 3D Particle System - Hand Controlled

An interactive 3D particle system web application that uses Three.js for rendering and MediaPipe Hands for real-time hand tracking. Control particles with your hands through your webcam!

![Particle System Demo](pic/demo.png)

## ✨ Features

- **Hand Tracking**: Real-time hand detection using MediaPipe Hands
  - Use two hands to control particle expansion (distance between hands)
  - Use one hand to control with finger spread
- **5 Particle Shapes**: 
  - ❤️ Heart
  - 🌸 Flower
  - 🪐 Saturn (Planet + Ring)
  - 🧘 Buddha (Abstract meditative shape)
  - 🎆 Fireworks (Explosion effect)
- **Interactive Controls**: lil-gui control panel for:
  - Shape switching
  - Particle color picker
  - Particle size adjustment
  - Rotation speed
  - Morph speed
- **Fullscreen Mode**: Dedicated button for immersive experience
- **Modern UI**: Clean, responsive design with glassmorphism effects

## 🚀 Quick Start

### Option 1: Open directly in browser
Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended).

### Option 2: Use a local server
For the best experience, serve the files with a local HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if http-server is installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 File Structure

```
├── index.html      # Main HTML file with CDN dependencies
├── style.css       # Styling with modern UI effects
├── script.js       # Three.js particle system & hand tracking logic
├── README.md       # This file
└── pic/            # Screenshots and images
```

## 🎮 How to Use

1. **Allow Camera Access**: When prompted, allow the browser to access your webcam
2. **Show Your Hands**: Hold up one or two hands in front of the camera
3. **Control Particles**:
   - **Two hands**: Move hands apart to expand particles, closer to contract
   - **One hand**: Spread fingers to expand, close fist to contract
4. **Use Control Panel**: Click controls in the top-right to:
   - Switch between shapes
   - Change particle colors
   - Adjust visual parameters
5. **Fullscreen**: Click the ⛶ button in the bottom-left corner

## 🔧 Technologies Used

- [Three.js](https://threejs.org/) - 3D graphics library
- [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) - Hand tracking ML model
- [lil-gui](https://lil-gui.georgealways.com/) - Lightweight GUI for controls

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (may require camera permission settings)
- ⚠️ Mobile browsers (limited hand tracking support)

## 🎨 Customization

You can customize the particle system by modifying `config` in `script.js`:

```javascript
const config = {
    particleCount: 5000,      // Number of particles
    particleSize: 3,          // Default particle size
    particleColor: '#ff6b9d', // Default color (pink)
    rotationSpeed: 0.002,     // Auto-rotation speed
    morphSpeed: 0.05,         // Shape transition speed
    autoRotate: true          // Enable/disable rotation
};
```

## 📄 License

This project is open source. Feel free to use, modify, and distribute.
