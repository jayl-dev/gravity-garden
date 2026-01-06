import * as THREE from 'three';
import { Attractor } from '../simulation/Attractor.js';
import { SIMULATION } from '../config/constants.js';

export class InputHandler {
    constructor(camera, domElement, scene, attractors) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        this.attractors = attractors;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.domElement.addEventListener('click', (event) => this.onClick(event));
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersectPoint = new THREE.Vector3();
        const intersects = this.raycaster.ray.intersectPlane(this.interactionPlane, intersectPoint);

        if (intersects) {
            this.spawnAttractor(intersectPoint);
        }
    }

    spawnAttractor(position) {
        const mass = SIMULATION.MIN_ATTRACTOR_MASS +
            Math.random() * (SIMULATION.MAX_ATTRACTOR_MASS - SIMULATION.MIN_ATTRACTOR_MASS);

        const hue = Math.random();
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.2;
        const color = new THREE.Color().setHSL(hue, saturation, lightness);

        const attractor = new Attractor(position, mass, color, this.scene);
        this.attractors.push(attractor);

        console.log(`Spawned attractor at (${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}) with mass ${mass.toFixed(2)}`);
    }

    dispose() {
        this.domElement.removeEventListener('click', this.onClick);
    }
}