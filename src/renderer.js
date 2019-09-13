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
        if (this.isVisible(sprite)) {
            sprite.draw(this.context);
            return true;
        } else {
            return false;
        }
    }

    drawRunner(runner) {
        if (this.isVisible(runner.sprite)) {
            runner.draw(this.context);
            return true;
        } else {
            return false;
        }
    }

    drawPaused() {
        this.context.font = '60px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText('PAUSED', this.rect.width / 2, this.rect.height / 2);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const platformLimit = this.rect.height / 8;
        const platformWidth = this.rect.width / 2 * Math.cos(Math.PI / 3);

        this.context.beginPath();
        this.context.moveTo(0, platformLimit);
        this.context.lineTo(this.rect.width, platformLimit);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(0, this.rect.height / 2);
        this.context.lineTo(platformWidth, platformLimit);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(this.rect.width, this.rect.height / 2);
        this.context.lineTo(this.rect.width - platformWidth, platformLimit);
        this.context.stroke();
    }
}
