import { Group, MeshBasicMaterial, CircleBufferGeometry, Mesh, DoubleSide, TextureLoader} from 'three';
import TEXTURE_FLASH from './flash.jpg';
import TEXTURE_SNAIL from './snail.png';
import TEXTURE_BOMB from './bomb.png';


class Powerup extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            type: Math.floor(Math.random()*3),
            r: -1,
        };

        this.name = 'powerup';
        this.state.r = Math.floor(Math.random()*4);
        this.position.z = -0.501;

        const geometry = new CircleBufferGeometry(0.5, 32);
        let texture;
        
        switch (this.state.type) {
            case 0: // flash
                texture = new TextureLoader().load(TEXTURE_FLASH);
                break;
            case 1: // snail
                texture = new TextureLoader().load(TEXTURE_SNAIL);
                break;
            case 2: // bomb
                texture = new TextureLoader().load(TEXTURE_BOMB);
                break;
        }
        const material = new MeshBasicMaterial({map: texture, side: DoubleSide, transparent: true});
        const circle = new Mesh(geometry, material);

        const circle_back = new Mesh(geometry, material);
        circle_back.translateZ(1.002);
        circle.add(circle_back);
        this.add(circle);
    }

    execute(val, orient) {
        const scene = this.parent.parent.parent;
        switch (this.state.type) {
            case 0: // flash
                scene.state.speed += 0.01;
                alert("speed up!");
                return undefined;
            case 1: // snail
                scene.state.speed -= 0.01;
                alert("slow down!");
                return undefined;
            case 2: // bomb
                if (orient == 'col') {
                    const flashTweens = [];
                    const cubes = [];
                    const rowsBelowCleared = [];

                    for (let j = -4.5; j < 5; j += 1) {
                        flashTweens[j] = [];
                        cubes[j] = [];
                    }
                    
                    for (let i = -9.5; i < 10; i += 1) {
                        rowsBelowCleared[i] = 0;
                    }

                    for (let i = -9.5; i < 10; i += 1) {
                        const cube = scene.state.board[val][i];
                        if (cube != undefined) {
                            scene.state.board[val][i] = undefined;
                            flashTweens[val][i] = scene.createFlashTween(cube);
                            cubes[val][i] = cube;

                            let powerupIndex = 0;
                            if (cube.parent.state.geo != 'Sphere') {
                                powerupIndex = 1;
                            }

                            if (cube.children[powerupIndex]) {
                                const ret = cube.children[powerupIndex].execute(i, 'row');
                                if (ret != undefined) {
                                    // copy over tweens
                                    const [powerupTweens, powerupCubes, powerupRowsBelowCleared] = ret;
                                    for (let i = -9.5; i < 10; i += 1) {
                                        rowsBelowCleared[i] += powerupRowsBelowCleared[i];
                                        for (let j = -4.5; j < 5; j += 1) {
                                            if (powerupTweens[j] && powerupTweens[j][i]) {
                                                flashTweens[j][i] = powerupTweens[j][i];
                                                cubes[j][i] = powerupCubes[j][i];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return [flashTweens, cubes, rowsBelowCleared];
                } else {
                    const flashTweens = [];
                    const cubes = [];
                    const rowsBelowCleared = [];

                    for (let j = -4.5; j < 5; j += 1) {
                        flashTweens[j] = [];
                        cubes[j] = [];
                    }

                    for (let i = -9.5; i < 10; i += 1) {
                        if (i > val) {
                            rowsBelowCleared[i] = 1;
                        } else {
                            rowsBelowCleared[i] = 0;
                        }
                    }

                    for (let j = -4.5; j < 5; j += 1) {
                        const cube = scene.state.board[j][val];
                        if (cube != undefined) {
                            scene.state.board[j][val] = undefined;
                            flashTweens[j][val] = scene.createFlashTween(cube);
                            cubes[j][val] = cube;

                            let powerupIndex = 0;
                            if (cube.parent.state.geo != 'Sphere') {
                                powerupIndex = 1;
                            }

                            if (cube.children[powerupIndex]) {
                                const ret = cube.children[powerupIndex].execute(j, 'col');
                                if (ret != undefined) {
                                    // copy over tweens
                                    const [powerupTweens, powerupCubes, powerupRowsBelowCleared] = ret;
                                    for (let i = -9.5; i < 10; i += 1) {
                                        rowsBelowCleared[i] += powerupRowsBelowCleared[i];
                                        for (let j = -4.5; j < 5; j += 1) {
                                            if (powerupTweens[j] && powerupTweens[j][i]) {
                                                flashTweens[j][i] = powerupTweens[j][i];
                                                cubes[j][i] = powerupCubes[j][i];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return [flashTweens, cubes, rowsBelowCleared]; 
                }
        }
    }
}

export default Powerup;
