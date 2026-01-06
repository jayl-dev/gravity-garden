import * as THREE from 'three';
import { Particle } from './Particle.js';
import { SIMULATION, COLORS } from '../config/constants.js';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleMesh = null;
        this.initialize();
    }

    initialize() {
        this.particles = [];

        const colors = COLORS.PARTICLE_COLORS;

        for (let i = 0; i < SIMULATION.PARTICLE_COUNT; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * SIMULATION.INITIAL_SPREAD * 2,
                (Math.random() - 0.5) * SIMULATION.INITIAL_SPREAD * 2,
                SIMULATION.FLATTEN_TO_2D ? (Math.random() - 0.5) * SIMULATION.Z_SPREAD : (Math.random() - 0.5) * SIMULATION.INITIAL_SPREAD * 2
            );

            const vel = new THREE.Vector3(0, 0, 0);

            const color = colors[Math.floor(Math.random() * colors.length)];
            const threeColor = new THREE.Color(color.r, color.g, color.b);

            this.particles.push(new Particle(pos, vel, threeColor));
        }

        this.updateMesh();
    }

    updateMesh() {
        if (this.particleMesh) {
            this.scene.remove(this.particleMesh);
            this.particleMesh.geometry.dispose();
            this.particleMesh.material.dispose();
        }

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particles.length * 3);
        const colors = new Float32Array(this.particles.length * 3);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            positions[i * 3] = p.pos.x;
            positions[i * 3 + 1] = p.pos.y;
            positions[i * 3 + 2] = p.pos.z;

            colors[i * 3] = p.color.r;
            colors[i * 3 + 1] = p.color.g;
            colors[i * 3 + 2] = p.color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: SIMULATION.PARTICLE_SIZE,
            vertexColors: true,
            transparent: true,
            opacity: SIMULATION.PARTICLE_OPACITY,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.particleMesh = new THREE.Points(geometry, material);
        this.particleMesh.layers.set(1);
        this.scene.add(this.particleMesh);
    }

    updatePositions() {
        if (!this.particleMesh) return;

        const positions = this.particleMesh.geometry.attributes.position.array;

        for (let i = 0; i < this.particles.length; i++) {
            positions[i * 3] = this.particles[i].pos.x;
            positions[i * 3 + 1] = this.particles[i].pos.y;
            positions[i * 3 + 2] = this.particles[i].pos.z;
        }

        this.particleMesh.geometry.attributes.position.needsUpdate = true;
    }

    update(attractors, deltaTime, G) {
        for (const particle of this.particles) {
            particle.update(attractors, deltaTime, G);
        }
        this.updatePositions();
    }


    reset() {
        this.initialize();
    }

 
    dispose() {
        if (this.particleMesh) {
            this.scene.remove(this.particleMesh);
            this.particleMesh.geometry.dispose();
            this.particleMesh.material.dispose();
        }
    }
}