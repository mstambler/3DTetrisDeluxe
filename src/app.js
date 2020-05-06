/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Vector2, Layers, ShaderMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 0, -30);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
var controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;
controls.minDistance = 10;
controls.maxDistance = 50;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI/2 + 0.05;
controls.update();

var composer;
var params = {
    exposure: 5,
    bloomStrength: 10,
    bloomThreshold: 1,
    bloomRadius: 1,
};

var renderScene = new RenderPass( scene, camera );


composer = new EffectComposer( renderer );
//composer.renderToScreen = false;
composer.addPass( renderScene );
//composer.addPass( bloomPass );

//var shaderPass = new ShaderPass(SepiaShader);
//composer.addPass(shaderPass);
var params2 = {
    shape: 1,
    radius: 4,
    rotateR: Math.PI / 12,
    rotateB: Math.PI / 12 * 2,
    rotateG: Math.PI / 12 * 3,
    scatter: 0,
    blending: 1,
    blendingMode: 1,
    greyscale: false,
    disable: false
};
var halftonePass = new HalftonePass( window.innerWidth, window.innerHeight, params2 );

var toneLayer = new Layers();
toneLayer.set( 1 );
//composer.addPass( halftonePass );

/*var bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;*/

var toneComposer = new EffectComposer( renderer );
//bloomComposer.renderToScreen = false;
toneComposer.addPass( renderScene );
toneComposer.addPass( halftonePass );

/*var finalPass = new ShaderPass(
    new ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
    } ), "baseTexture"
);
finalPass.needsSwap = true;*/

//var finalComposer = new EffectComposer( renderer );
//finalComposer.addPass( renderScene );

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render( scene, camera);
    //camera.layers.set( 1 );
    
	//bloomComposer.render();
    //camera.layers.set( 0 );
    //finalComposer.render();

    //toneComposer.render();
    //renderer.clearDepth();
    //camera.layers.set( 0 );
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);


const windowKeyHandler = (event) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " "]
    if (keys.includes(event.key)) {
        scene.arrow(event.key);
    }
};
window.addEventListener('keydown', windowKeyHandler, false);