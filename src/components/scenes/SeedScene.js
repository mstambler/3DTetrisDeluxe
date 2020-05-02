import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Block, Floor, Grid } from 'objects';
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
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const land = new Land();
        const floor = new Floor(this);
        const grid = new Grid(this);
        const flower = new Flower(this);
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

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        var floored = this.state.curBlock.floored();
        if (floored) {
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
