export const SIMULATION = {
    PARTICLE_COUNT: 3000,
    PARTICLE_SIZE: 2.0,
    PARTICLE_OPACITY: 0.9,
    INITIAL_SPREAD: 250,
    INITIAL_VELOCITY_RANGE: 0.0,
    FLATTEN_TO_2D: true,
    Z_SPREAD: 10,

    GRAVITY_CONSTANT: 100,
    MAX_PARTICLE_SPEED: 150,
    MIN_DISTANCE_SQ: 4.0,
    VELOCITY_DAMPING: 1.0,

    MIN_ATTRACTOR_MASS: 2.0,
    MAX_ATTRACTOR_MASS: 5.0,
    ATTRACTOR_SIZE_MULTIPLIER: 3,
    ATTRACTOR_GLOW_MULTIPLIER: 5,

    MAX_TRAIL_LENGTH: 30,
    TRAIL_OPACITY: 0.5,
    TRAIL_MIN_DISTANCE: 1.0,
    TRAIL_SAMPLE_RATE: 30,
};

export const RENDERING = {
    FOV: 60,
    NEAR_PLANE: 0.1,
    FAR_PLANE: 2000,
    INITIAL_CAMERA_POSITION: { x: 0, y: 0, z: 400 },

    DAMPING_FACTOR: 0.05,
    MIN_DISTANCE: 20,
    MAX_DISTANCE: 400,

    BLOOM_STRENGTH: 2.0,
    BLOOM_RADIUS: 0.8,
    BLOOM_THRESHOLD: 0.1,
};

export const BACKGROUND = {
    NEBULA_SIZE: 500,
    NEBULA_Z_OFFSET: -100,
    COLOR_CYCLE_SPEED: 0.05,

    STAR_COUNT: 400,
    STAR_SIZE: 1.2,
    STAR_OPACITY: 0.6,
    STAR_SPREAD: 400,
    STAR_Z_MIN: -50,
    STAR_Z_MAX: -150,
};

export const COLORS = {
    PARTICLE_COLORS: [
        { r: 0.8, g: 0.6, b: 1.0 },
        { r: 0.6, g: 0.8, b: 1.0 },
        { r: 1.0, g: 0.7, b: 0.8 },
        { r: 0.7, g: 1.0, b: 0.9 },
        { r: 1.0, g: 0.9, b: 0.6 },
        { r: 0.9, g: 0.6, b: 0.9 },
    ],
};

export const UI = {
    INFO_TEXT: 'Click anywhere to plant a star | Drag to rotate | Scroll to zoom',
};