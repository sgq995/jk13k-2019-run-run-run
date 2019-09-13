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
        this.context.fillStyle = '#333';
        this.context.fillText(`${score}`, this.rect.width / 2, 30);
    }

    drawLifeBar(life) {
        this.context.fillStyle = '#0ff';
        this.context.fillRect(30, 15, life, 15);
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
    
    drawInit() {
        this.context.font = '20px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillStyle = '#333';
        this.context.fillText('Use Left/Right arrows or A/D keys to move', this.rect.width / 2, this.rect.height / 2 - 80);
        this.context.fillText('Use Esc/P keys to pause', this.rect.width / 2, this.rect.height / 2 - 40);
        this.context.fillText('Press Enter and run~', this.rect.width / 2, this.rect.height / 2 + 10);
    }

    drawPaused() {
        this.context.font = '60px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillStyle = '#ddd';
        this.context.fillRect(0, this.rect.height / 2 - 35, this.rect.width / 4, 70);
        this.context.fillRect(3 * this.rect.width / 4, this.rect.height / 2 - 35, this.rect.width / 4, 70);
        this.context.fillStyle = '#eee';
        this.context.fillRect(this.rect.width / 5, this.rect.height / 2 - 50, 3 * this.rect.width / 5, 70);        
        this.context.fillStyle = '#333';
        this.context.fillText('PAUSED', this.rect.width / 2, this.rect.height / 2);
    }

    drawLose() {
        this.context.font = '20px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillStyle = '#333';
        this.context.fillText('Press enter and run again~', this.rect.width / 2, this.rect.height / 2);
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
