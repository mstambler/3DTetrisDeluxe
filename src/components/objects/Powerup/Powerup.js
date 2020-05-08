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

        //debugger;

        this.name = 'powerup';

        this.state.r = Math.floor(Math.random()*4);

        this.position.z = -0.501;

        const geometry = new CircleBufferGeometry(0.5, 32);
        let texture ;
        
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
        let scene = this.parent.parent.parent;
        switch (this.state.type) {
            case 0: // flash
                scene.state.speed += 0.01;
                alert("speed up!");
                break;
            case 1: // snail
                scene.state.speed -= 0.01;
                alert("slow down!");
                break;
            case 2: // bomb
                if (orient == "col") {
                    for (let i = -9.5; i < 10; i += 1) {
                        if (scene.state.board[val][i] != undefined) {
                            const cube = scene.state.board[col][i];
                            scene.state.board[val][i] = undefined;
                        }
                    }
                }
                break;
        }
    }
}

export default Powerup;
