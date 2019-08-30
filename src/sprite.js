export class Sprite {
    constructor(image, width=0, height=0) {
        this.image = image;
        this.width = width;
        this.height = height;
    }

    static async loadFrom(path) {
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
    }

    get image() {
        return this.image;
    }

    get width() {
        return this.width;
    }

    get height() {
        return this.height;
    }
}
