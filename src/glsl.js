class ShaderScene {
    constructor() {
        this.container;
        this.camera;
        this.scene;
        this.renderer;
        this.clock;
        this.uniforms;

        this.init();
        this.animate();
    }

    init() {
        this.container = document.getElementById('container');

        this.camera = new THREE.Camera();
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        const geometry = new THREE.PlaneGeometry(2, 2);

        this.uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_timeDelta: { type: 'f', value: 1.0 },
            u_frame: { type: "i", value: 0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_mouse: { type: "v2", value: new THREE.Vector2() }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild(this.renderer.domElement);

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        document.onmousemove = (e) => {
            this.uniforms.u_mouse.value.x = e.pageX
            this.uniforms.u_mouse.value.y = e.pageY
        }
    }

    onWindowResize(event) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    }

    render() {
        this.uniforms.u_timeDelta = this.clock.getDelta();
        this.uniforms.u_time.value += this.uniforms.u_timeDelta;
        this.uniforms.u_frame.value++;
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
}

new ShaderScene();