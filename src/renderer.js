export class Renderer {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
