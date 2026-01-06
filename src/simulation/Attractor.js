import * as THREE from 'three';
import { SIMULATION } from '../config/constants.js';


export class Attractor {
    constructor(position, mass, color, scene) {
        this.pos = position.clone();
        this.mass = mass;
        this.color = color;
        this.scene = scene;

        const coreSize = mass * SIMULATION.ATTRACTOR_SIZE_MULTIPLIER;
        const geometry = new THREE.IcosahedronGeometry(coreSize, 2);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1.5,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.pos);
        this.mesh.layers.set(1);
        scene.add(this.mesh);

        const glowSize = mass * SIMULATION.ATTRACTOR_GLOW_MULTIPLIER;
        const glowGeometry = new THREE.SphereGeometry(glowSize, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
        });
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.glow.position.copy(this.pos);
        this.glow.layers.set(1);
        scene.add(this.glow);

        this.time = Math.random() * Math.PI * 2;
    }

    update(deltaTime) {
        this.time += deltaTime;
        const scale = 1 + Math.sin(this.time * 2) * 0.1;
        this.glow.scale.setScalar(scale);
    }

    dispose() {
        this.scene.remove(this.mesh);
        this.scene.remove(this.glow);

        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.glow.geometry.dispose();
        this.glow.material.dispose();
    }
}