// ========================================
// SHREYA PHARMACY - ELEGANT BACKGROUND
// ========================================

// Disable the 3D capsule scene - it's too busy for minimal design
function initThreeScene() {
    // Intentionally empty - removed 3D capsule for cleaner aesthetic
    // The capsule container will be hidden via CSS
}

// Product 3D Viewer (keep for modal - more subtle use)
class Product3DViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container || typeof THREE === 'undefined') return;

        this.init();
        this.createPill();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.camera.position.z = 4;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth || 400, this.container.clientHeight || 400);
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        this.animate();
    }

    createPill() {
        const geometry = new THREE.CapsuleGeometry(0.6, 1.5, 16, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xC4A77D,
            shininess: 100
        });
        this.pill = new THREE.Mesh(geometry, material);
        this.pill.rotation.z = Math.PI / 4;
        this.scene.add(this.pill);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.pill) {
            this.pill.rotation.y += 0.02;
        }
        this.renderer.render(this.scene, this.camera);
    }
}

window.initThreeScene = initThreeScene;
window.Product3DViewer = Product3DViewer;
