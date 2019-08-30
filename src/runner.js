import { Sprite } from './sprite';

export default class Runner extends Sprite {
    constructor() {
        super();

        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;

        const image = canvas.getContext('2d');
        image.fillStyle = '#00f';
        image.fillRect(0, 0, 32, 32);

        this.sprite = new Sprite(image, 64, 128);
    }
}
