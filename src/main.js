import { Application } from './core/Application.js';

function init() {
    console.log('🌌 Initializing Cosmic Gravity Garden...');

    try {
        const app = new Application();
        console.log('✨ Cosmic Gravity Garden initialized successfully');
        window.gravityGarden = app;

    } catch (error) {
        console.error('Failed to initialize Cosmic Gravity Garden:', error);

        const container = document.getElementById('container');
        if (container) {
            container.innerHTML = `
                <div style="color: white; padding: 20px; font-family: monospace;">
                    <h2>Error Initializing Application</h2>
                    <p>${error.message}</p>
                    <p>Please check the console for more details.</p>
                </div>
            `;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}