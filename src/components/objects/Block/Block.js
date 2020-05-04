import { Group, BoxBufferGeometry, EdgesGeometry, MeshPhongMaterial, LineBasicMaterial, LineSegments, Mesh } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

class Block extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            shape: Math.floor(Math.random()*7),
            continuousPos: 10,
            cubes: [],
            offsets: [],
            floored: false,
        };

        this.name = 'block';
        this.makeBlock(this.state.shape);
        
        // starting position
        if (this.state.shape == 1) {
            this.position.x = 1.5;
        }
        else {
            this.position.x = 0.5;
        }
        this.position.y = 9.5;

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    makeBlock(shape) {
        // Each block is made up of 4 cubes
        const geometries = [];
        for (let i = 0; i < 4; i++) {
            geometries.push(new BoxBufferGeometry(1, 1, 1));
        }
        let material;
    
        switch(shape) {
            case 0: { // O
                material = new MeshPhongMaterial({color: 0xfcff4a});
    
                /*geometries[1].translate(-1, 0, 0);
                geometries[2].translate(0, -1, 0);
                geometries[3].translate(-1, -1, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: -1, y: 0},
                    {x: 0, y: -1},
                    {x: -1, y: -1}
                ];
                break;
            }
            case 1: { // I
                material = new MeshPhongMaterial({color: 0x40fcff});
    
                /*geometries[1].translate(-1, 0, 0);
                geometries[2].translate(-2, 0, 0);
                geometries[3].translate(-3, 0, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: -1, y: 0},
                    {x: -2, y: 0},
                    {x: -3, y: 0}
                ];
                break;
            }
            case 2: { // S
                material = new MeshPhongMaterial({color: 0xff0000});
    
                /*geometries[1].translate(-1, 0, 0);
                geometries[2].translate(0, -1, 0);
                geometries[3].translate(1, -1, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: -1, y: 0},
                    {x: 0, y: -1},
                    {x: 1, y: -1}
                ];
                break;
            }
            case 3: { // Z
                material = new MeshPhongMaterial({color: 0x24ab27});
    
                /*geometries[1].translate(1, 0, 0);
                geometries[2].translate(0, -1, 0);
                geometries[3].translate(-1, -1, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: -1},
                    {x: -1, y: -1}
                ];
                break;
            }
            case 4: { // L
                material = new MeshPhongMaterial({color: 0xcf7f00});
    
                /*geometries[1].translate(1, 0, 0);
                geometries[2].translate(1, -1, 0);
                geometries[3].translate(-1, 0, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: -1},
                    {x: -1, y: 0},
                ];
                break;
            }
            case 5: { // J
                material = new MeshPhongMaterial({color: 0x121db8});
    
                /*geometries[1].translate(-1, 0, 0);
                geometries[2].translate(-1, -1, 0);
                geometries[3].translate(1, 0, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: -1, y: 0},
                    {x: -1, y: -1},
                    {x: 1, y: 0},
                ];
                break;
            }
            case 6: { // T
                material = new MeshPhongMaterial({color: 0x8d0fb8});
    
                /*geometries[1].translate(1, 0, 0);
                geometries[2].translate(-1, 0, 0);
                geometries[3].translate(0, -1, 0);*/
    
                this.state.offsets = [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: -1, y: 0},
                    {x: 0, y: -1},
                ];
                break;
            }
        }

        for (let i = 0; i < geometries.length; i++) {
            const geometry = geometries[i];
            const mesh = new Mesh(geometry, material);
            mesh.translateX(this.state.offsets[i].x);
            mesh.translateY(this.state.offsets[i].y);
            const edgesGeometry = new EdgesGeometry(geometry);
            const edgesMaterial = new LineBasicMaterial({color: 0x000000, linewidth: 4});
            const edges = new LineSegments(edgesGeometry, edgesMaterial);
            mesh.add(edges);
            this.state.cubes.push(mesh);
            this.add(mesh);
        }
    }

    update(timeStamp) {
        for (let offset of this.state.offsets) {
            if (this.position.y + offset.y < -9) {
                this.state.floored = true;
                this.parent.removeFromUpdateList();
                return;
            }
            if (this.parent.state.board[this.position.x + offset.x][this.position.y + offset.y - 1] !== undefined) {
                this.state.floored = true;
                this.parent.removeFromUpdateList();
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
                    if (this.parent.state.board[this.position.x + offset.x - 1][this.position.y + offset.y] !== undefined) {
                        return;
                    }
                }
                this.position.x -= 1;
                break;
            case "ArrowLeft":
                for (let offset of this.state.offsets) {
                    if (this.position.x + offset.x > 4) {
                        return;
                    }
                    if (this.parent.state.board[this.position.x + offset.x + 1][this.position.y + offset.y] !== undefined) {
                        return;
                    }
                }
                this.position.x += 1;
                break;
            case "ArrowDown":
                this.state.continuousPos -= 1;
                this.position.y -= 1;
                break;
            case " ":
                let minDropDist = this.position.y + 9.5;
                for (let offset of this.state.offsets) {
                    // check for blocks below
                    for (let y = this.position.y + offset.y - 1; y > -10; y--) {
                        if (this.parent.state.board[this.position.x + offset.x][y] !== undefined) {
                            // found the block it would intersect
                            if (this.position.y + offset.y - y - 1 < minDropDist) {
                                minDropDist = this.position.y + offset.y - y - 1;
                            }
                            break;
                        }
                    }
                    minDropDist = Math.min(minDropDist, this.position.y + offset.y + 9.5);
                }

                // move down
                this.state.continuousPos -= minDropDist;
                this.position.y -= minDropDist;
                break;
            case "ArrowUp":
                if (this.state.shape > 1) {
                    //this.rotateZ(Math.PI / 2);
                    for (let i = 0; i < this.state.offsets.length; i++) {
                        
                        const x = this.state.offsets[i].x;
                        this.state.offsets[i].x = -1*this.state.offsets[i].y;
                        let cube = this.state.cubes[i];
                        this.state.offsets[i].y = x;

                        this.state.cubes[i].position.x = this.state.offsets[i].x;
                        this.state.cubes[i].position.y = this.state.offsets[i].y;
                    }

                    // ADD CHECKS FOR BLOCK
                    for (let offset of this.state.offsets) {
                        if (this.position.x + offset.x < -4.5) { // check right
                            this.position.x += 1;
                            return;
                        } else if (this.position.x + offset.x > 4.5) { // check left
                            this.position.x -= 1;
                            return;
                        }
                        if (this.position.y + offset.y > 9.5) { // check up
                            this.position.y -= 1;
                            this.state.continuousPos -= 1;
                            return;
                        }
                    }
                } else if (this.state.shape == 1) { // I block
                    if (this.state.offsets[1].y == 0) { // horizontal
                        //this.rotateZ(Math.PI / 2);
                        for (let i = 0; i < this.state.offsets.length; i++) {
                            this.state.offsets[i].y = this.state.offsets[i].x;
                            this.state.offsets[i].x = 0;

                            this.state.cubes[i].position.x = this.state.offsets[i].x;
                            this.state.cubes[i].position.y = this.state.offsets[i].y;
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
                        //this.rotateZ(-Math.PI / 2);
                        for (let i = 0; i < this.state.offsets.length; i++) {
                            this.state.offsets[i].x = this.state.offsets[i].y;
                            this.state.offsets[i].y = 0;

                            this.state.cubes[i].position.x = this.state.offsets[i].x;
                            this.state.cubes[i].position.y = this.state.offsets[i].y;
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
