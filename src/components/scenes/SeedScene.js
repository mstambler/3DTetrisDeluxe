import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Block, Floor, Grid } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            Start: 
                this.startGame.bind(this),
            updateList: [],
            curBlock: null,
            width: 10,
            height: 20,
            board: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        

        // Add meshes to scene
        const floor = new Floor(this);
        const grid = new Grid(this);
        const lights = new BasicLights();
        this.add(floor, grid, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'Start');
    }

    startGame() {
        if (this.state.curBlock != undefined) {
            this.state.curBlock = undefined;
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
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            if (child instanceof Block) {
                this.remove(child);
            }
        }
        this.addBlock();
    }

    addBlock() {
        const newBlock = new Block(this);
        this.state.curBlock = newBlock;
        this.add(newBlock);
    }

    gameOver() {
        const cur = this.state.curBlock;
        for (let offset of cur.state.offsets) {
            if (cur.position.y + offset.y > 9.5) {
                return true;
            }
        }
        return false;
    }

    updateBlock() {
        // update board with cubes
        const x = this.state.curBlock.position.x;
        const y = this.state.curBlock.position.y;
        for (let i = 0; i < this.state.curBlock.state.cubes.length; i++) {
            const offset = this.state.curBlock.state.offsets[i];
            this.state.board[x + offset.x][y + offset.y] = this.state.curBlock.state.cubes[i];
        }

        for (let i = 9.5; i > -10; i -= 1) {
            let count = 0;
            for (let j = 4.5; j > -5; j -= 1) {
                if (this.state.board[j][i] != undefined) {
                    count += 1;
                }
            }
            if (count == 10) {
                // remove row
                for (let j = -4.5; j < 5; j += 1) {
                    const cube = this.state.board[j][i];
                    this.state.board[j][i] = undefined;
                    cube.parent.remove(cube);
                }
                // shift rows down
                // go through all rows including and above i
                for (let k = i; k < 10; k += 1) {
                    for (let j = -4.5; j < 5; j += 1) {
                        const block_above = this.state.board[j][k + 1];
                        this.state.board[j][k] = block_above;
                        if (block_above != undefined) {
                            block_above.translateY(-1);
                        }
                    }
                }
            }
        }
        const game_over = this.gameOver();
        if (!game_over) {
            this.addBlock();
        }
        else {
            alert("Game over!")
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

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    arrow(key) {
        this.state.curBlock.blockArrow(key);
    }
}

export default SeedScene;
