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
// const scene = new SeedScene();
var canvas; 

var scenes = []; 
var renderer;
// var camera; 
canvas = document.createElement('canvas');
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);
var content = document.createElement('div'); 
content.id = content; 
content.position = 'absolute'; 
content.top = 0; 
content.width = '100%'; 
content.padding = '3em 0 0 0';
document.body.appendChild(content); 

for (var i = 0; i < 2; i++) {
    const scene = new SeedScene();
    //make a list item
    var element = document.createElement('div'); 
    element.className = 'list-item'; 
    element.display = 'inline-block';
    element.margin = '1em';
    element.padding = '1em';

    var sceneElement = document.createElement( 'div' );
    element.appendChild( sceneElement );
    
    var descriptionElement = document.createElement( 'div' );
    descriptionElement.innerText = 'Player ' + ( i + 1);
    element.appendChild(descriptionElement);
    
    scene.userData.element = sceneElement;
    content.appendChild(element); 
    
    var camera = new PerspectiveCamera();
    // Set up camera
    camera.position.set(0, 0, -30);
    camera.lookAt(new Vector3(0, 0, 0));
    scene.userData.camera = camera;

    // Set up controls
    var controls = new OrbitControls(scene.userData.camera, scene.userData.element);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI/2 + 0.05;
    controls.update();
    scene.userData.controls = controls;

    scenes.push(scene); 
}

renderer = new WebGLRenderer({canvas: canvas, antialias: true});

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setClearColor( 0xffffff, 1 );

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.setClearColor(0xfffffff);
    renderer.setScissorTest(false); 
    renderer.clear(); 

    renderer.setClearColor(0xe0e0e0);
    renderer.setScissorTest(true); 
    scenes.forEach(function(scene) {
        var element = scene.userData.element;
        var rect = element.getBoundingClientRect();
        var width = rect.right - rect.left;
        var height = rect.bottom - rect.top;
        var left = rect.left;
        var bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport( left, bottom, width, height ); 
        renderer.setScissor( left, bottom, width, height ); 

        camera = scene.userData.camera;
        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
        window.requestAnimationFrame(onAnimationFrameHandler);
    });
    
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    scenes.forEach(function(scene) {
        const { innerHeight, innerWidth } = window;
        renderer.setSize(innerWidth, innerHeight);
        scene.userData.camera.aspect = innerWidth / innerHeight;
        scene.userData.camera.updateProjectionMatrix();
    });
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);


const windowKeyHandler = (event) => {
    scenes.forEach(function(scene) {
        const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ']
        if (keys.includes(event.key)) {
            scene.arrow(event.key);
        }
    });
   
};
window.addEventListener('keydown', windowKeyHandler, false);