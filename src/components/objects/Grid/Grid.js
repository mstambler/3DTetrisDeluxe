import { Group, Vector3, LineBasicMaterial, BufferGeometry, LineSegments } from 'three';

class Grid extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
        };

        this.name = 'grid';

        // Make lines
        const width = 10;
        const height = 20;
        const points = [];
        for (let i = 0; i < width + 1; i++) {
            for (let j = 0; j < height + 1; j++) {
                const x = i - width/2;
                points.push(new Vector3(x, j, -0.5));
                points.push(new Vector3(x, j, 0.5));
            }
        }

        for (let j = 0; j < height + 1; j++) {
            points.push(new Vector3(-width/2, j, -0.5));
            points.push(new Vector3(width/2, j, -0.5));
            points.push(new Vector3(-width/2, j, 0.5));
            points.push(new Vector3(width/2, j, 0.5));
        }

        for (let i = 0; i < width + 1; i++) {
            const x = i - width/2;
            points.push(new Vector3(x, 0, -0.5));
            points.push(new Vector3(x, height, -0.5));
            points.push(new Vector3(x, 0, 0.5));
            points.push(new Vector3(x, height, 0.5));
        }

        const lineGeometry = new BufferGeometry().setFromPoints(points);
        const lineMaterial = new LineBasicMaterial({color: 0xffffff});
        const lines = new LineSegments(lineGeometry, lineMaterial);

        // add to mesh
        this.add(lines);
        this.position.y = -10;
    }
}

export default Grid;
