/**
 * 3D Interactive Particle System with Hand Tracking
 * Uses Three.js for 3D rendering and MediaPipe Hands for gesture detection
 */

// ============================================================================
// Configuration and Constants
// ============================================================================

const CONFIG = {
    particleCount: 5000,
    particleSize: 0.02,
    transitionSpeed: 0.02,
    rotationSpeed: 0.001,
    expansionFactor: 2.0,
    defaultColor: '#ff6b9d',
    shapes: ['Heart', 'Flower', 'Saturn', 'Buddha', 'Fireworks']
};

// ============================================================================
// Global Variables
// ============================================================================

let scene, camera, renderer, particles, particleMaterial;
let targetPositions = [];
let currentShape = 'Heart';
let handDistance = 0.5;
let handOpen = false;
let handsDetected = false;
let clock;
let gui;
let animationId;

const guiParams = {
    shape: 'Heart',
    color: CONFIG.defaultColor,
    particleSize: CONFIG.particleSize,
    autoRotate: true,
    rotationSpeed: CONFIG.rotationSpeed
};

// ============================================================================
// Shape Generation Functions
// ============================================================================

function generateHeartShape(count) {
    const positions = [];
    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const r = Math.random() * 0.3 + 0.7;
        
        // Heart parametric equations
        const x = 16 * Math.pow(Math.sin(t), 3) * 0.1 * r;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.1 * r;
        const z = (Math.random() - 0.5) * 0.5;
        
        positions.push(x, y, z);
    }
    return positions;
}

function generateFlowerShape(count) {
    const positions = [];
    const petalCount = 6;
    
    for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 * petalCount;
        const r = Math.cos(theta) * 0.5 + 0.8;
        const angle = (i / count) * Math.PI * 2;
        
        const x = r * Math.cos(angle) * (1 + Math.random() * 0.2);
        const y = r * Math.sin(angle) * (1 + Math.random() * 0.2);
        const z = (Math.random() - 0.5) * 0.3;
        
        positions.push(x, y, z);
    }
    return positions;
}

function generateSaturnShape(count) {
    const positions = [];
    const planetParticles = Math.floor(count * 0.6);
    const ringParticles = count - planetParticles;
    
    // Generate planet (sphere)
    for (let i = 0; i < planetParticles; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 0.5 * (0.8 + Math.random() * 0.2);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        positions.push(x, y, z);
    }
    
    // Generate ring (torus)
    for (let i = 0; i < ringParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const ringRadius = 0.9 + Math.random() * 0.4;
        const thickness = (Math.random() - 0.5) * 0.05;
        
        const x = ringRadius * Math.cos(angle);
        const y = thickness;
        const z = ringRadius * Math.sin(angle);
        
        positions.push(x, y, z);
    }
    return positions;
}

function generateBuddhaShape(count) {
    const positions = [];
    
    for (let i = 0; i < count; i++) {
        const t = i / count;
        
        // Create a meditative figure shape (lotus position silhouette)
        let x, y, z;
        
        if (t < 0.3) {
            // Head (sphere on top)
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = 0.25;
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta) + 0.9;
            z = r * Math.cos(phi);
        } else if (t < 0.6) {
            // Body (elongated sphere)
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = 0.35;
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * 0.6 * Math.sin(phi) * Math.sin(theta) + 0.4;
            z = r * Math.cos(phi);
        } else {
            // Lotus base (wide flat base)
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 0.8;
            x = r * Math.cos(angle);
            y = (Math.random() - 0.5) * 0.2;
            z = r * Math.sin(angle);
        }
        
        positions.push(x, y, z);
    }
    return positions;
}

function generateFireworksShape(count) {
    const positions = [];
    const burstCount = 5;
    const particlesPerBurst = Math.floor(count / burstCount);
    
    for (let burst = 0; burst < burstCount; burst++) {
        const centerX = (Math.random() - 0.5) * 2;
        const centerY = (Math.random() - 0.5) * 2;
        const centerZ = (Math.random() - 0.5) * 2;
        
        for (let i = 0; i < particlesPerBurst; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = Math.random() * 0.5;
            
            const x = centerX + r * Math.sin(phi) * Math.cos(theta);
            const y = centerY + r * Math.sin(phi) * Math.sin(theta);
            const z = centerZ + r * Math.cos(phi);
            
            positions.push(x, y, z);
        }
    }
    
    // Fill remaining particles
    while (positions.length / 3 < count) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.5;
        
        positions.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
    }
    
    return positions;
}

function getShapePositions(shapeName, count) {
    switch (shapeName) {
        case 'Heart': return generateHeartShape(count);
        case 'Flower': return generateFlowerShape(count);
        case 'Saturn': return generateSaturnShape(count);
        case 'Buddha': return generateBuddhaShape(count);
        case 'Fireworks': return generateFireworksShape(count);
        default: return generateHeartShape(count);
    }
}

// ============================================================================
// Three.js Setup
// ============================================================================

function initThreeJS() {
    const canvas = document.getElementById('particle-canvas');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 3;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    createParticles();
    
    // Clock for animations
    clock = new THREE.Clock();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CONFIG.particleCount * 3);
    const colors = new Float32Array(CONFIG.particleCount * 3);
    
    // Initialize with heart shape
    targetPositions = getShapePositions('Heart', CONFIG.particleCount);
    
    // Set initial positions (scattered randomly)
    for (let i = 0; i < CONFIG.particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5;
        positions[i + 1] = (Math.random() - 0.5) * 5;
        positions[i + 2] = (Math.random() - 0.5) * 5;
        
        // Initial color
        const color = new THREE.Color(CONFIG.defaultColor);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    particleMaterial = new THREE.PointsMaterial({
        size: CONFIG.particleSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Points
    particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
}

function updateParticleColors(colorHex) {
    const color = new THREE.Color(colorHex);
    const colors = particles.geometry.attributes.color.array;
    
    for (let i = 0; i < CONFIG.particleCount * 3; i += 3) {
        // Add slight variation for visual interest
        const variation = 0.9 + Math.random() * 0.2;
        colors[i] = color.r * variation;
        colors[i + 1] = color.g * variation;
        colors[i + 2] = color.b * variation;
    }
    
    particles.geometry.attributes.color.needsUpdate = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================================================
// Animation Loop
// ============================================================================

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    
    // Update particle positions
    updateParticles(delta, elapsed);
    
    // Auto rotation
    if (guiParams.autoRotate) {
        particles.rotation.y += guiParams.rotationSpeed;
    }
    
    renderer.render(scene, camera);
}

function updateParticles(delta, elapsed) {
    const positions = particles.geometry.attributes.position.array;
    
    // Calculate expansion based on hand interaction
    let expansion = 1.0;
    if (handsDetected) {
        if (handOpen) {
            expansion = 1.0 + handDistance * CONFIG.expansionFactor;
        } else {
            expansion = 0.5 + handDistance * 0.5;
        }
    }
    
    // Interpolate towards target positions
    for (let i = 0; i < CONFIG.particleCount * 3; i += 3) {
        const targetX = targetPositions[i] * expansion;
        const targetY = targetPositions[i + 1] * expansion;
        const targetZ = targetPositions[i + 2] * expansion;
        
        // Smooth interpolation
        positions[i] += (targetX - positions[i]) * CONFIG.transitionSpeed;
        positions[i + 1] += (targetY - positions[i + 1]) * CONFIG.transitionSpeed;
        positions[i + 2] += (targetZ - positions[i + 2]) * CONFIG.transitionSpeed;
        
        // Add subtle floating animation
        const floatOffset = Math.sin(elapsed * 2 + i * 0.01) * 0.005;
        positions[i + 1] += floatOffset;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
}

function changeShape(shapeName) {
    currentShape = shapeName;
    targetPositions = getShapePositions(shapeName, CONFIG.particleCount);
}

// ============================================================================
// MediaPipe Hands Setup
// ============================================================================

function initMediaPipeHands() {
    const videoElement = document.getElementById('webcam');
    const handCanvas = document.getElementById('hand-canvas');
    const handCtx = handCanvas.getContext('2d');
    
    // Set canvas size to match video
    handCanvas.width = 200;
    handCanvas.height = 150;
    
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    hands.onResults((results) => {
        // Clear hand canvas
        handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            handsDetected = true;
            
            // Draw hand landmarks
            for (const landmarks of results.multiHandLandmarks) {
                drawHandLandmarks(handCtx, landmarks);
            }
            
            // Process hand gestures
            processHandGestures(results.multiHandLandmarks);
        } else {
            handsDetected = false;
        }
    });
    
    // Start camera
    const cameraInstance = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 200,
        height: 150
    });
    
    cameraInstance.start().catch((err) => {
        console.warn('Camera access denied or not available:', err);
        document.getElementById('info-panel').innerHTML = `
            <p style="color: #ff6b6b;">Camera access denied</p>
            <p>Please allow camera access for hand tracking</p>
        `;
    });
}

function drawHandLandmarks(ctx, landmarks) {
    // Draw connections
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.6)';
    ctx.lineWidth = 2;
    
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [0, 9], [9, 10], [10, 11], [11, 12],
        [0, 13], [13, 14], [14, 15], [15, 16],
        [0, 17], [17, 18], [18, 19], [19, 20],
        [5, 9], [9, 13], [13, 17]
    ];
    
    for (const [start, end] of connections) {
        ctx.beginPath();
        ctx.moveTo(landmarks[start].x * 200, landmarks[start].y * 150);
        ctx.lineTo(landmarks[end].x * 200, landmarks[end].y * 150);
        ctx.stroke();
    }
    
    // Draw points
    ctx.fillStyle = 'rgba(255, 107, 157, 0.8)';
    for (const point of landmarks) {
        ctx.beginPath();
        ctx.arc(point.x * 200, point.y * 150, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function processHandGestures(multiHandLandmarks) {
    if (multiHandLandmarks.length === 1) {
        // Single hand - check if open or closed
        const landmarks = multiHandLandmarks[0];
        handOpen = isHandOpen(landmarks);
        handDistance = 0.5;
    } else if (multiHandLandmarks.length === 2) {
        // Two hands - calculate distance between them
        const hand1Center = getHandCenter(multiHandLandmarks[0]);
        const hand2Center = getHandCenter(multiHandLandmarks[1]);
        
        const distance = Math.sqrt(
            Math.pow(hand1Center.x - hand2Center.x, 2) +
            Math.pow(hand1Center.y - hand2Center.y, 2)
        );
        
        // Normalize distance (0 to 1)
        handDistance = Math.min(Math.max(distance, 0), 1);
        handOpen = isHandOpen(multiHandLandmarks[0]) || isHandOpen(multiHandLandmarks[1]);
    }
}

function isHandOpen(landmarks) {
    // Check if fingers are extended
    // Compare fingertip positions to palm
    const palmY = landmarks[0].y;
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    
    // Count extended fingers
    let extendedCount = 0;
    if (indexTip.y < palmY) extendedCount++;
    if (middleTip.y < palmY) extendedCount++;
    if (ringTip.y < palmY) extendedCount++;
    if (pinkyTip.y < palmY) extendedCount++;
    
    return extendedCount >= 3;
}

function getHandCenter(landmarks) {
    // Use palm center (landmark 9) as hand center
    return {
        x: landmarks[9].x,
        y: landmarks[9].y
    };
}

// ============================================================================
// GUI Setup
// ============================================================================

function initGUI() {
    gui = new lil.GUI({ title: 'Particle Controls' });
    
    // Shape selection
    gui.add(guiParams, 'shape', CONFIG.shapes)
        .name('Shape')
        .onChange((value) => {
            changeShape(value);
        });
    
    // Color picker
    gui.addColor(guiParams, 'color')
        .name('Particle Color')
        .onChange((value) => {
            updateParticleColors(value);
        });
    
    // Particle size
    gui.add(guiParams, 'particleSize', 0.01, 0.1, 0.001)
        .name('Particle Size')
        .onChange((value) => {
            particleMaterial.size = value;
        });
    
    // Auto rotation
    gui.add(guiParams, 'autoRotate')
        .name('Auto Rotate');
    
    // Rotation speed
    gui.add(guiParams, 'rotationSpeed', 0, 0.01, 0.0001)
        .name('Rotation Speed');
}

// ============================================================================
// Fullscreen Toggle
// ============================================================================

function initFullscreenToggle() {
    const btn = document.getElementById('fullscreen-btn');
    
    btn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.warn('Fullscreen request failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    document.addEventListener('fullscreenchange', () => {
        btn.textContent = document.fullscreenElement ? '⛶' : '⛶';
    });
}

// ============================================================================
// Initialization
// ============================================================================

function init() {
    initThreeJS();
    initGUI();
    initFullscreenToggle();
    initMediaPipeHands();
    animate();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
