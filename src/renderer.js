import { Rect } from "./rect";

export class Renderer {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.rect = Rect.from({ width: this.canvas.width, height: this.canvas.height });
    
        this.canvas.addEventListener('resize', e => {
            this.rect.width = this.canvas.width;
            this.rect.height = this.canvas.height;
        });
    }

    isVisible(sprite) {
        return this.rect.collides(sprite.imageRect);
    }

    drawScore(score) {
        this.context.font = '30px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText(`${score}`, this.rect.width / 2, 30);
    }

    drawSprite(sprite) {
        if (this.isVisible(sprite))
        {
            sprite.draw(this.context);
            return true;
        }
        else
        {
            return false;
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
