import { Group, MeshBasicMaterial, CircleBufferGeometry, Mesh, DoubleSide, TextureLoader} from 'three';
import TEXTURE_FLASH from './flash.jpg';
import TEXTURE_SNAIL from './snail.png';
import TEXTURE_BOMB from './bomb.png';
import TEXTURE_SHUFF from './shuffle.jpg';


class Powerup extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            type: Math.floor(Math.random()*4),
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
            case 3: // shuffle
                texture = new TextureLoader().load(TEXTURE_SHUFF);
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
                //alert("speed up!");
                break;
            case 1: // snail
                if (scene.state.speed > 0.01) {
                    scene.state.speed -= 0.01;
                }
                //alert("slow down!");
                break;
            case 2: // bomb
                /*if (orient == "col") {
                    for (let i = -9.5; i < 10; i += 1) {
                        if (scene.state.board[val][i] != undefined) {
                            const cube = scene.state.board[col][i];
                            scene.state.board[val][i] = undefined;
                        }
                    }
                }*/

                // how to remove and move:
                /*for (let i = -4.5; i < 5; i += 1) {
                    const cube = scene.state.board[i][-9.5];
                    if (cube != undefined) {
                    cube.parent.remove(cube);
                    }
                    const blockAbove = scene.state.board[i][-8.5];
                    scene.state.board[i][-9.5] = blockAbove;
                        if (blockAbove != undefined) {
                            blockAbove.translateY(-1);
                        }
                }*/
                break;
            case 3:
                // need val to be the row for this
                for (let i = -9.5; i < 10; i += 1) {
                    if (i != val) {
                        let shuffled = [];
                        for (let j = 4.5; j > -5; j -= 1) {
                            shuffled[j] = scene.state.board[j][i];
                        }
                        shuffled = this.shuffle(shuffled);
                        for (let k = 4.5; k > -5; k -= 1) {
                            const cube = shuffled[k];
                            scene.state.board[k][i] = cube;
                            if (cube != undefined) {
                                const cur_x = cube.parent.position.x + cube.position.x;
                                cube.translateX(k - cur_x);
                            }
                        }
                    }
                }
                break;
        }
    }

    shuffle(array) {
        var m = 10, t, i;
      
        // While there remain elements to shuffle…
        while (m) {
      
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);
      
          // And swap it with the current element.
          t = array[m - 4.5];
          array[m - 4.5] = array[i - 4.5];
          array[i - 4.5] = t;
        }
      
        return array;
      }
}

export default Powerup;
