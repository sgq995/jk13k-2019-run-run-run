import { Rect } from "./rect";

export class Sprite {
    constructor(image=null, rect=Rect()) {
        this.image = image;
        this.rect = rect;
    }

    /*static async loadFrom(path) {
        let image = new Image();
        return new Promise((resolve, reject) => {
            image.onload(() => {
                resolve(path); 
            });
            image.onerror(() => {
                reject(path);
            });
            image.src = path;
        });
    }*/

    draw(context) {
        context.drawImage(this.image, 
            this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}
