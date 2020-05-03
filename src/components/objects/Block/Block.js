import { Group, BoxBufferGeometry, EdgesGeometry, MeshPhongMaterial, LineBasicMaterial, LineSegments, Mesh } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function makeBlock(shape) {
    // Make block
    const geometries = [];
    let offsets;
    let material;

    switch(shape) {
        case 0: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0xfcff4a});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(0, -1, 0);
            geometry4.translate(-1, -1, 0);

            offsets = [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: 0, y: -1},
                {x: -1, y: -1}
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
        case 1: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x40fcff});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(-2, 0, 0);
            geometry4.translate(-3, 0, 0);

            offsets = [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: -2, y: 0},
                {x: -3, y: 0}
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
        case 2: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0xff0000});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(0, -1, 0);
            geometry4.translate(1, -1, 0);

            offsets = [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: 0, y: -1},
                {x: 1, y: -1}
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
        case 3: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x24ab27});

            geometry2.translate(1, 0, 0);
            geometry3.translate(0, -1, 0);
            geometry4.translate(-1, -1, 0);

            offsets = [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 0, y: -1},
                {x: -1, y: -1}
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
        case 4: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0xcf7f00});

            geometry2.translate(1, 0, 0);
            geometry3.translate(1, -1, 0);
            geometry4.translate(-1, 0, 0);

            offsets = [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 1, y: -1},
                {x: -1, y: 0},
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
        case 5: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x121db8});

            geometry2.translate(-1, 0, 0);
            geometry3.translate(-1, -1, 0);
            geometry4.translate(1, 0, 0);

            offsets = [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: -1, y: -1},
                {x: 1, y: 0},
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
        case 6: {
            const geometry1 = new BoxBufferGeometry(1, 1, 1);
            const geometry2 = new BoxBufferGeometry(1, 1, 1);
            const geometry3 = new BoxBufferGeometry(1, 1, 1);
            const geometry4 = new BoxBufferGeometry(1, 1, 1);
            material = new MeshPhongMaterial({color: 0x8d0fb8});

            geometry2.translate(1, 0, 0);
            geometry3.translate(-1, 0, 0);
            geometry4.translate(0, -1, 0);

            offsets = [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: -1, y: 0},
                {x: 0, y: -1},
            ];

            geometries.push(geometry1);
            geometries.push(geometry2);
            geometries.push(geometry3);
            geometries.push(geometry4);
            break;
        }
    }

    return [geometries, material, offsets];

    // const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    // const mesh = new Mesh(mergedGeometry, material);
  }

class Block extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            shape: -1,
            continuousPos: 10,
            shape: Math.floor(Math.random()*7),
            cubes: [],
            offsets: [],
            floored: false,
        };

        this.name = 'block';

        const [geometries, material, offsets] = makeBlock(this.state.shape);
        for (let geometry of geometries) {
            const mesh = new Mesh(geometry, material);
            const edgesGeometry = new EdgesGeometry(geometry);
            const edgesMaterial = new LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
            const edges = new LineSegments(edgesGeometry, edgesMaterial);
            mesh.add(edges);

            this.state.cubes.push(mesh);
            this.add(mesh);
        }
        this.state.offsets = offsets;

        this.position.x = -0.5;
        this.position.y = 9.5;

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    update(timeStamp) {
        for (let offset of this.state.offsets) {
            if (this.position.y + offset.y < -9) {
                this.state.floored = true;
                return;
            }
        }
        this.state.continuousPos -= 0.02;
        this.position.y = Math.ceil(this.state.continuousPos) - 0.5;
    }

    blockArrow(key) {
        switch(key) {
            case "ArrowRight":
                for (let offset of this.state.offsets) {
                    if (this.position.x + offset.x < -4) {
                        return;
                    }
                }
                this.position.x = this.position.x - 1;
                break;
            case "ArrowLeft":
                for (let offset of this.state.offsets) {
                    if (this.position.x + offset.x > 4) {
                        return;
                    }
                }
                this.position.x = this.position.x + 1;
                break;
            case "ArrowDown":
                for (let offset of this.state.offsets) {
                    if (this.position.y + offset.y < -9) {
                        this.state.floored = true;
                        return;
                    }
                }
                this.state.continuousPos = this.state.continuousPos - 1;
                this.position.y = this.position.y - 1;
                break;
            case " ":
                let minY = this.position.y;
                for (let offset of this.state.offsets) {
                    if (this.position.y + offset.y < -9) {
                        this.state.floored = true;
                        return;
                    }
                    if (this.position.y + offset.y < minY) {
                        minY = this.position.y + offset.y;
                    }
                }
                const dist = minY + 9.5;
                this.state.continuousPos -= dist;
                this.position.y -= dist;
                break;
            case "ArrowUp":
                if (this.state.shape > 1) {
                    this.rotateZ(Math.PI / 2);
                    for (let offset of this.state.offsets) {
                        const x = offset.x;
                        offset.x = -1*offset.y;
                        offset.y = x;
                    }

                    for (let offset of this.state.offsets) {
                        // check to the right
                        if (this.position.x + offset.x < -4.5) {
                            this.position.x += 1;
                            return;
                        } else if (this.position.x + offset.x > 4.5) {
                            this.position.x -= 1;
                            return;
                        }
                        if (this.position.y + offset.y > 9.5) {
                            this.position.y -= 1;
                            this.state.continuousPos -= 1;
                            return;
                        }
                    }
                } else if (this.state.shape == 1) {
                    if (this.state.offsets[1].y == 0) { // horizontal
                        this.rotateZ(Math.PI / 2);
                        for (let offset of this.state.offsets) {
                            offset.y = offset.x;
                            offset.x = 0;
                        }
                        for (let offset of this.state.offsets) {
                            // check down
                            let dist = 0;
                            if (this.position.y + offset.y < -9.5) {
                                dist += 1;
                            }
                            this.position.y += dist;
                            this.state.continuousPos += dist;
                        }
                    } else { // vertical
                        this.rotateZ(-Math.PI / 2);
                        for (let offset of this.state.offsets) {
                            offset.x = offset.y;
                            offset.y = 0;
                        }
                        for (let offset of this.state.offsets) {
                            // check to the right
                            let dist = 0;
                            if (this.position.x + offset.x < -4.5) {
                                dist += 1;
                            }
                            this.position.x += dist;
                        }
                    }
                }
                break;
        }
    }

    floored() {
        return this.state.floored;
    }
}

export default Block;
