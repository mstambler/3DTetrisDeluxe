import { Group, MeshBasicMaterial, Mesh, DoubleSide, Vector3 } from 'three';
import { PlaneBufferGeometry, LineBasicMaterial, BufferGeometry, LineSegments } from 'three';

class Floor extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
        };

        this.name = 'floor';

        // Make floor
        const geometry = new PlaneBufferGeometry(12, 4).rotateX(-0.5*Math.PI);
        const material = new MeshBasicMaterial({color: 0x555555, side: DoubleSide});
        const mesh = new Mesh(geometry, material);

        // add to mesh
        this.add(mesh);
        this.position.y = -10;

        // Add self to parent's update list
        //parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }
}

export default Floor;
