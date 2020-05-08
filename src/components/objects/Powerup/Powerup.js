import { Group, MeshBasicMaterial, CircleBufferGeometry, Mesh, DoubleSide} from 'three';

class Powerup extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            type: undefined,
            r: -1,
        };

        this.name = 'powerup';

        this.state.r = Math.floor(Math.random()*4);

        this.position.z = -0.501;

        const geometry = new CircleBufferGeometry(0.5, 32);
        const material = new MeshBasicMaterial({color: 0x000000, side: DoubleSide, transparent: true});
        const circle = new Mesh(geometry, material);
        this.add(circle);
    }
}

export default Powerup;
