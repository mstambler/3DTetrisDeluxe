/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector2, MeshBasicMaterial  } from 'three';
import { ShaderMaterial, Layers, ReinhardToneMapping, NoToneMapping } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import { Block, Powerup } from 'objects';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});

// Set up camera
camera.position.set(0, 0, -30);
camera.lookAt(0, 0, 0);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);

// canvas
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;
controls.minDistance = 10;
controls.maxDistance = 50;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI/2 + 0.05;
controls.update();

// bloom stuff
const bloomLayer = new Layers();
bloomLayer.set(1);
const darkMaterial = new MeshBasicMaterial({color: 'black'});
const materials = {};
const params = {
    exposure: 0,
	bloomStrength: 1,
	bloomThreshold: 0,
	bloomRadius: 3
};

// regular render pass
const renderScene = new RenderPass(scene, camera);

// bloom pass
const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

// bloom composer
const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

// final pass
const finalPass = new ShaderPass(
    new ShaderMaterial({
        uniforms: {
            baseTexture: {value: null},
            bloomTexture: {value: bloomComposer.renderTarget2.texture}
        },
        vertexShader: [
            "varying vec2 vUv;",
			"void main() {",
				"vUv = uv;",
				"gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);",
			"}"
        ].join( "\n" ),
       fragmentShader: [
        "uniform sampler2D baseTexture;",
        "uniform sampler2D bloomTexture;",
        "varying vec2 vUv;",
        "vec4 getTexture(sampler2D texelToLinearTexture) {",
            "return mapTexelToLinear(texture2D(texelToLinearTexture, vUv));",
        "}",
        "void main() {",
            "gl_FragColor = (getTexture(baseTexture) + vec4(1.0) * getTexture(bloomTexture));",
        "}"
       ].join( "\n" ),
        defines: {}
    }), "baseTexture"
);
finalPass.needsSwap = true;

// final composer
const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);

// set all Block objects to bloom layer
const findBlocks = (obj) => {
    if (obj instanceof Block || obj instanceof Powerup) {
        obj.layers.enable(1);
        for (let child of obj.children) {
            child.layers.enable(1);
        }
    }
}

// temporarily set all non bloom layer objects to black
const darkenNonBloomed = (obj) => {
    if (bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
    }
}

// restore non bloom layer materials
const restoreMaterial = (obj) => {
    if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
    }
}

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    if (scene.state.Colors == "Neon") {
        renderer.toneMapping = ReinhardToneMapping;
        scene.traverse(findBlocks);
        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);
        finalComposer.render();
    }
    else {
        renderer.toneMapping = NoToneMapping;
        renderer.render(scene, camera);
    }
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    bloomComposer.setSize(innerWidth, innerHeight);
    finalComposer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// Key handler
const windowKeyHandler = (event) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ', 'Shift']
    if (keys.includes(event.key)) {
        scene.arrow(event.key);
    }
};
window.addEventListener('keydown', windowKeyHandler, false);