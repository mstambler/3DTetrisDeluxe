import { Group, BoxBufferGeometry, EdgesGeometry, MeshPhongMaterial, LineBasicMaterial, LineSegments, Mesh } from 'three';

function outlinedBox(color) {
    // Make block
    const geometry = new BoxBufferGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({color: color});
    const mesh = new Mesh(geometry, material);

    // add outline
    const edgesGeometry = new EdgesGeometry(geometry);
    const edgesMaterial = new LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
    const edges = new LineSegments(edgesGeometry, edgesMaterial);
    mesh.add(edges);

    return mesh;
  }

class Block extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
        };

        this.name = 'block';
        const block = outlinedBox(0xff0000);
        this.add(block);
        this.position.x = Math.floor(Math.random()*10) - 4.5;
        this.position.y = 4;

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    update(timeStamp) {
        if (this.position.y > -0.5) {
            this.position.y -= 0.01;
        }
    }

    blockArrow(key) {
        debugger;
        switch(key) {
            case "ArrowRight":
                this.position.x = Math.max(this.position.x - 1, -4.5);
                break;
            case "ArrowLeft":
                this.position.x = Math.min(this.position.x + 1, 4.5);;
                break;
            case "ArrowDown":
                this.position.y = Math.max(this.position.y - 1, -0.5);
                break;
            case "Enter":
                this.position.y = -0.5;
                break;
        }
    }

    floored() {
        return (this.position.y <= -0.50);
    }
}

export default Block;
