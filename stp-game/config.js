// Phaser game configuration for "Echoes of the Hunt"

const config = {
    // Renderer type: AUTO lets Phaser choose WebGL or Canvas based on browser support
    type: Phaser.AUTO,

    // The id of the HTML element Phaser injects the canvas into
    parent: 'game',

    // Native canvas width in pixels
    width: 1920,

    // Native canvas height in pixels
    height: 1080,

    // Background colour rendered behind all scenes (pure black)
    backgroundColor: 0xD6C7FB,

    // Scale manager: FIT scales the canvas down to fit the browser window while preserving aspect ratio and centering it
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },

    // Physics engine configuration
    physics: {
        // Use the lightweight Arcade physics system
        default: 'arcade',
        arcade: {
            // Disable the physics debug overlay
            debug: false,
        },
    },

    // Renderer settings
    render: {
        // Disable pixel-art rendering mode (no nearest-neighbour upscaling)
        pixelArt: false,
        // Enable anti-aliasing for smooth edges on sprites and shapes
        antialias: true,
    },

    // Scene list — scenes will be registered here once created
    scene: [],
};

export default config;
