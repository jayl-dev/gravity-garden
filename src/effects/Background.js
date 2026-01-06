import * as THREE from 'three';
import { BACKGROUND } from '../config/constants.js';

export class Background {
    constructor(scene) {
        this.scene = scene;
        this.nebula = null;
        this.starfield = null;
        this.time = 0;

        this.createNebula();
        this.createStarfield();
    }

    createNebula() {
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float time;
            varying vec2 vUv;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;

                for (int i = 0; i < 4; i++) {
                    value += amplitude * noise(p * frequency);
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }

                return value;
            }

            void main() {
                vec2 uv = vUv;
                float t = time * ${BACKGROUND.COLOR_CYCLE_SPEED};

                vec3 color1 = vec3(
                    0.1 + 0.05 * sin(t),
                    0.0,
                    0.3 + 0.1 * cos(t * 0.7)
                );
                vec3 color2 = vec3(
                    0.5 + 0.1 * sin(t * 0.8),
                    0.1 + 0.05 * cos(t * 0.9),
                    0.6 + 0.1 * cos(t)
                );
                vec3 color3 = vec3(
                    0.1 + 0.05 * cos(t * 1.1),
                    0.2 + 0.1 * sin(t * 1.2),
                    0.4 + 0.05 * sin(t * 0.6)
                );

                float mixFactor1 = uv.y + fbm(uv * 2.0 + t * 0.1) * 0.2;
                float mixFactor2 = uv.x * 0.5 + fbm(uv * 3.0 - t * 0.05) * 0.15;

                vec3 finalColor = mix(color1, color2, mixFactor1);
                finalColor = mix(finalColor, color3, mixFactor2);

                float vignette = smoothstep(0.8, 0.2, length(uv - 0.5));
                finalColor *= 0.4 + vignette * 0.6;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const geometry = new THREE.PlaneGeometry(
            BACKGROUND.NEBULA_SIZE,
            BACKGROUND.NEBULA_SIZE
        );

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.DoubleSide,
            depthWrite: false,
        });

        this.nebula = new THREE.Mesh(geometry, material);
        this.nebula.position.z = BACKGROUND.NEBULA_Z_OFFSET;
        this.nebula.renderOrder = -1;
        this.nebula.layers.set(0); 
        this.scene.add(this.nebula);
    }

    createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(BACKGROUND.STAR_COUNT * 3);
        const sizes = new Float32Array(BACKGROUND.STAR_COUNT);

        for (let i = 0; i < BACKGROUND.STAR_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * BACKGROUND.STAR_SPREAD;
            positions[i * 3 + 1] = (Math.random() - 0.5) * BACKGROUND.STAR_SPREAD;
            positions[i * 3 + 2] = BACKGROUND.STAR_Z_MIN - Math.random() *
                (BACKGROUND.STAR_Z_MAX - BACKGROUND.STAR_Z_MIN);

            sizes[i] = BACKGROUND.STAR_SIZE * (0.5 + Math.random() * 0.5);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: BACKGROUND.STAR_SIZE,
            transparent: true,
            opacity: BACKGROUND.STAR_OPACITY,
            sizeAttenuation: true,
            depthWrite: false,
        });

        this.starfield = new THREE.Points(geometry, material);
        this.starfield.layers.set(0); 
        this.scene.add(this.starfield);
    }

    update(deltaTime) {
        this.time += deltaTime;

        if (this.nebula) {
            this.nebula.material.uniforms.time.value = this.time;
        }

        if (this.starfield && this.starfield.material) {
            this.starfield.material.opacity =
                BACKGROUND.STAR_OPACITY * (0.8 + Math.sin(this.time * 0.5) * 0.2);
        }
    }
    
    dispose() {
        if (this.nebula) {
            this.scene.remove(this.nebula);
            this.nebula.geometry.dispose();
            this.nebula.material.dispose();
        }

        if (this.starfield) {
            this.scene.remove(this.starfield);
            this.starfield.geometry.dispose();
            this.starfield.material.dispose();
        }
    }
}