let debug = require('debug')('game:game/ui/AmmoView');

import View from '../../engine/views/View';
import TextureManager from '../../engine/graphics/TextureManager';
import TextView from '../../engine/views/TextView';

class AmmoView extends View {
    constructor () {
        super();
    }

    init () {
        this.mesh = new THREE.Object3D();

        let textureAtlas = TextureManager.getAtlas('ui', false);

        let material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        let ammoSize = textureAtlas.getFrameSize('ammo');
        let bounds = textureAtlas.getBounds('ammo');

        this.geometry = new THREE.PlaneGeometry(ammoSize.width, ammoSize.height);

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        let ammoMesh = new THREE.Mesh(this.geometry, material);

        ammoMesh.scale.set(0.5, 0.5, 1);

        this.magazineText = new TextView('0', {
            color: 0xD2ff33
        });

        this.magazineText.init();

        this.magazineText.mesh.scale.set(2, 2, 1);

        this.magazineText.position = {
            x: ammoSize.width + 10,
            y: -this.magazineText.height
        };

        this.mesh.add(this.magazineText.mesh);

        this.ammoText = new TextView('0', {
            color: 0xD2ff33
        });

        this.ammoText.init();

        this.ammoText.mesh.scale.set(1, 1, 1);

        this.ammoText.position = {
            x: ammoSize.width + 64,
            y: -this.ammoText.height
        };

        this.mesh.add(this.ammoText.mesh);
        this.mesh.add(ammoMesh);

        this._initialized = true;
    }

    set ammo (ammo) {
        if (ammo === null) {
            this.ammoText.text = '-';
        }
        this.ammoText.text = ammo;
    }

    set magazine (magazine) {
        if (magazine === null) {
            this.magazineText.text = '-';
        }
        this.magazineText.text = magazine;
    }

    update (delta) {
        super.update(delta);
    }
}

export default AmmoView;
