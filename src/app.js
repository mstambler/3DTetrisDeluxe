/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Vector2, Layers, ShaderMaterial, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import { Block } from 'objects';
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
    //exposure: 1,
	bloomStrength: 2,
	bloomThreshold: 0.1,
	bloomRadius: 0
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

var bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

var toneComposer = new EffectComposer( renderer );
toneComposer.renderToScreen = false;
toneComposer.addPass( renderScene );
toneComposer.addPass( bloomPass );

var finalPass = new ShaderPass(
    new ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: toneComposer.renderTarget2.texture }
        },
        vertexShader: [
            "varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"
        ].join( "\n" ),
       fragmentShader: [
        "uniform sampler2D baseTexture;",
        "uniform sampler2D bloomTexture;",

        "varying vec2 vUv;",

        "vec4 getTexture( sampler2D texelToLinearTexture ) {",

            "return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );",

        "}",

        "void main() {",

            "gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );",

        "}"
       ].join( "\n" ),
        defines: {}
    } ), "baseTexture"
);
finalPass.needsSwap = true;

var finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    //renderer.render( scene, camera);
    var materials = {};
    for (let child of scene.children) {
        if (child instanceof Block) {
            child.layers.enable(1);
        }
        if ( toneLayer.test( child.layers ) === false ) {
            if (child.isMesh) {
                materials[ child.uuid ] = child.material;
                child.material = new MeshBasicMaterial( { color: "black" } );
            }
            else {
                materials[ child.children[0].uuid ] = child.children[0].material;
                child.children[0].material = new MeshBasicMaterial( { color: "black" } );
            }

            //child.colorWrite = false;
        }
    }
    //renderer.clear();
    //camera.layers.set( 1 );
    
	//bloomComposer.render();
    //camera.layers.set( 0 );
    //finalComposer.render();

    toneComposer.render();
    //renderer.clearDepth();
    //camera.layers.set( 0 );
    for (let child of scene.children) {
        if ( child.isMesh ) {
            child.material = materials[ child.uuid ];
            delete materials[ child.uuid ];

        }
        else if (child.children.length > 0 && materials[child.children[0].uuid]) {
            child.children[0].material = materials[ child.children[0].uuid ];
            delete materials[ child.children[0].uuid ];
        }
    }
    finalComposer.render();
    //renderer.render( scene, camera);
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