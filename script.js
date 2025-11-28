/**
 * 3D Particle System with Hand Tracking
 * 
 * A real-time interactive particle system using Three.js and MediaPipe Hands
 * Supports multiple particle formations with smooth morphing transitions
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    particleCount: 5000,
    transitionDuration: 2.0, // seconds
    baseSize: 3,
    defaultColor: '#ff66aa',
    handSmoothingFactor: 0.15,
    minScale: 0.3,
    maxScale: 2.5,
    // Hand tracking distance normalization
    handDistanceMin: 0.1,
    handDistanceRange: 0.3,
    // Auto-rotation speeds
    rotationSpeedY: 0.003,
    rotationSpeedX: 0.001
};

// Shape definitions with consistent naming
const SHAPES = {
    heart: { name: 'Heart', generator: 'generateHeartShape' },
    flower: { name: 'Flower', generator: 'generateFlowerShape' },
    saturn: { name: 'Saturn', generator: 'generateSaturnShape' },
    buddha: { name: 'Buddha', generator: 'generateBuddhaShape' },
    fireworks: { name: 'Fireworks', generator: 'generateFireworksShape' }
};

// ============================================
// Global Variables
// ============================================
let scene, camera, renderer, particles, particleMaterial;
let gui, stats;
let hands, webcam;
let handOpenness = 0.5; // 0 = closed, 1 = open
let targetHandOpenness = 0.5;
let isHandTracking = false;
let currentModel = 'heart';
let targetPositions = [];
let startPositions = [];
let transitionProgress = 1.0;
let transitionStartTime = 0;
let clock;
let isFireworksMode = false;
let fireworksVelocities = [];
let fireworksStartTime = 0;

// GUI Controls
const guiParams = {
    model: 'Heart',
    color: CONFIG.defaultColor,
    particleSize: CONFIG.baseSize,
    autoRotate: true,
    showStats: true,
    fullscreen: function() {
        toggleFullscreen();
    },
    resetFireworks: function() {
        if (currentModel === 'fireworks') {
            initFireworks();
        }
    }
};

// ============================================
// Initialization
// ============================================
function init() {
    // Create clock for animations
    clock = new THREE.Clock();
    
    // Setup Three.js scene
    setupScene();
    
    // Setup particles
    setupParticles();
    
    // Setup GUI
    setupGUI();
    
    // Setup Stats
    setupStats();
    
    // Setup Hand Tracking
    setupHandTracking();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// ============================================
// Three.js Scene Setup
// ============================================
function setupScene() {
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
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Add ambient light for subtle effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
}

// ============================================
// Particle System
// ============================================
function setupParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CONFIG.particleCount * 3);
    const colors = new Float32Array(CONFIG.particleCount * 3);
    const sizes = new Float32Array(CONFIG.particleCount);
    
    // Initialize with heart shape
    const heartPositions = generateHeartShape(CONFIG.particleCount);
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        positions[i * 3] = heartPositions[i].x;
        positions[i * 3 + 1] = heartPositions[i].y;
        positions[i * 3 + 2] = heartPositions[i].z;
        
        // Random color variation
        const color = new THREE.Color(guiParams.color);
        const hsl = {};
        color.getHSL(hsl);
        color.setHSL(hsl.h + (Math.random() - 0.5) * 0.1, hsl.s, hsl.l + (Math.random() - 0.5) * 0.2);
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = CONFIG.baseSize * (0.5 + Math.random() * 0.5);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Custom shader material for better-looking particles
    particleMaterial = new THREE.PointsMaterial({
        size: CONFIG.baseSize * 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
    
    // Store target positions
    targetPositions = heartPositions.map(p => p.clone());
    startPositions = heartPositions.map(p => p.clone());
}

// ============================================
// Shape Generators
// ============================================
function generateHeartShape(count) {
    const positions = [];
    for (let i = 0; i < count; i++) {
        // Parametric heart surface
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        
        // 3D Heart parametric equations
        const scale = 1.5;
        const x = scale * Math.sin(v) * (15 * Math.sin(u) - 4 * Math.sin(3 * u)) / 15;
        const y = scale * Math.cos(v) * 0.8;
        const z = scale * Math.sin(v) * (15 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) / 15;
        
        // Add some randomness for volume
        const noise = 0.1;
        positions.push(new THREE.Vector3(
            x + (Math.random() - 0.5) * noise,
            y + (Math.random() - 0.5) * noise,
            z + (Math.random() - 0.5) * noise
        ));
    }
    return positions;
}

function generateFlowerShape(count) {
    const positions = [];
    for (let i = 0; i < count; i++) {
        // Rose/flower parametric equations
        const u = Math.random() * Math.PI * 4;
        const v = Math.random() * Math.PI * 2;
        
        // Rose surface
        const a = 1;
        const r = a * (1 + Math.sin(3 * u)) * (1 + 0.5 * Math.cos(5 * v));
        
        const scale = 0.5;
        const x = scale * r * Math.cos(u) * Math.cos(v);
        const y = scale * r * Math.sin(u);
        const z = scale * r * Math.cos(u) * Math.sin(v);
        
        positions.push(new THREE.Vector3(x, y, z));
    }
    return positions;
}

function generateSaturnShape(count) {
    const positions = [];
    const sphereCount = Math.floor(count * 0.4);
    const ringCount = count - sphereCount;
    
    // Central sphere
    for (let i = 0; i < sphereCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 0.6 + Math.random() * 0.1;
        
        positions.push(new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta) * 0.8,
            r * Math.cos(phi)
        ));
    }
    
    // Ring
    for (let i = 0; i < ringCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const ringR = 1.2 + Math.random() * 0.4;
        const ringHeight = (Math.random() - 0.5) * 0.1;
        
        positions.push(new THREE.Vector3(
            ringR * Math.cos(angle),
            ringHeight,
            ringR * Math.sin(angle)
        ));
    }
    
    return positions;
}

function generateBuddhaShape(count) {
    const positions = [];
    
    // Approximate sitting figure using stacked ellipsoids
    // Body sections: base, torso, shoulders, head
    const sections = [
        { y: -0.8, rx: 0.8, ry: 0.3, rz: 0.5, weight: 0.25 },  // Base/legs
        { y: -0.2, rx: 0.5, ry: 0.4, rz: 0.4, weight: 0.30 },  // Torso
        { y: 0.3, rx: 0.55, ry: 0.3, rz: 0.35, weight: 0.25 }, // Shoulders
        { y: 0.7, rx: 0.3, ry: 0.35, rz: 0.3, weight: 0.20 }   // Head
    ];
    
    for (let i = 0; i < count; i++) {
        // Select section based on weight
        let rand = Math.random();
        let section = sections[0];
        let cumWeight = 0;
        
        for (const sec of sections) {
            cumWeight += sec.weight;
            if (rand <= cumWeight) {
                section = sec;
                break;
            }
        }
        
        // Generate point on ellipsoid surface
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        
        const x = section.rx * Math.sin(phi) * Math.cos(theta);
        const y = section.y + section.ry * Math.cos(phi);
        const z = section.rz * Math.sin(phi) * Math.sin(theta);
        
        positions.push(new THREE.Vector3(x, y, z));
    }
    
    return positions;
}

function generateFireworksShape(count) {
    const positions = [];
    
    // Start all particles at center
    for (let i = 0; i < count; i++) {
        positions.push(new THREE.Vector3(0, 0, 0));
    }
    
    return positions;
}

function initFireworks() {
    // Generate velocities for explosion
    fireworksVelocities = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        
        fireworksVelocities.push(new THREE.Vector3(
            speed * Math.sin(phi) * Math.cos(theta),
            speed * Math.sin(phi) * Math.sin(theta),
            speed * Math.cos(phi)
        ));
    }
    
    // Reset positions to center
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < CONFIG.particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    fireworksStartTime = clock.getElapsedTime();
    isFireworksMode = true;
}

// ============================================
// Shape Transition
// ============================================
function transitionToShape(shapeName) {
    const shapeGenerators = {
        'heart': generateHeartShape,
        'flower': generateFlowerShape,
        'saturn': generateSaturnShape,
        'buddha': generateBuddhaShape,
        'fireworks': generateFireworksShape
    };
    
    isFireworksMode = false;
    
    if (shapeName === 'fireworks') {
        initFireworks();
        currentModel = shapeName;
        return;
    }
    
    const generator = shapeGenerators[shapeName];
    if (!generator) return;
    
    // Store current positions as start
    const positions = particles.geometry.attributes.position.array;
    startPositions = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        startPositions.push(new THREE.Vector3(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
        ));
    }
    
    // Generate new target positions
    targetPositions = generator(CONFIG.particleCount);
    
    // Start transition
    transitionProgress = 0;
    transitionStartTime = clock.getElapsedTime();
    currentModel = shapeName;
}

function updateTransition() {
    if (transitionProgress >= 1.0 || isFireworksMode) return;
    
    const elapsed = clock.getElapsedTime() - transitionStartTime;
    transitionProgress = Math.min(elapsed / CONFIG.transitionDuration, 1.0);
    
    // Smooth easing function (ease-in-out)
    const t = transitionProgress < 0.5
        ? 4 * transitionProgress * transitionProgress * transitionProgress
        : 1 - Math.pow(-2 * transitionProgress + 2, 3) / 2;
    
    const positions = particles.geometry.attributes.position.array;
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        positions[i * 3] = startPositions[i].x + (targetPositions[i].x - startPositions[i].x) * t;
        positions[i * 3 + 1] = startPositions[i].y + (targetPositions[i].y - startPositions[i].y) * t;
        positions[i * 3 + 2] = startPositions[i].z + (targetPositions[i].z - startPositions[i].z) * t;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
}

function updateFireworks(deltaTime) {
    if (!isFireworksMode) return;
    
    const elapsed = clock.getElapsedTime() - fireworksStartTime;
    const positions = particles.geometry.attributes.position.array;
    
    // Explosion with gravity and slowdown
    const gravity = -0.5;
    const drag = 0.98;
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const vel = fireworksVelocities[i];
        
        // Apply physics
        vel.y += gravity * deltaTime;
        vel.multiplyScalar(drag);
        
        // Update position
        positions[i * 3] += vel.x * deltaTime * handOpenness * 2;
        positions[i * 3 + 1] += vel.y * deltaTime * handOpenness * 2;
        positions[i * 3 + 2] += vel.z * deltaTime * handOpenness * 2;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Auto-reset after explosion completes
    if (elapsed > 5) {
        initFireworks();
    }
}

// ============================================
// GUI Setup
// ============================================
function setupGUI() {
    gui = new lil.GUI({ title: 'Particle Controls' });
    
    // Build shape options from SHAPES config
    const shapeOptions = Object.values(SHAPES).map(s => s.name);
    const shapeNameToKey = Object.fromEntries(
        Object.entries(SHAPES).map(([key, val]) => [val.name, key])
    );
    
    // Model selection
    gui.add(guiParams, 'model', shapeOptions)
        .name('Shape')
        .onChange((value) => {
            transitionToShape(shapeNameToKey[value]);
        });
    
    // Color picker
    gui.addColor(guiParams, 'color')
        .name('Color')
        .onChange((value) => {
            updateParticleColors(value);
        });
    
    // Particle size
    gui.add(guiParams, 'particleSize', 1, 10, 0.5)
        .name('Particle Size')
        .onChange((value) => {
            particleMaterial.size = value * 0.05;
        });
    
    // Auto rotate toggle
    gui.add(guiParams, 'autoRotate')
        .name('Auto Rotate');
    
    // Stats toggle
    gui.add(guiParams, 'showStats')
        .name('Show FPS')
        .onChange((value) => {
            if (stats) {
                stats.dom.style.display = value ? 'block' : 'none';
            }
        });
    
    // Fullscreen button
    gui.add(guiParams, 'fullscreen')
        .name('Toggle Fullscreen');
    
    // Reset fireworks button (shown conditionally)
    gui.add(guiParams, 'resetFireworks')
        .name('Reset Fireworks');
}

function updateParticleColors(color) {
    const colors = particles.geometry.attributes.color.array;
    const baseColor = new THREE.Color(color);
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const variedColor = baseColor.clone();
        const hsl = {};
        variedColor.getHSL(hsl);
        variedColor.setHSL(
            hsl.h + (Math.random() - 0.5) * 0.1,
            hsl.s,
            hsl.l + (Math.random() - 0.5) * 0.2
        );
        
        colors[i * 3] = variedColor.r;
        colors[i * 3 + 1] = variedColor.g;
        colors[i * 3 + 2] = variedColor.b;
    }
    
    particles.geometry.attributes.color.needsUpdate = true;
}

// ============================================
// Stats Setup
// ============================================
function setupStats() {
    stats = new Stats();
    stats.showPanel(0); // FPS
    stats.dom.style.position = 'fixed';
    stats.dom.style.top = '20px';
    stats.dom.style.left = '50%';
    stats.dom.style.transform = 'translateX(-50%)';
    stats.dom.style.zIndex = '100';
    document.body.appendChild(stats.dom);
}

// ============================================
// Hand Tracking Setup
// ============================================
function setupHandTracking() {
    const statusText = document.getElementById('status-text');
    const statusIcon = document.getElementById('status-icon');
    const handStatus = document.getElementById('hand-status');
    
    // Initialize MediaPipe Hands
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandResults);
    
    // Setup webcam
    webcam = document.getElementById('webcam');
    
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 640,
            height: 480,
            facingMode: 'user'
        }
    })
    .then((stream) => {
        webcam.srcObject = stream;
        webcam.onloadedmetadata = () => {
            webcam.play();
            statusText.textContent = 'Hand tracking ready';
            handStatus.classList.add('active');
            
            // Start processing
            processVideo();
        };
    })
    .catch((error) => {
        console.error('Webcam error:', error);
        statusText.textContent = 'Webcam access denied';
        statusIcon.textContent = '❌';
        handStatus.classList.add('error');
    });
}

async function processVideo() {
    if (webcam.readyState >= 2) {
        await hands.send({ image: webcam });
    }
    requestAnimationFrame(processVideo);
}

function onHandResults(results) {
    const statusText = document.getElementById('status-text');
    const statusIcon = document.getElementById('status-icon');
    const handStatus = document.getElementById('hand-status');
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        isHandTracking = true;
        handStatus.classList.add('active');
        handStatus.classList.remove('error');
        statusIcon.textContent = '✋';
        statusText.textContent = 'Hand detected';
        
        const landmarks = results.multiHandLandmarks[0];
        
        // Calculate hand openness based on finger tip distances from palm
        const palmBase = landmarks[0]; // Wrist
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        
        // Calculate average distance of fingertips from palm
        const distances = [
            distance3D(palmBase, thumbTip),
            distance3D(palmBase, indexTip),
            distance3D(palmBase, middleTip),
            distance3D(palmBase, ringTip),
            distance3D(palmBase, pinkyTip)
        ];
        
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        
        // Normalize hand openness using CONFIG values
        targetHandOpenness = Math.min(Math.max(
            (avgDistance - CONFIG.handDistanceMin) / CONFIG.handDistanceRange, 0), 1);
    } else {
        isHandTracking = false;
        statusIcon.textContent = '🖐️';
        statusText.textContent = 'Show your hand';
        handStatus.classList.remove('active');
    }
}

function distance3D(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ============================================
// Animation Loop
// ============================================
function animate() {
    requestAnimationFrame(animate);
    
    if (stats) stats.begin();
    
    const deltaTime = clock.getDelta();
    
    // Smooth hand openness value
    handOpenness += (targetHandOpenness - handOpenness) * CONFIG.handSmoothingFactor;
    
    // Update transition animation
    updateTransition();
    
    // Update fireworks animation
    if (isFireworksMode) {
        updateFireworks(deltaTime);
    }
    
    // Apply hand openness to particle scale
    if (particles && !isFireworksMode) {
        const scale = CONFIG.minScale + handOpenness * (CONFIG.maxScale - CONFIG.minScale);
        particles.scale.set(scale, scale, scale);
    }
    
    // Auto rotation
    if (guiParams.autoRotate && particles) {
        particles.rotation.y += CONFIG.rotationSpeedY;
        particles.rotation.x += CONFIG.rotationSpeedX;
    }
    
    // Render
    renderer.render(scene, camera);
    
    if (stats) stats.end();
}

// ============================================
// Utility Functions
// ============================================
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// ============================================
// Start Application
// ============================================
window.addEventListener('DOMContentLoaded', init);
