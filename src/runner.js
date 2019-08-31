import { Sprite } from './sprite';

export class Runner extends Sprite {
    constructor() {
        super();

        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 32;

        const image = canvas.getContext('2d');
        image.fillStyle = '#00f';
        image.fillRect(0, 0, canvas.width, canvas.height / 2);
        image.fillStyle = '#0f0';
        image.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        this.image = canvas;

        this.x = 160;
        this.y = 384;

        this.width = 160;
        this.height = 256;
    }

    update(delta) {
        console.log(delta);
    }
}
