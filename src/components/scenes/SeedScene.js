import * as Dat from 'dat.gui';
import { Scene, Color, TextGeometry, MeshPhongMaterial, Mesh, Font} from 'three';
import { Block, Floor, Grid } from 'objects';
import { BasicLights } from 'lights';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            Start: this.startGame.bind(this), // gui buttons
            Shape: 'Cube',
            Colors: 'Standard',
            updateList: [],
            curBlock: undefined,
            nextBlock: undefined,
            holdBlock: undefined,
            switched: false, // did curBlock just get switched out from hold?
            width: 10,
            height: 20,
            board: [],
            score: 0,
            highScore: 0,
            level: 1,
            rows: 0,
            speed: 0.02,
        };

        // Set background to a nice color
        this.rowPoints = [40, 100, 300, 1200];

        // Add meshes to scene
        const floor = new Floor(this);
        const grid = new Grid(this);
        const lights = new BasicLights();
        this.add(floor, grid, lights);

        // create text stuff
        this.updateScoreKeeper();
        this.makeText();

        // Populate GUI
        this.state.gui.add(this.state, 'Start');
        this.state.gui.add(this.state, 'Shape', [ 'Cube', 'Sphere' ]);
        this.state.gui.add(this.state, 'Colors', [ 'Standard', 'Brick', 'Marble', 'Neon' ]);
    }

    // start a new game
    startGame() {
        this.state.score = 0;
        this.state.level = 1;
        this.state.rows = 0;
        this.state.speed = 0.02;
        this.state.switched = false;

        if (this.state.nextBlock != undefined) {
            this.state.curBlock = undefined;
            this.state.nextBlock = undefined;
            this.state.holdBlock = undefined;
            this.removeFromUpdateList();
        }

        // Create grid
        for (let i = -4.5; i < 5; i += 1) {
            if (this.state.board[i] == undefined) {
                this.state.board[i] = [];
            }
            for (let j = -9.5; j < 10; j += 1) {
                this.state.board[i][j] = undefined;
            }
        }

        // remove any blocks from previous game
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            if (child instanceof Block) {
                this.remove(child);
            }
            else if (child.name == 'game_over') {
                this.remove(child);
            }
        }

        this.updateScoreKeeper();
        this.addBlock();
        this.addBlock();
    }

    // one time: make next and hold text
    makeText() {
        const fontJson = require('three/examples/fonts/optimer_bold.typeface.json');
        const font = new Font(fontJson);

        const nextGeometry = new TextGeometry('Next:', {
            font: font,
            size: 1.5,
            height: 0.25,
            curveSegments: 10,
        });
        const nextMaterial = new MeshPhongMaterial({color: 0x8a2be2});
        const nextMesh = new Mesh(nextGeometry, nextMaterial);
        nextMesh.rotateY(Math.PI);
        nextMesh.position.x = 11;
        nextMesh.position.y = 8;
        nextMesh.name = 'next';
        this.add(nextMesh);

        const holdGeometry = new TextGeometry('Hold:', {
            font: font,
            size: 1.5,
            height: 0.25,
            curveSegments: 10,
        });
        const holdMaterial = new MeshPhongMaterial({color: 0xffff33});
        const holdMesh = new Mesh(holdGeometry, holdMaterial);
        holdMesh.rotateY(Math.PI);
        holdMesh.position.x = 11.5;
        holdMesh.position.y = 2;
        holdMesh.name = 'hold';
        this.add(holdMesh);
    }

    // add a new block, update next block to current block, start the block
    addBlock() {
        const newBlock = new Block(this);
        this.state.curBlock = this.state.nextBlock;
        this.state.curBlock && this.state.curBlock.start();
        this.state.nextBlock = newBlock;
        this.state.nextBlock.hideShadow();
        this.add(newBlock);
    }

    holdBlock() {
        if (this.state.switched) return; // don't allow switiching a block out then in

        this.state.switched = true;
        this.removeFromUpdateList();
        this.state.curBlock.position.x = 9.5;
        this.state.curBlock.position.y = 0;
        this.state.curBlock.hideShadow();

        if (this.state.holdBlock === undefined) {
            this.state.holdBlock = this.state.curBlock;
            this.addBlock();
        } else {
            const temp = this.state.holdBlock;
            this.state.holdBlock = this.state.curBlock;
            this.state.curBlock = temp;
            this.state.curBlock.start();
        }
    }

    // check for game over
    gameOver() {
        const cur = this.state.curBlock;
        for (let offset of cur.state.offsets) {
            if (cur.position.y + offset.y > 9.5) {
                return true;
            }
        }
        return false;
    }

    // update the block once a block has stopped moving
    updateBlock() {
        // check for game over
        if (this.gameOver()) {
            this.state.curBlock = undefined;
            this.state.nextBlock = undefined;
            this.state.holdBlock = undefined;

            const fontJson = require('three/examples/fonts/optimer_bold.typeface.json');
            const font = new Font(fontJson);

            const geometry = new TextGeometry('GAME OVER', {
                font: font,
                size: 5,
                height: 1,
                curveSegments: 10,
                bevelEnabled: false,
            });
            const material = new MeshPhongMaterial({color: 0x87071c});
            const mesh = new Mesh(geometry, material);
            mesh.rotateY(Math.PI);
            mesh.position.x = 20;
            mesh.position.z = -5;
            mesh.name = 'game_over';

            const scoreGeo = new TextGeometry(String('Score: ' + this.state.score), {
                font: font,
                size: 3,
                height: 1,
                curveSegments: 10,
                bevelEnabled: false,
            });
            const materialScore = new MeshPhongMaterial({color: 0x097025});
            const meshScore = new Mesh(scoreGeo, materialScore);
            meshScore.position.x = 12;
            meshScore.position.y = -5;

            mesh.add(meshScore);
            this.add(mesh);
            return;
        }

        // update board with cubes
        const x = this.state.curBlock.position.x;
        const y = this.state.curBlock.position.y;
        for (let i = 0; i < this.state.curBlock.state.cubes.length; i++) {
            const offset = this.state.curBlock.state.offsets[i];
            this.state.board[x + offset.x][y + offset.y] = this.state.curBlock.state.cubes[i];
        }
        this.state.curBlock = undefined;
        this.state.switched = false;

        let rowsCleared = 0;
        let madeTween = false;
        for (let i = -9.5; i < 10; i += 1) {
            let count = 0;
            for (let j = 4.5; j > -5; j -= 1) {
                if (this.state.board[j][i] != undefined) {
                    count += 1;
                }
            }

            if (count == 10) {
                rowsCleared += 1;
                // remove row
                const cubes = [];
                const flashTweens = [];
                const fallTweenCols = [];
                for (let j = -4.5; j < 5; j += 1) {
                    const cube = this.state.board[j][i];
                    this.state.board[j][i] = undefined;
                    // create a color change tween and remember its corresponding cube
                    const flash = new TWEEN.Tween(cube.material).to({opacity: 0.0}, 700).easing(TWEEN.Easing.Linear.None);
                    const flashColor = new TWEEN.Tween(cube.material.color).to({r: 1.0, g: 1.0, b: 1.0}, 500).easing(TWEEN.Easing.Linear.None);
                    cubes[j] = cube;
                    flashTweens[j] = [flash, flashColor];
                    fallTweenCols[j] = [];
                    if (cube.parent.state.geo != 'Sphere') {
                        const flashEdge = new TWEEN.Tween(cube.children[0].material).to({opacity: 0.0}, 700).easing(TWEEN.Easing.Linear.None);
                        flashTweens[j].push(flashEdge);
                    }
                }

                // shift rows down
                // go through all rows including and above i
                for (let k = i; k < 10; k += 1) {
                    for (let j = -4.5; j < 5; j += 1) {
                        const blockAbove = this.state.board[j][k + 1];
                        this.state.board[j][k] = blockAbove;
                        if (blockAbove != undefined) {
                            const fall = new TWEEN.Tween(blockAbove.position).to({y: blockAbove.position.y - rowsCleared}, 300).easing(TWEEN.Easing.Quadratic.In);
                            if (!madeTween) {
                                fall.onComplete(this.addBlock.bind(this));
                                madeTween = true;
                            }
                            fallTweenCols[j].push(fall);
                        }
                    }
                }
                i -= 1;

                // do color change then remove block then have blocks above it fall
                for (let j = -4.5; j < 5; j += 1) {
                    flashTweens[j][0].onComplete(() => {
                        cubes[j].parent.remove(cubes[j]);
                        for (let fallTween of fallTweenCols[j]) {
                            fallTween.start();
                        }
                    });
                    flashTweens[j][0].start();
                    flashTweens[j][1].start();
                    if (cubes[j].parent.state.geo != 'Sphere') {
                        flashTweens[j][2].start();
                    }
                }
            }
        }

        // calculate score
        if (rowsCleared > 0) {
            this.state.rows += rowsCleared;
            this.state.score += this.rowPoints[rowsCleared-1]*this.state.level;
            if (parseInt(this.state.rows/10) > this.state.level - 1) {
                this.state.level += 1;
                this.state.speed += 0.01;
            }
            if (this.state.score > this.state.highScore) this.state.highScore = this.state.score;
            this.updateScoreKeeper();
        } else {
            this.addBlock();
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    removeFromUpdateList() {
        this.state.updateList.shift();
    }

    update(timeStamp) {
        const { updateList } = this.state;

        if (this.state.Colors == "Neon") {
            this.background = undefined;
        }
        else {
            this.background = new Color(0x7ec0ee);
        }
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        // update Tweens
        TWEEN.update();
    }

    arrow(key) {
        if (key == 'Shift') this.state.nextBlock && this.holdBlock();
        else if (this.state.curBlock != undefined) this.state.curBlock.blockArrow(key);
    }

    // update visible score
    updateScoreKeeper() {
        const fontJson = require('three/examples/fonts/optimer_bold.typeface.json');
        const font = new Font(fontJson);

        const text = String('High Score: ' + this.state.highScore + '\nScore: ' + this.state.score + '\nLevel: ' + this.state.level);
        const geometry = new TextGeometry(text, {
            font: font,
            size: 1,
            height: 0.25,
            curveSegments: 10,
            bevelEnabled: false,
        });

        const material = new MeshPhongMaterial({color: 0x1106a1});
        const mesh = new Mesh(geometry, material);
        mesh.rotateY(Math.PI);
        mesh.position.x = -7;
        mesh.position.y = 9;

        if (this.scoreKeeper != undefined) this.remove(this.scoreKeeper);
        this.scoreKeeper = mesh;
        this.add(mesh);
    }
}

export default SeedScene;
