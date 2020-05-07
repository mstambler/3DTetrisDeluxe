import { Group, Vector3, LineDashedMaterial, BufferGeometry, LineSegments } from 'three';

class Powerup extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
        };

        this.name = 'powerup';

        // this.position.y = -10;
    }
}

export default Powerup;
