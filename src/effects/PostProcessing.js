import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as THREE from 'three';
import { RENDERING } from '../config/constants.js';

export class PostProcessing {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.composer = null;
        this.bloomPass = null;
        this.finalComposer = null;
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(1); 
        this.materials = {}; 
        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

        this.initialize();
    }

    initialize() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const size = new THREE.Vector2();
        this.renderer.getSize(size);

        this.bloomPass = new UnrealBloomPass(
            size,
            RENDERING.BLOOM_STRENGTH,
            RENDERING.BLOOM_RADIUS,
            RENDERING.BLOOM_THRESHOLD
        );

        this.composer.addPass(this.bloomPass);
    }


    darkenNonBloomObjects(obj) {
        if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
            this.materials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;
        }
    }


    restoreMaterials(obj) {
        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }
    }


    render() {
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.camera.layers.set(0); 
        this.renderer.render(this.scene, this.camera);

        this.camera.layers.set(1); 
        this.composer.render();

        this.camera.layers.enableAll();
    }

    resize(width, height) {
        this.composer.setSize(width, height);
    }

    getBloomPass() {
        return this.bloomPass;
    }

    dispose() {
    }
}