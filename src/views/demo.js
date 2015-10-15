let debug = require('debug')('game:views/demo');
let View = require('../engine/view');
let ImprovedNoise = require('../utils/improved-noise');
let TextureAtlas = require('../utils/texture-atlas');

// TODO efficience
// let _tileCache = new Map();
let _tilesTextureAtlas = null;
let _tilesMaterial = null;

let _createBlockGeometry = function (block, blockWidth, blockHeight, blockDepth) {
    let geometries = [];

    // ok
    if (block.south) {
        let south = _tilesTextureAtlas.getBounds(block.south);

        let southGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        southGeometry.faceVertexUvs[0][0] = [south[0], south[1], south[3]];
        southGeometry.faceVertexUvs[0][1] = [south[1], south[2], south[3]];
        southGeometry.rotateY(Math.PI / 2);
        southGeometry.translate(blockWidth / 2, 0, 0);

        geometries.push(southGeometry);
    }

    let northGeometry = null;

    // ok
    if (block.north) {
        let north = _tilesTextureAtlas.getBounds(block.north);

        let northGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        northGeometry.faceVertexUvs[0][0] = [north[0], north[1], north[3]];
        northGeometry.faceVertexUvs[0][1] = [north[1], north[2], north[3]];
        northGeometry.rotateY(-(Math.PI / 2));
        northGeometry.translate(-(blockWidth / 2), 0, 0);

        geometries.push(northGeometry);
    }

    if (block.west) {
        let west = _tilesTextureAtlas.getBounds(block.west);

        let westGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        westGeometry.faceVertexUvs[0][0] = [west[0], west[1], west[3]];
        westGeometry.faceVertexUvs[0][1] = [west[1], west[2], west[3]];
        westGeometry.rotateX((Math.PI / 2));
        westGeometry.translate(0, -(blockHeight / 2), 0);

        geometries.push(westGeometry);
    }

    if (block.east) {
        let east = _tilesTextureAtlas.getBounds(block.east);

        let eastGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        eastGeometry.faceVertexUvs[0][0] = [east[0], east[1], east[3]];
        eastGeometry.faceVertexUvs[0][1] = [east[1], east[2], east[3]];
        eastGeometry.rotateX(-(Math.PI / 2));
        eastGeometry.rotateY((Math.PI / 2));
        eastGeometry.translate(0, (blockHeight / 2), 0);

        geometries.push(eastGeometry);
    }

    if (block.top) {
        let top = _tilesTextureAtlas.getBounds(block.top);

        let topGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        topGeometry.faceVertexUvs[0][0] = [top[0], top[1], top[3]];
        topGeometry.faceVertexUvs[0][1] = [top[1], top[2], top[3]];
        topGeometry.translate(0, 0, (blockHeight / 2));

        geometries.push(topGeometry);
    }

    let blockGeometry = new THREE.Geometry();

    for (let geometry of geometries) {
        blockGeometry.merge(geometry);
    };

    return blockGeometry;
};

let _createBlock = function (block, blockWidth, blockHeight, blockDepth) {
    if (!block) {
        return null;
    }

    let geometry = _createBlockGeometry(block, blockWidth, blockHeight, blockDepth);

    let mesh = new THREE.Mesh(
        geometry,
        _tilesMaterial
    );

    return mesh;
};

class DemoView extends View {
    constructor (state) {
        super(800, 600);

        this.state = state;
        _tilesTextureAtlas = new TextureAtlas('tiles');
        _tilesMaterial = new THREE.MeshLambertMaterial({
            map: _tilesTextureAtlas.texture,
            transparent: true
        });
    }

    init () {
        let world = this.state.world;

        let worldWidth = world.width;
        let worldDepth = world.depth;

        let tileWidth = world.tileWidth;
        let tileHeight = world.tileHeight;
        let tileDepth = world.tileDepth;

        let worldHalfWidth = worldWidth / 2;
        let worldHalfDepth = worldDepth / 2;

        // FIXME
        this.camera.position.y = (world.height / 2) * tileHeight;
        this.camera.position.x = (world.width / 2) * tileWidth;
        this.camera.position.z = tileDepth * 6;

        debug('camera position', this.camera.position);
        debug('camera rotation', this.camera.rotation);

        // Rotate camera for top-down view.
        this.camera.rotation.z = (90) * Math.PI / 180;

        let layers = world.mapLayers;

        debug('layer', '\n' + world.map.toString());

        for (let z = 0; z < layers.length; z++) {
            let layer = layers[z];

            for (let y = 0; y < layer.length; y++) {
                for (let x = 0; x < layer[y].length; x++) {
                    let tile = layer[x][y];

                    if (tile !== null) {
                        let block = _createBlock(tile, tileWidth, tileHeight, tileDepth);

                        this.scene.add(block);

                        block.translateX(x * tileWidth);
                        block.translateY(y * tileHeight);
                        block.translateZ(z * tileDepth);

                        debug('block position', block.position);
                    }
                };
            }
        }

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        // let directionalLight = new THREE.DirectionalLight(0x00ffff, 2);
        //
        // directionalLight.position.set(world.width / 2, world.height / 2, world.depth).normalize();
        // this.scene.add(directionalLight);
    }

    update () {
        // this.mesh.rotation.x += 0.01;
    }
}

module.exports = DemoView;
