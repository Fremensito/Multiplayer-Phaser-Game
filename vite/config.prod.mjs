import { defineConfig } from 'vite';

const phasermsg = () => {
    return {
        name: 'phasermsg',
        buildStart() {
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            const line = "---------------------------------------------------------";
            const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
            process.stdout.write(`${line}\n${msg}\n${line}\n`);
            
            process.stdout.write(`✨ Done ✨\n`);
        }
    }
}   

export default defineConfig({
    base: './',
    logLevel: 'warning',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
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
    },
    plugins: [
        phasermsg()
    ]
});
