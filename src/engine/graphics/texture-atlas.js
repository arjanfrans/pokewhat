'use strict';

const ATLAS_DIRECTORY = '../../assets/spritesheets/';

let _atlasJson = new Map();

// FIXME Browserify can not do dynamic loading
_atlasJson.set('dude', require('../../../assets/spritesheets/dude.js'));
_atlasJson.set('tiles', require('../../../assets/spritesheets/tiles.js'));

let textureLoader = new THREE.TextureLoader();

class TextureAtlas {
    constructor (name) {
        this.mapping = _atlasJson.get(name);

        this.texture = textureLoader.load(ATLAS_DIRECTORY + this.mapping.meta.image);
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.LinearMipMapLinearFilter;
        this.width = this.mapping.meta.size.w;
        this.height = this.mapping.meta.size.h;

        this.frames = new Map();

        for (let frame of this.mapping.frames) {
            let d = frame.frame;

            // Origin image is y-inverted compared to what THREE wants
            let bounds = [
                new THREE.Vector2(d.x / this.width, (this.height - (d.y)) / this.height), // lower left
                new THREE.Vector2((d.x + d.w) / this.width, (this.height - (d.y)) / this.height), // lower right
                new THREE.Vector2((d.x + d.w) / this.width, (this.height - (d.y + d.h)) / this.height), // upper right
                new THREE.Vector2(d.x / this.width, (this.height - (d.y + d.h)) / this.height) // upper left
            ];

            this.frames.set(frame.filename, {
                bounds: bounds,
                frame: frame,
                framePosition: {
                    x: d.x,
                    y: this.height - d.y
                },
                frameSize: {
                    width: d.w,
                    height: d.h
                }
            });
        }
    }

    getFrameOffset (name) {
        let d = this.frames.get(name + '.png').framePosition;
        let size = this.frames.get(name + '.png').frameSize;

        return new THREE.Vector2(d.x / this.width, (this.height - (d.y) - size.height) / this.height);
    }

    getFrameSize (name) {
        return this.frames.get(name + '.png').frameSize;
    }

    getBounds (name) {
        return this.frames.get(name + '.png').bounds;
    }
}

module.exports = TextureAtlas;
