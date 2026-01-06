import * as THREE from 'three';
import { SIMULATION } from '../config/constants.js';


export class Particle {
    constructor(position, velocity, color) {
        this.pos = position.clone();
        this.vel = velocity.clone();
        this.color = color;
        this.trail = [];
        this.maxTrailLength = SIMULATION.MAX_TRAIL_LENGTH;
    }

    update(attractors, deltaTime, G) {
        if (attractors.length === 0) return;

        const acceleration = new THREE.Vector3(0, 0, 0);

        for (const attractor of attractors) {
            const direction = new THREE.Vector3().subVectors(attractor.pos, this.pos);
            const distanceSq = Math.max(direction.lengthSq(), SIMULATION.MIN_DISTANCE_SQ);

            const forceMagnitude = (G * attractor.mass) / distanceSq;

            const clampedForce = Math.min(forceMagnitude, 100);

            direction.normalize().multiplyScalar(clampedForce);
            acceleration.add(direction);
        }

        this.vel.add(acceleration.multiplyScalar(deltaTime));

        this.vel.multiplyScalar(SIMULATION.VELOCITY_DAMPING);

        const speed = this.vel.length();
        if (speed > SIMULATION.MAX_PARTICLE_SPEED) {
            this.vel.normalize().multiplyScalar(SIMULATION.MAX_PARTICLE_SPEED);
        }

        this.pos.add(this.vel.clone().multiplyScalar(deltaTime));

        if (
            this.trail.length === 0 ||
            this.pos.distanceTo(this.trail[this.trail.length - 1]) > SIMULATION.TRAIL_MIN_DISTANCE
        ) {
            this.trail.push(this.pos.clone());
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }
    }

    getTrailPoints(maxLength = this.maxTrailLength) {
        return this.trail.slice(-maxLength);
    }
}