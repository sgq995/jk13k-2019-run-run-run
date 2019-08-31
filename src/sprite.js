export class Sprite {
    constructor(image=null, x=0, y=0, width=0, height=0) {
        this.image = image;
        this.x = x;
        this.y = y;
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

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
