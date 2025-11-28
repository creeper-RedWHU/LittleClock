/**
 * 3D Particle System with Hand Gesture Control
 * Uses Three.js for rendering, MediaPipe for hand detection, and Lil-GUI for controls
 */

// ==================== Configuration ====================
const CONFIG = {
    particleCount: 15000,
    defaultShape: 'Heart',
    defaultColor: '#00d4ff',
    shapes: ['Heart', 'Flower', 'Saturn', 'Buddha', 'Fireworks'],
    transitionSpeed: 0.02,
    rotationSpeed: 0.002,
    cameraDistance: 5
};

// ==================== Global Variables ====================
let scene, camera, renderer, particles, particleGeometry, particleMaterial;
let targetPositions = [];
let currentPositions = [];
let randomOffsets = []; // Pre-computed random offsets for performance
let gui, guiSettings;
let hands, webcamCamera;
let handOpenness = 0;
let isHandDetected = false;
let animationId;

/**
 * Generate pre-computed random offsets for particle diffusion
 * This avoids calling Math.random() every frame for every particle
 */
function generateRandomOffsets(count) {
    const offsets = new Float32Array(count * 3);
    for (let i = 0; i < offsets.length; i++) {
        offsets[i] = (Math.random() - 0.5);
    }
    return offsets;
}

// DOM Elements
const canvasContainer = document.getElementById('canvas-container');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const expandIcon = document.getElementById('expand-icon');
const compressIcon = document.getElementById('compress-icon');
const handFeedback = document.getElementById('hand-feedback');
const handStatus = document.getElementById('hand-status');
const videoElement = document.getElementById('webcam');

// ==================== Shape Generation Functions ====================

/**
 * Generate positions for a parametric heart shape
 */
function generateHeartShape(count) {
    const positions = [];
    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        
        // Parametric heart equations
        const x = 16 * Math.pow(Math.sin(t), 3) * Math.sin(u) * Math.sin(v);
        const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * Math.sin(v);
        const z = 16 * Math.pow(Math.sin(t), 3) * Math.cos(u) * Math.sin(v);
        
        // Scale and add some randomness
        const scale = 0.08;
        const randomness = 0.1;
        positions.push(
            x * scale + (Math.random() - 0.5) * randomness,
            y * scale + (Math.random() - 0.5) * randomness,
            z * scale + (Math.random() - 0.5) * randomness
        );
    }
    return new Float32Array(positions);
}

/**
 * Generate positions for a flower/petal shape
 */
function generateFlowerShape(count) {
    const positions = [];
    const petalCount = 6;
    
    for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 * 8; // Multiple rotations
        const r = Math.abs(Math.cos(petalCount * theta / 2)) * 1.5 + 0.3;
        const height = (Math.random() - 0.5) * 0.5;
        
        const x = r * Math.cos(theta) + (Math.random() - 0.5) * 0.1;
        const y = height + (Math.random() - 0.5) * 0.2;
        const z = r * Math.sin(theta) + (Math.random() - 0.5) * 0.1;
        
        positions.push(x, y, z);
    }
    return new Float32Array(positions);
}

/**
 * Generate positions for Saturn (sphere with ring)
 */
function generateSaturnShape(count) {
    const positions = [];
    const sphereCount = Math.floor(count * 0.6);
    const ringCount = count - sphereCount;
    
    // Generate sphere
    for (let i = 0; i < sphereCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.8 + Math.random() * 0.1;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions.push(x, y, z);
    }
    
    // Generate ring
    for (let i = 0; i < ringCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 1.3 + Math.random() * 0.6;
        
        const x = r * Math.cos(theta);
        const y = (Math.random() - 0.5) * 0.05; // Thin ring
        const z = r * Math.sin(theta);
        
        positions.push(x, y, z);
    }
    return new Float32Array(positions);
}

/**
 * Generate positions for a Buddha/meditation shape
 * Simplified as a seated figure using geometric primitives
 */
function generateBuddhaShape(count) {
    const positions = [];
    const bodyCount = Math.floor(count * 0.5);
    const headCount = Math.floor(count * 0.2);
    const baseCount = count - bodyCount - headCount;
    
    // Body (ellipsoid)
    for (let i = 0; i < bodyCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const rx = 0.7;
        const ry = 0.5;
        const rz = 0.5;
        
        const x = rx * Math.sin(phi) * Math.cos(theta);
        const y = ry * Math.sin(phi) * Math.sin(theta) - 0.3;
        const z = rz * Math.cos(phi);
        
        positions.push(x + (Math.random() - 0.5) * 0.1, y, z + (Math.random() - 0.5) * 0.1);
    }
    
    // Head (sphere)
    for (let i = 0; i < headCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.35;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) + 0.7;
        const z = radius * Math.cos(phi);
        
        positions.push(x, y, z);
    }
    
    // Lotus base (flat disc)
    for (let i = 0; i < baseCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 1.2;
        
        const x = r * Math.cos(theta);
        const y = -0.8 + (Math.random() - 0.5) * 0.1;
        const z = r * Math.sin(theta);
        
        positions.push(x, y, z);
    }
    
    return new Float32Array(positions);
}

/**
 * Generate positions for fireworks/explosion pattern
 */
function generateFireworksShape(count) {
    const positions = [];
    const burstCount = 5;
    const particlesPerBurst = Math.floor(count / burstCount);
    
    for (let b = 0; b < burstCount; b++) {
        const centerX = (Math.random() - 0.5) * 2;
        const centerY = (Math.random() - 0.5) * 2;
        const centerZ = (Math.random() - 0.5) * 1;
        
        for (let i = 0; i < particlesPerBurst; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.8;
            
            const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
            const y = centerY + radius * Math.sin(phi) * Math.sin(theta);
            const z = centerZ + radius * Math.cos(phi);
            
            positions.push(x, y, z);
        }
    }
    
    // Fill remaining particles
    while (positions.length < count * 3) {
        positions.push(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );
    }
    
    return new Float32Array(positions.slice(0, count * 3));
}

/**
 * Get shape positions based on shape name
 */
function getShapePositions(shapeName) {
    switch (shapeName) {
        case 'Heart':
            return generateHeartShape(CONFIG.particleCount);
        case 'Flower':
            return generateFlowerShape(CONFIG.particleCount);
        case 'Saturn':
            return generateSaturnShape(CONFIG.particleCount);
        case 'Buddha':
            return generateBuddhaShape(CONFIG.particleCount);
        case 'Fireworks':
            return generateFireworksShape(CONFIG.particleCount);
        default:
            return generateHeartShape(CONFIG.particleCount);
    }
}

// ==================== Three.js Setup ====================

/**
 * Initialize Three.js scene, camera, and renderer
 */
function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a15);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = CONFIG.cameraDistance;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);
    
    // Initialize particles
    initParticles();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

/**
 * Initialize particle system
 */
function initParticles() {
    // Get initial shape
    targetPositions = getShapePositions(CONFIG.defaultShape);
    currentPositions = new Float32Array(targetPositions.length);
    
    // Generate pre-computed random offsets for performance optimization
    randomOffsets = generateRandomOffsets(CONFIG.particleCount);
    
    // Start with random positions
    for (let i = 0; i < currentPositions.length; i++) {
        currentPositions[i] = (Math.random() - 0.5) * 5;
    }
    
    // Create geometry
    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    
    // Create material
    particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(CONFIG.defaultColor),
        size: 0.02,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });
    
    // Create points
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

/**
 * Update particle positions with smooth transition
 */
function updateParticles() {
    const positions = particleGeometry.attributes.position.array;
    const speed = CONFIG.transitionSpeed;
    
    // Calculate diffusion based on hand openness
    const diffusion = handOpenness * 2;
    const scale = 1 + handOpenness * 0.5;
    
    // Use pre-computed random offsets for performance
    // Rotate offset index over time for variation without per-frame random calls
    const time = Date.now() * 0.001;
    const offsetPhase = Math.sin(time) * 0.5 + 0.5;
    
    for (let i = 0; i < positions.length; i += 3) {
        // Use pre-computed offsets with time-based modulation for variation
        const offsetX = randomOffsets[i] * diffusion * (1 + offsetPhase * 0.3);
        const offsetY = randomOffsets[i + 1] * diffusion * (1 + offsetPhase * 0.3);
        const offsetZ = randomOffsets[i + 2] * diffusion * (1 + offsetPhase * 0.3);
        
        // Lerp to target with diffusion
        const targetX = targetPositions[i] * scale + offsetX;
        const targetY = targetPositions[i + 1] * scale + offsetY;
        const targetZ = targetPositions[i + 2] * scale + offsetZ;
        
        positions[i] += (targetX - positions[i]) * speed;
        positions[i + 1] += (targetY - positions[i + 1]) * speed;
        positions[i + 2] += (targetZ - positions[i + 2]) * speed;
    }
    
    particleGeometry.attributes.position.needsUpdate = true;
}

/**
 * Change shape with smooth transition
 */
function changeShape(shapeName) {
    targetPositions = getShapePositions(shapeName);
}

/**
 * Update particle color
 */
function updateColor(color) {
    particleMaterial.color.set(color);
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==================== MediaPipe Hands Setup ====================

/**
 * Initialize MediaPipe Hands
 */
async function initMediaPipeHands() {
    loadingText.textContent = 'Loading hand tracking model...';
    
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandResults);
    
    // Initialize camera
    loadingText.textContent = 'Requesting camera access...';
    
    try {
        webcamCamera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480
        });
        
        await webcamCamera.start();
        
        // Hide loading overlay
        loadingOverlay.classList.add('hidden');
        
    } catch (error) {
        console.error('Camera access error:', error);
        handleCameraError(error);
    }
}

/**
 * Process hand detection results
 */
function onHandResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        isHandDetected = true;
        handFeedback.classList.add('active');
        
        // Calculate hand openness based on finger spread
        let totalOpenness = 0;
        
        for (const landmarks of results.multiHandLandmarks) {
            // Calculate distance between thumb tip and pinky tip
            const thumbTip = landmarks[4];
            const pinkyTip = landmarks[20];
            const indexTip = landmarks[8];
            const middleTip = landmarks[12];
            const wrist = landmarks[0];
            
            // Distance from thumb to pinky (normalized)
            const thumbPinkyDist = Math.sqrt(
                Math.pow(thumbTip.x - pinkyTip.x, 2) +
                Math.pow(thumbTip.y - pinkyTip.y, 2) +
                Math.pow(thumbTip.z - pinkyTip.z, 2)
            );
            
            // Distance from index to middle (for additional openness detection)
            const fingerSpread = Math.sqrt(
                Math.pow(indexTip.x - middleTip.x, 2) +
                Math.pow(indexTip.y - middleTip.y, 2)
            );
            
            totalOpenness += thumbPinkyDist + fingerSpread * 2;
        }
        
        // Normalize openness (0 to 1)
        handOpenness = Math.min(1, totalOpenness / results.multiHandLandmarks.length / 0.8);
        
        // Update UI
        const handCount = results.multiHandLandmarks.length;
        handStatus.textContent = `${handCount} hand${handCount > 1 ? 's' : ''} detected (${Math.round(handOpenness * 100)}% open)`;
        
    } else {
        isHandDetected = false;
        handFeedback.classList.remove('active');
        handStatus.textContent = 'No hands detected';
        
        // Gradually return to default when no hands detected
        handOpenness *= 0.95;
    }
}

/**
 * Handle camera access errors
 */
function handleCameraError(error) {
    loadingText.textContent = 'Camera access denied or unavailable';
    
    // Create error dialog if it doesn't exist
    let errorDialog = document.getElementById('permission-error');
    if (!errorDialog) {
        errorDialog = document.createElement('div');
        errorDialog.id = 'permission-error';
        errorDialog.innerHTML = `
            <h2>Camera Access Required</h2>
            <p>This experience uses your webcam for hand gesture detection. 
               Please allow camera access and refresh the page.</p>
            <p style="font-size: 12px; opacity: 0.7;">
                Error: ${error.message || 'Camera not available'}
            </p>
            <button onclick="location.reload()">Retry</button>
        `;
        document.body.appendChild(errorDialog);
    }
    errorDialog.style.display = 'block';
    
    // Still run the visualization without hand tracking
    loadingOverlay.classList.add('hidden');
}

// ==================== GUI Setup ====================

/**
 * Initialize Lil-GUI control panel
 */
function initGUI() {
    guiSettings = {
        shape: CONFIG.defaultShape,
        color: CONFIG.defaultColor,
        particleSize: 0.02,
        rotationSpeed: CONFIG.rotationSpeed * 1000
    };
    
    gui = new lil.GUI({ title: '✨ Particle Controls' });
    
    // Shape selector
    gui.add(guiSettings, 'shape', CONFIG.shapes)
        .name('Shape')
        .onChange((value) => {
            changeShape(value);
        });
    
    // Color picker
    gui.addColor(guiSettings, 'color')
        .name('Color')
        .onChange((value) => {
            updateColor(value);
        });
    
    // Particle size
    gui.add(guiSettings, 'particleSize', 0.005, 0.05, 0.001)
        .name('Size')
        .onChange((value) => {
            particleMaterial.size = value;
        });
    
    // Rotation speed
    gui.add(guiSettings, 'rotationSpeed', 0, 10, 0.1)
        .name('Rotation')
        .onChange((value) => {
            CONFIG.rotationSpeed = value / 1000;
        });
}

// ==================== Fullscreen Control ====================

/**
 * Initialize fullscreen button
 */
function initFullscreenControl() {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Update fullscreen button icon
 */
function updateFullscreenButton() {
    if (document.fullscreenElement) {
        expandIcon.style.display = 'none';
        compressIcon.style.display = 'block';
    } else {
        expandIcon.style.display = 'block';
        compressIcon.style.display = 'none';
    }
}

// ==================== Animation Loop ====================

/**
 * Main animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update particles
    updateParticles();
    
    // Rotate particle system
    particles.rotation.y += CONFIG.rotationSpeed;
    particles.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1;
    
    // Render
    renderer.render(scene, camera);
}

// ==================== Initialization ====================

/**
 * Main initialization function
 */
async function init() {
    try {
        // Initialize Three.js
        initThreeJS();
        
        // Initialize GUI
        initGUI();
        
        // Initialize fullscreen control
        initFullscreenControl();
        
        // Start animation loop
        animate();
        
        // Initialize MediaPipe (async)
        await initMediaPipeHands();
        
    } catch (error) {
        console.error('Initialization error:', error);
        loadingText.textContent = 'Error: ' + error.message;
    }
}

// Start the application
init();
