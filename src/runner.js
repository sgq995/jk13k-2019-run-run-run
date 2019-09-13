import { Sprite } from './sprite';
import { Timer } from './timer';
import { Rect } from './rect';

const MIN_RUNNER_WIDTH  = 80;
const MIN_RUNNER_HEIGHT = 128;

const DEFAULT_RUNNER_X      = 180; 
const DEFAULT_RUNNER_Y      = 360;
const DEFAULT_RUNNER_WIDTH  = 120;
const DEFAULT_RUNNER_HEIGHT = 256;

const DEFAULT_ANIM_TIME    = 200;
const DEFAULT_RUNNER_SPEED = 30;

export class Runner {
    constructor(clock, rect=Rect.from({x: DEFAULT_RUNNER_X, y: DEFAULT_RUNNER_Y, width: DEFAULT_RUNNER_WIDTH, height: DEFAULT_RUNNER_HEIGHT}), speed=DEFAULT_RUNNER_SPEED) {
        this.spriteRect = rect;

        this.staticSprite = new Sprite(Runner.buildRunnerImage(), this.spriteRect);
        this.leftMoveSprite = new Sprite(Runner.buildRunnerImage(), this.spriteRect);
        this.rightMoveSprite = new Sprite(Runner.buildRunnerImage(), this.spriteRect);
        this.sprite = this.staticSprite;

        this.speed = speed;

        // this.spriteRect.width = this.depth * (DEFAULT_RUNNER_WIDTH - MIN_RUNNER_WIDTH) / MAX_DEPTH + MIN_RUNNER_WIDTH;

        let dx = this.spriteRect.width / 4;
        let dy = this.spriteRect.height / 4;
        this.collisionRect = new Rect(
            this.spriteRect.left + dx,
            this.spriteRect.top + dy,
            this.spriteRect.right - dx,
            this.spriteRect.bottom - dy);
        
        this.animTimer = new Timer(clock, DEFAULT_ANIM_TIME * DEFAULT_RUNNER_SPEED / speed);
        this.animSpeed = -speed;

        console.log(this);
    }

    static buildRunnerImage(color='#0f0') {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 256;

        const context = canvas.getContext('2d');
        context.fillStyle = color;

        // Head
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 8, canvas.height / 8, 0, 2 * Math.PI);
        context.fill();

        // Trunk
        context.beginPath();
        context.moveTo(canvas.width / 2, canvas.height / 4);
        context.lineTo(canvas.width / 8, canvas.height / 4);
        context.arcTo(0, canvas.height / 4, 0, canvas.height / 4 + canvas.height / 8, canvas.height / 8);
        context.lineTo(0, 3 * canvas.height / 5);
        context.lineTo(canvas.width, 3 * canvas.height / 5);
        context.lineTo(canvas.width, canvas.height / 4 + canvas.height / 8);
        context.arcTo(canvas.width, canvas.height / 4, canvas.width - canvas.width / 8, canvas.height / 4, canvas.height / 8);
        context.closePath();
        context.fill();

        // Legs
        context.beginPath();
        context.moveTo(canvas.width / 4, canvas.height / 2);
        context.lineTo(canvas.width / 4, canvas.height);
        context.lineTo(3 * canvas.width / 4, canvas.height);
        context.lineTo(3 * canvas.width / 4, canvas.height / 2);
        context.closePath();
        context.fill();

        return canvas;
    }

    get x() {
        return this.spriteRect.x;
    }

    set x(value) {
        this.spriteRect.x = value;
        
        let dx = this.spriteRect.width / 4;
        this.collisionRect.left = this.spriteRect.left + dx;
        this.collisionRect.right = this.spriteRect.right - dx;
    }

    get y() {
        return this.spriteRect.y;
    }

    set y(value) {
        this.spriteRect.y = value;
                
        let dy = this.spriteRect.height / 4;
        this.collisionRect.top = this.spriteRect.top + dy;
        this.collisionRect.bottom = this.spriteRect.bottom + dy;
    }

    get width() {
        return this.spriteRect.width;
    }

    set width(value) {
        this.spriteRect.width = value;

        let dx = this.spriteRect.width / 4;
        this.collisionRect.left = this.spriteRect.left + dx;
        this.collisionRect.right = this.spriteRect.right - dx;
    }

    get height() {
        return this.spriteRect.height;
    }

    set height(value) {
        this.spriteRect.height = value;

        let dy = this.spriteRect.height / 4;
        this.collisionRect.top = this.spriteRect.top + dy;
        this.collisionRect.bottom = this.spriteRect.bottom - dy;
    } 

    collides(other) {
        return this.collisionRect.collides(other.collisionRect);
    }

    update(deltaTime) {
        this.animTimer.update();

        if (this.animTimer.timeout()) {
            this.animTimer.tick();
            this.animSpeed *= -1;
        }

        //this.image.context.fillRect();
        // this.rect.y += deltaTime * this.animSpeed;
    }

    draw(context) {
        this.sprite.draw(context);
        
        context.strokeRect(
            this.collisionRect.x, 
            this.collisionRect.y,
            this.collisionRect.width,
            this.collisionRect.height);
    }
}

export class AutonomousRunner extends Runner {
    constructor(targetSpeed, ...args) {
        super(...args);

        this.color = '#00f';
        this.targetSpeed = targetSpeed;
    }

    set color(value) {
        this.staticSprite.image = Runner.buildRunnerImage(value);
        this.leftMoveSprite.image = Runner.buildRunnerImage(value);
        this.rightMoveSprite.image = Runner.buildRunnerImage(value);
    }
    
    update(deltaTime) {
        super.update(deltaTime);

        let speed = this.targetSpeed - this.speed;
        let deltaY = deltaTime * speed;
        
        this.y += deltaY;
        
        let newHeight = this.y / DEFAULT_RUNNER_Y * DEFAULT_RUNNER_HEIGHT;
        this.height = newHeight;
        
        const threshold = DEFAULT_RUNNER_X + DEFAULT_RUNNER_WIDTH / 2;

        let newWidth = this.y / DEFAULT_RUNNER_Y * DEFAULT_RUNNER_WIDTH;
        if (this.x > threshold) {
            this.width = newWidth;    
        } else if (this.x < threshold) {
            this.x += this.width - newWidth;
            this.width = newWidth;
        }
    }
}
