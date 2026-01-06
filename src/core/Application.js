import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParticleSystem } from '../simulation/ParticleSystem.js';
import { Background } from '../effects/Background.js';
import { PostProcessing } from '../effects/PostProcessing.js';
import { TrailRenderer } from '../effects/TrailRenderer.js';
import { InputHandler } from '../input/InputHandler.js';
import { GUI } from '../ui/GUI.js';
import { SIMULATION, RENDERING } from '../config/constants.js';

export class Application {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.particleSystem = null;
        this.attractors = [];
        this.background = null;
        this.postProcessing = null;
        this.trailRenderer = null;
        this.inputHandler = null;
        this.gui = null;

        this.lastTime = performance.now();
        this.trailUpdateCounter = 0;

        this.params = {
            G: SIMULATION.GRAVITY_CONSTANT,
            particleCount: SIMULATION.PARTICLE_COUNT,
            trailLength: SIMULATION.MAX_TRAIL_LENGTH,
            clearAttractors: () => this.clearAttractors(),
        };

        this.initialize();
    }

    initialize() {
        this.setupScene();
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.setupPostProcessing();
        this.setupBackground();
        this.setupParticles();
        this.setupTrails();
        this.setupInput();
        this.setupGUI();
        this.setupEventListeners();

        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0005);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const container = document.getElementById('container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            RENDERING.FOV,
            window.innerWidth / window.innerHeight,
            RENDERING.NEAR_PLANE,
            RENDERING.FAR_PLANE
        );

        this.camera.position.set(
            RENDERING.INITIAL_CAMERA_POSITION.x,
            RENDERING.INITIAL_CAMERA_POSITION.y,
            RENDERING.INITIAL_CAMERA_POSITION.z
        );
        this.camera.layers.enableAll();
    }
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = RENDERING.DAMPING_FACTOR;
        this.controls.minDistance = RENDERING.MIN_DISTANCE;
        this.controls.maxDistance = RENDERING.MAX_DISTANCE;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = false;
        this.controls.screenSpacePanning = true;
    }

    setupPostProcessing() {
        this.postProcessing = new PostProcessing(
            this.renderer,
            this.scene,
            this.camera
        );
    }

    setupBackground() {
        this.background = new Background(this.scene);
    }

    setupParticles() {
        this.particleSystem = new ParticleSystem(this.scene);
    }

    setupTrails() {
        this.trailRenderer = new TrailRenderer(this.scene);
    }

    setupInput() {
        this.inputHandler = new InputHandler(
            this.camera,
            this.renderer.domElement,
            this.scene,
            this.attractors
        );
    }

    setupGUI() {
        this.gui = new GUI(
            this.params,
            this.postProcessing.getBloomPass(),
            () => this.reset()
        );
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    spawnInitialAttractors() {
        const positions = [
            new THREE.Vector3(-20, 0, 0),
            new THREE.Vector3(20, 15, -5),
        ];

        if (Math.random() > 0.3) {
            positions.push(new THREE.Vector3(0, -15, 5));
        }

        positions.forEach(pos => {
            this.inputHandler.spawnAttractor(pos);
        });
    }

    clearAttractors() {
        this.attractors.forEach(attractor => attractor.dispose());
        this.attractors.length = 0;
        console.log('All attractors cleared');
    }

    reset() {
        console.log('Resetting simulation...');

        this.clearAttractors();

        if (this.particleSystem) {
            this.particleSystem.dispose();
            SIMULATION.PARTICLE_COUNT = this.params.particleCount;
            this.particleSystem = new ParticleSystem(this.scene);
        }

        if (this.trailRenderer) {
            this.trailRenderer.clear();
        }

        console.log('Simulation reset complete');
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.postProcessing.resize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.gui.begin();

        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        this.background.update(deltaTime);

        this.attractors.forEach(attractor => attractor.update(deltaTime));

        this.particleSystem.update(this.attractors, deltaTime, this.params.G);

        this.trailUpdateCounter++;
        if (this.trailUpdateCounter % 3 === 0) {
            this.trailRenderer.update(
                this.particleSystem.particles,
                this.params.trailLength
            );
        }

        this.controls.update();

        this.postProcessing.render();

        this.gui.end();
    }

    dispose() {
        this.clearAttractors();

        if (this.particleSystem) this.particleSystem.dispose();
        if (this.background) this.background.dispose();
        if (this.trailRenderer) this.trailRenderer.dispose();
        if (this.postProcessing) this.postProcessing.dispose();
        if (this.inputHandler) this.inputHandler.dispose();
        if (this.gui) this.gui.dispose();

        this.renderer.dispose();
    }
}