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
            rotationSpeed: 1,
            updateList: [],
            curBlock: null,
            width: 10,
            height: 20,
            board: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Create grid
        for (let i = -4.5; i < 5; i += 1) {
            this.state.board[i] = [];
            for (let j = -9.5; j < 10; j += 1) {
                this.state.board[i][j] = undefined;
            }
        }

        // Add meshes to scene
        const floor = new Floor(this);
        const grid = new Grid(this);
        const block = new Block(this);
        this.state.curBlock = block;

        const lights = new BasicLights();
        this.add(floor, grid, block, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    removeFromUpdateList() {
        this.state.updateList.pop();
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        if (this.state.curBlock.floored()) {
            // update board with cubes
            const x = this.state.curBlock.position.x;
            const y = this.state.curBlock.position.y;
            for (let i = 0; i < this.state.curBlock.state.cubes.length; i++) {
                const offset = this.state.curBlock.state.offsets[i];
                this.state.board[x + offset.x][y + offset.y] = this.state.curBlock.state.cubes[i];
            }

            const newBlock = new Block(this);
            this.state.curBlock = newBlock;
            this.add(newBlock);
        }
    }

    arrow(key) {
        this.state.curBlock.blockArrow(key);
    }
}

export default SeedScene;
