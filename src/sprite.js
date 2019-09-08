import { Rect } from "./rect";

export class Sprite {
    constructor(image=null, rect=Rect()) {
        this.image = image;
        this.imageRect = rect;
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
            this.imageRect.x, this.imageRect.y, this.imageRect.width, this.imageRect.height);
    }
}
