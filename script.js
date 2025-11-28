// ============================================
// 3D Particle System with Hand Tracking
// Uses Three.js and MediaPipe Hands
// ============================================

// CDN URLs for external resources
const MEDIAPIPE_CDN_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands';

// Global variables
let scene, camera, renderer, particles;
let particlePositions = [];
let targetPositions = [];
let originalPositions = [];
let handDistance = 0;
let handsDetected = false;
let animationId;

// Configuration
const config = {
    particleCount: 5000,
    particleSize: 3,
    particleColor: '#ff6b9d',
    currentShape: 'Heart',
    expansionFactor: 1.0,
    rotationSpeed: 0.002,
    morphSpeed: 0.05,
    autoRotate: true
};

// Available shapes
const shapes = ['Heart', 'Flower', 'Saturn', 'Buddha', 'Fireworks'];

// ============================================
// Initialization
// ============================================

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    
    // Create renderer
    const canvas = document.getElementById('canvas3d');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particle system
    createParticles();
    
    // Generate initial shape
    generateShape(config.currentShape);
    
    // Add ambient fog effect
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.015);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Setup GUI
    setupGUI();
    
    // Setup fullscreen button
    setupFullscreenButton();
    
    // Setup hand tracking
    setupHandTracking();
    
    // Start animation loop
    animate();
}

// ============================================
// Particle System
// ============================================

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(config.particleCount * 3);
    targetPositions = new Float32Array(config.particleCount * 3);
    originalPositions = new Float32Array(config.particleCount * 3);
    
    // Initialize with random positions
    for (let i = 0; i < config.particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 100;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Create circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create material with custom color
    const material = new THREE.PointsMaterial({
        size: config.particleSize,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: new THREE.Color(config.particleColor)
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// ============================================
// Shape Generators
// ============================================

function generateShape(shapeName) {
    config.currentShape = shapeName;
    
    switch (shapeName) {
        case 'Heart':
            generateHeart();
            break;
        case 'Flower':
            generateFlower();
            break;
        case 'Saturn':
            generateSaturn();
            break;
        case 'Buddha':
            generateBuddha();
            break;
        case 'Fireworks':
            generateFireworks();
            break;
    }
    
    // Store original positions for expansion effect
    originalPositions.set(targetPositions);
}

function generateHeart() {
    for (let i = 0; i < config.particleCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const u = Math.random() * Math.PI;
        const r = 15 + Math.random() * 2;
        
        // Heart parametric equations
        const x = r * 16 * Math.pow(Math.sin(t), 3) / 16;
        const y = r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
        const z = (Math.random() - 0.5) * 5;
        
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;
    }
}

function generateFlower() {
    const petalCount = 6;
    const layers = 8;
    
    for (let i = 0; i < config.particleCount; i++) {
        const layer = Math.floor(Math.random() * layers);
        const angle = Math.random() * Math.PI * 2;
        const petalAngle = Math.floor(angle / (Math.PI * 2 / petalCount)) * (Math.PI * 2 / petalCount);
        const angleOffset = angle - petalAngle;
        
        // Petal shape
        const petalR = 8 + layer * 1.5;
        const petalWidth = Math.cos(angleOffset * petalCount) * petalR * 0.5;
        const r = petalR + petalWidth;
        
        const x = r * Math.cos(angle) * (0.5 + Math.random() * 0.5);
        const y = r * Math.sin(angle) * (0.5 + Math.random() * 0.5);
        const z = (layer - layers / 2) * 1.5 + (Math.random() - 0.5) * 2;
        
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;
    }
    
    // Add center
    const centerCount = Math.floor(config.particleCount * 0.1);
    for (let i = 0; i < centerCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = Math.random() * 5;
        
        targetPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        targetPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        targetPositions[i * 3 + 2] = r * Math.cos(phi);
    }
}

function generateSaturn() {
    const planetParticles = Math.floor(config.particleCount * 0.6);
    const ringParticles = config.particleCount - planetParticles;
    
    // Generate planet (sphere)
    for (let i = 0; i < planetParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 10 + Math.random() * 2;
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y * 0.9; // Slightly flatten
        targetPositions[i * 3 + 2] = z;
    }
    
    // Generate ring
    for (let i = planetParticles; i < config.particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 16 + Math.random() * 10;
        const thickness = (Math.random() - 0.5) * 1;
        
        const x = r * Math.cos(angle);
        const y = thickness;
        const z = r * Math.sin(angle);
        
        // Tilt the ring
        const tiltAngle = Math.PI * 0.15;
        const rotatedY = y * Math.cos(tiltAngle) - z * Math.sin(tiltAngle);
        const rotatedZ = y * Math.sin(tiltAngle) + z * Math.cos(tiltAngle);
        
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = rotatedY;
        targetPositions[i * 3 + 2] = rotatedZ;
    }
}

function generateBuddha() {
    // Abstract meditative shape - sitting figure silhouette
    for (let i = 0; i < config.particleCount; i++) {
        const section = Math.random();
        let x, y, z;
        
        if (section < 0.3) {
            // Head (sphere on top)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 4 + Math.random();
            
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta) + 15;
            z = r * Math.cos(phi);
        } else if (section < 0.6) {
            // Body (oval shape)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const rx = 7;
            const ry = 8;
            const rz = 5;
            
            x = rx * Math.sin(phi) * Math.cos(theta);
            y = ry * Math.sin(phi) * Math.sin(theta) + 5;
            z = rz * Math.cos(phi);
        } else if (section < 0.85) {
            // Crossed legs (flattened sphere at bottom)
            const theta = Math.random() * Math.PI * 2;
            const r = 8 + Math.random() * 4;
            const h = (Math.random() - 0.5) * 3;
            
            x = r * Math.cos(theta);
            y = h - 5;
            z = r * Math.sin(theta) * 0.6;
        } else {
            // Aura/halo effect
            const angle = Math.random() * Math.PI * 2;
            const r = 18 + Math.random() * 5;
            const yOffset = (Math.random() - 0.5) * 30;
            
            x = r * Math.cos(angle) * 0.3;
            y = yOffset + 5;
            z = r * Math.sin(angle) * 0.3;
        }
        
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;
    }
}

function generateFireworks() {
    const burstCount = 5;
    const particlesPerBurst = Math.floor(config.particleCount / burstCount);
    
    for (let burst = 0; burst < burstCount; burst++) {
        // Random center for each burst
        const centerX = (Math.random() - 0.5) * 40;
        const centerY = (Math.random() - 0.5) * 40;
        const centerZ = (Math.random() - 0.5) * 20;
        const burstRadius = 8 + Math.random() * 8;
        
        for (let i = 0; i < particlesPerBurst; i++) {
            const idx = burst * particlesPerBurst + i;
            if (idx >= config.particleCount) break;
            
            // Spherical explosion with trails
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = burstRadius * Math.pow(Math.random(), 0.5);
            
            // Add some trailing effect
            const trail = Math.random() * 0.3;
            
            const x = centerX + r * Math.sin(phi) * Math.cos(theta);
            const y = centerY + r * Math.sin(phi) * Math.sin(theta) - trail * 5;
            const z = centerZ + r * Math.cos(phi);
            
            targetPositions[idx * 3] = x;
            targetPositions[idx * 3 + 1] = y;
            targetPositions[idx * 3 + 2] = z;
        }
    }
}

// ============================================
// Hand Tracking Setup
// ============================================

function setupHandTracking() {
    const videoElement = document.getElementById('webcam');
    const statusText = document.getElementById('status-text');
    const statusContainer = document.getElementById('hand-status');
    
    // Initialize MediaPipe Hands
    const hands = new Hands({
        locateFile: (file) => {
            return `${MEDIAPIPE_CDN_BASE}/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandResults);
    
    // Setup camera
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                }
            });
            
            videoElement.srcObject = stream;
            
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                statusText.textContent = 'Hand tracking ready - Show your hands!';
                
                // Process video frames
                async function processFrame() {
                    if (videoElement.readyState >= 2) {
                        await hands.send({ image: videoElement });
                    }
                    requestAnimationFrame(processFrame);
                }
                processFrame();
            };
            
        } catch (error) {
            console.error('Camera access error:', error);
            statusText.textContent = 'Camera access denied - Using auto mode';
            startAutoMode();
        }
    }
    
    startCamera();
    
    function onHandResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            handsDetected = true;
            statusContainer.classList.add('tracking');
            
            if (results.multiHandLandmarks.length >= 2) {
                // Two hands detected - measure distance between them
                const hand1 = results.multiHandLandmarks[0];
                const hand2 = results.multiHandLandmarks[1];
                
                // Get palm centers (landmark 9 is middle of palm)
                const palm1 = hand1[9];
                const palm2 = hand2[9];
                
                // Calculate distance
                const dx = palm1.x - palm2.x;
                const dy = palm1.y - palm2.y;
                handDistance = Math.sqrt(dx * dx + dy * dy);
                
                // Map distance to expansion factor (0.1 to 0.8 distance -> 1 to 3 expansion)
                config.expansionFactor = THREE.MathUtils.mapLinear(
                    THREE.MathUtils.clamp(handDistance, 0.1, 0.8),
                    0.1, 0.8,
                    1.0, 3.0
                );
                
                statusText.textContent = `Two hands detected - Distance: ${(handDistance * 100).toFixed(0)}%`;
            } else {
                // One hand detected - use finger spread
                const hand = results.multiHandLandmarks[0];
                
                // Measure spread between thumb tip and pinky tip
                const thumb = hand[4];
                const pinky = hand[20];
                
                const dx = thumb.x - pinky.x;
                const dy = thumb.y - pinky.y;
                const fingerSpread = Math.sqrt(dx * dx + dy * dy);
                
                // Map finger spread to expansion (0.1 to 0.4 -> 1 to 2.5)
                config.expansionFactor = THREE.MathUtils.mapLinear(
                    THREE.MathUtils.clamp(fingerSpread, 0.1, 0.4),
                    0.1, 0.4,
                    1.0, 2.5
                );
                
                statusText.textContent = `One hand detected - Spread: ${(fingerSpread * 100).toFixed(0)}%`;
            }
        } else {
            handsDetected = false;
            statusContainer.classList.remove('tracking');
            statusText.textContent = 'Show your hands to control particles';
            
            // Gradually return to normal
            config.expansionFactor = THREE.MathUtils.lerp(config.expansionFactor, 1.0, 0.02);
        }
    }
}

function startAutoMode() {
    // Fallback auto animation when camera is not available
    let time = 0;
    setInterval(() => {
        time += 0.02;
        config.expansionFactor = 1.5 + Math.sin(time) * 0.5;
    }, 50);
}

// ============================================
// GUI Setup
// ============================================

function setupGUI() {
    const gui = new lil.GUI({ title: '🎮 Controls' });
    
    // Shape selector
    gui.add(config, 'currentShape', shapes)
        .name('Shape')
        .onChange((value) => {
            generateShape(value);
        });
    
    // Particle color
    gui.addColor(config, 'particleColor')
        .name('Particle Color')
        .onChange((value) => {
            particles.material.color.set(value);
        });
    
    // Particle size
    gui.add(config, 'particleSize', 1, 10, 0.5)
        .name('Particle Size')
        .onChange((value) => {
            particles.material.size = value;
        });
    
    // Rotation speed
    gui.add(config, 'rotationSpeed', 0, 0.02, 0.001)
        .name('Rotation Speed');
    
    // Morph speed
    gui.add(config, 'morphSpeed', 0.01, 0.2, 0.01)
        .name('Morph Speed');
    
    // Auto rotate toggle
    gui.add(config, 'autoRotate')
        .name('Auto Rotate');
    
    // Manual expansion control (when hands not available)
    gui.add(config, 'expansionFactor', 0.5, 4, 0.1)
        .name('Expansion')
        .listen();
}

// ============================================
// Fullscreen Toggle
// ============================================

function setupFullscreenButton() {
    const btn = document.getElementById('fullscreen-btn');
    const enterFullscreenIcon = '⛶';
    const exitFullscreenIcon = '⛏';
    
    btn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    document.addEventListener('fullscreenchange', () => {
        btn.textContent = document.fullscreenElement ? exitFullscreenIcon : enterFullscreenIcon;
    });
}

// ============================================
// Animation Loop
// ============================================

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const positions = particles.geometry.attributes.position.array;
    
    // Update particle positions with morphing and expansion
    for (let i = 0; i < config.particleCount; i++) {
        const i3 = i * 3;
        
        // Get target position with expansion
        const targetX = originalPositions[i3] * config.expansionFactor;
        const targetY = originalPositions[i3 + 1] * config.expansionFactor;
        const targetZ = originalPositions[i3 + 2] * config.expansionFactor;
        
        // Lerp towards target
        positions[i3] += (targetX - positions[i3]) * config.morphSpeed;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * config.morphSpeed;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * config.morphSpeed;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Auto rotation
    if (config.autoRotate) {
        particles.rotation.y += config.rotationSpeed;
        particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
    
    renderer.render(scene, camera);
}

// ============================================
// Window Resize Handler
// ============================================

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// Start Application
// ============================================

window.addEventListener('DOMContentLoaded', init);
