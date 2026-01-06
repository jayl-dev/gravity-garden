import { SIMULATION, RENDERING } from '../config/constants.js';

export class GUI {
    constructor(params, bloomPass, resetCallback) {
        this.params = params;
        this.bloomPass = bloomPass;
        this.resetCallback = resetCallback;
        this.gui = null;
        this.stats = null;

        this.loadLibraries();
    }

    loadLibraries() {
        this.loadLilGUI();

        this.loadStats();
    }

    loadLilGUI() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lil-gui@0.19.1/dist/lil-gui.umd.min.js';
        script.onload = () => {
            this.initializeGUI();
        };
        script.onerror = () => {
            console.warn('Failed to load lil-gui');
        };
        document.head.appendChild(script);
    }

    initializeGUI() {
        this.gui = new lil.GUI();
        this.gui.title('Cosmic Gravity Garden');

        const simFolder = this.gui.addFolder('Simulation');
        simFolder.add(this.params, 'G', 1, 50, 0.5)
            .name('Gravity Strength')
            .onChange(() => {
                console.log(`Gravity set to ${this.params.G}`);
            });

        simFolder.add(this.params, 'particleCount', 1000, 15000, 100)
            .name('Particle Count')
            .onChange(() => {
                console.log(`Particle count will change on reset: ${this.params.particleCount}`);
            });

        simFolder.add(this.params, 'trailLength', 5, 50, 1)
            .name('Trail Length');

        simFolder.open();

        const fxFolder = this.gui.addFolder('Visual Effects');
        fxFolder.add(this.bloomPass, 'strength', 0, 3, 0.1)
            .name('Bloom Strength');

        fxFolder.add(this.bloomPass, 'radius', 0, 2, 0.1)
            .name('Bloom Radius');

        fxFolder.add(this.bloomPass, 'threshold', 0, 1, 0.05)
            .name('Bloom Threshold');

        fxFolder.open();

        const actionsFolder = this.gui.addFolder('Actions');
        actionsFolder.add({ reset: this.resetCallback }, 'reset')
            .name('🔄 Reset Simulation');

        actionsFolder.add(this.params, 'clearAttractors')
            .name('🗑️ Clear Attractors');

        actionsFolder.open();
    }

    loadStats() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/stats.js@0.17.0/build/stats.min.js';
        script.onload = () => {
            this.initializeStats();
        };
        script.onerror = () => {
            console.warn('Failed to load Stats.js');
        };
        document.head.appendChild(script);
    }

    initializeStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        const statsContainer = document.getElementById('stats');
        if (statsContainer) {
            statsContainer.appendChild(this.stats.dom);
        }
    }

    begin() {
        if (this.stats) {
            this.stats.begin();
        }
    }

    end() {
        if (this.stats) {
            this.stats.end();
        }
    }

    update() {
    }

    dispose() {
        if (this.gui) {
            this.gui.destroy();
        }
    }
}