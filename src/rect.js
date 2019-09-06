export class Rect {
    constructor(left=0, top=0, right=0, bottom=0) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    static from({ x=0, y=0, width=0, height=0 }) {
        return new Rect(x, y, x + width, y + height);
    }

    get x() {
        return this.left;
    }

    set x(value) {
        this.right = value + this.width;
        this.left = value;
    }

    get y() {
        return this.top;
    }

    set y(value) {
        this.bottom = value + this.height;
        this.top = value;
    }

    get width() {
        return this.right - this.left;
    }

    set width(value) {
        this.right = this.left + value;
    }

    get height() {
        return this.bottom - this.top;
    }

    set height(value) {
        this.bottom = this.top + value;
    }

    collides(other) {
        let deltaWidth = 0;
        if (this.left < other.left) {
            deltaWidth = other.right - this.left;
        } else {
            deltaWidth = this.right - other.left;
        }

        let deltaHeight = 0;
        if (this.top < other.top) {
            deltaHeight = other.bottom - this.top;
        } else {
            deltaHeight = this.bottom - other.top;
        }

        return ((this.width + other.width) >= (deltaWidth))
            && ((this.height + other.height) >= (deltaHeight));
    }
}
