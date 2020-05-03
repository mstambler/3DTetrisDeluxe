import { Group, BoxBufferGeometry, EdgesGeometry, MeshPhongMaterial, LineBasicMaterial, LineSegments, Mesh } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function outlinedBox(shape) {
    // Make block
    var geometries = [];
    var material = new MeshPhongMaterial();

    switch(shape) {
        case 0:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0xfcff4a});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(0, 1, 0);
            geometry4.translate(-1, 1, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        case 1:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x40fcff});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(-2, 0, 0);
            geometry4.translate(1, 0, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        case 2:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0xff0000});

            geometry2.translate(-1, 1, 0);
            geometry3.translate(0, 1, 0);
            geometry4.translate(1, 0, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        case 3:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x24ab27});

            geometry2.translate(1, 1, 0);
            geometry3.translate(0, 1, 0);
            geometry4.translate(-1, 0, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        case 4:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0xcf7f00});

            geometry2.translate(1, 0, 0);
            geometry3.translate(1, -1, 0);
            geometry4.translate(-1, 0, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        case 5:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x121db8});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(-1, -1, 0);
            geometry4.translate(1, 0, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        case 6:
            var geometry1 = new BoxBufferGeometry(1, 1, 1);
            var geometry2 = new BoxBufferGeometry(1, 1, 1);
            var geometry3 = new BoxBufferGeometry(1, 1, 1);
            var geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x8d0fb8});

            geometry2.translate(1, 0, 0);
            geometry3.translate(-1, 0, 0);
            geometry4.translate(0, -1, 0);

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
    }

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    const mesh = new Mesh(mergedGeometry, material);

    // add outline
    const edgesGeometry = new EdgesGeometry(mergedGeometry);
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
        const shape = Math.floor(Math.random()*7);
        const block = outlinedBox(shape);
        this.add(block);
        this.position.x = Math.floor(Math.random()*10) - 4.5;
        this.position.y = 9.5;


        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    update(timeStamp) {
        if (this.position.y > -9.5) {
            this.position.y -= 0.01;
        }
    }

    blockArrow(key) {
        switch(key) {
            case "ArrowRight":
                this.position.x = Math.max(this.position.x - 1, -4.5);
                break;
            case "ArrowLeft":
                this.position.x = Math.min(this.position.x + 1, 4.5);;
                break;
            case "ArrowDown":
                this.position.y = Math.max(this.position.y - 1, -10);
                break;
            case " ":
                this.position.y = -9.5;
                break;
        }
    }

    floored() {
        return (this.position.y <= -9.5);
    }
}

export default Block;
