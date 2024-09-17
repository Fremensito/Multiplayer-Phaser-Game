import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080,
        proxy: {
            "/.proxy/assets":{
                target: "http://localhost:8080/assets",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/.proxy\/assets/, ''),
            },
            '/.proxy/colyseus': {
            target: 'http://localhost:2567',
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(/^\/.proxy\/colyseus/, ''),
            },
            '/.proxy/websocket': {
            target: 'ws://localhost:2567',
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(/^\/.proxy\/websocket/, ''),
            },
        }
    }
});
