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
        const geometry = new PlaneBufferGeometry(100, 100).rotateX(-0.5*Math.PI);
        const material = new MeshBasicMaterial({color: 0x555555, side: DoubleSide});
        const mesh = new Mesh(geometry, material);

        // Make lines
        const numSquares = 10;
        const numPoints = 2*(numSquares + 1);
        const points = [];
        for (let i = 0; i < numSquares + 1; i++) {
            const x = i - numSquares/2;
            points.push(new Vector3(x, 0, 0));
            points.push(new Vector3(x, 0, 1));
        }
        points.push(points[0], points[numPoints - 2]);
        points.push(points[1], points[numPoints - 1]);

        const lineGeometry = new BufferGeometry().setFromPoints(points);
        const lineMaterial = new LineBasicMaterial({color: 0xFFFFFF});
        const lines = new LineSegments(lineGeometry, lineMaterial);

        // add to mesh
        this.add(mesh, lines);
        this.position.y = -1;

        // Add self to parent's update list
        //parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }
}

export default Floor;
