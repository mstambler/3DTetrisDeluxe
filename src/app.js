/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, SceneUtils } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const sceneL = new SeedScene(), sceneR = new SeedScene();
const cameraL = new PerspectiveCamera(), cameraR = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});

cameraL.position.set(0, 0, -30);
cameraL.lookAt(0, 0, 0);

cameraR.position.set(0, 0, -30);
cameraR.lookAt(0, 0, 0);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);

const canvas = renderer.domElement; // document.createElement('canvas');
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

const controlsL = new OrbitControls(cameraL, canvas);
controlsL.enableDamping = true;
controlsL.enablePan = false;
controlsL.enableZoom = true;
controlsL.minDistance = 10;
controlsL.maxDistance = 50;
controlsL.minPolarAngle = 0;
controlsL.maxPolarAngle = Math.PI/2 + 0.05;
controlsL.update();

const controlsR = new OrbitControls(cameraR, canvas);
controlsR.enableDamping = true;
controlsR.enablePan = false;
controlsR.enableZoom = true;
controlsR.minDistance = 10;
controlsR.maxDistance = 50;
controlsR.minPolarAngle = 0;
controlsR.maxPolarAngle = Math.PI/2 + 0.05;
controlsR.update();

renderer.setScissorTest(true);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // left
    renderer.setScissor(0, 0, window.innerWidth/2, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth/2, window.innerHeight);
    controlsL.update()
    renderer.render(sceneL, cameraL)
    sceneL.update && sceneL.update(timeStamp);

    // right
    renderer.setScissor(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight);
    renderer.setViewport(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight);
    controlsR.update()
    renderer.render(sceneR, cameraR)
    sceneR.update && sceneR.update(timeStamp);
    
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    cameraL.aspect = innerWidth / (2 * innerHeight);
    cameraL.updateProjectionMatrix();
    cameraR.aspect = innerWidth / (2 * innerHeight);
    cameraR.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);


const windowKeyHandler = (event) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ']
    if (keys.includes(event.key)) {
        sceneL.arrow(event.key);
    }   
};
window.addEventListener('keydown', windowKeyHandler, false);