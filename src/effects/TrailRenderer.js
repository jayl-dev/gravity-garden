import * as THREE from 'three';
import { SIMULATION } from '../config/constants.js';

export class TrailRenderer {
    constructor(scene) {
        this.scene = scene;
        this.trailLines = [];
    }

    update(particles, maxLength = SIMULATION.MAX_TRAIL_LENGTH) {
        this.clear();

        const sampleRate = SIMULATION.TRAIL_SAMPLE_RATE;

        for (let i = 0; i < particles.length; i += sampleRate) {
            const particle = particles[i];
            const trailPoints = particle.getTrailPoints(maxLength);

            if (trailPoints.length < 2) continue;

            const geometry = new THREE.BufferGeometry().setFromPoints(trailPoints);

            const colors = new Float32Array(trailPoints.length * 3);
            for (let j = 0; j < trailPoints.length; j++) {
                const alpha = j / trailPoints.length; 
                colors[j * 3] = particle.color.r * (0.5 + alpha * 0.5);
                colors[j * 3 + 1] = particle.color.g * (0.5 + alpha * 0.5);
                colors[j * 3 + 2] = particle.color.b * (0.5 + alpha * 0.5);
            }

            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: SIMULATION.TRAIL_OPACITY,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });

            const line = new THREE.Line(geometry, material);
            line.layers.set(1);
            this.scene.add(line);
            this.trailLines.push(line);
        }
    }

    clear() {
        for (const line of this.trailLines) {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        }
        this.trailLines = [];
    }

    dispose() {
        this.clear();
    }
}