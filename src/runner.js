import { Sprite } from './sprite';
import { Timer } from './timer';
import { Rect } from './rect';

const MIN_RUNNER_WIDTH  = 80;
const MIN_RUNNER_HEIGHT = 128;

const DEFAULT_RUNNER_X      = 180; 
const DEFAULT_RUNNER_Y      = 360;
const DEFAULT_RUNNER_WIDTH  = 120;
const DEFAULT_RUNNER_HEIGHT = 256;

const MAX_DEPTH = 100;

const DEFAULT_DEPTH        = 0;
const DEFAULT_ANIM_TIME    = 200;
const DEFAULT_RUNNER_SPEED = 30;

export class Runner extends Sprite {
    constructor(clock, rect=new Rect(DEFAULT_RUNNER_X, DEFAULT_RUNNER_Y, DEFAULT_RUNNER_X+DEFAULT_RUNNER_WIDTH, DEFAULT_RUNNER_Y+DEFAULT_RUNNER_HEIGHT), speed=DEFAULT_RUNNER_SPEED, depth=DEFAULT_DEPTH) {
        super(Runner.buildRunnerImage(), rect);

        this.speed = speed;
        this.depth = Math.min(depth, MAX_DEPTH);

        // this.imageRect.width = this.depth * (DEFAULT_RUNNER_WIDTH - MIN_RUNNER_WIDTH) / MAX_DEPTH + MIN_RUNNER_WIDTH;

        let dx = 0.1 * this.imageRect.width;
        let dy = this.imageRect.height / 4;
        this.collisionRect = new Rect(
            this.imageRect.left + dx, 
            this.imageRect.top + dy,
            this.imageRect.right - dx,
            this.imageRect.bottom - dy);
        
        this.animTimer = new Timer(clock, DEFAULT_ANIM_TIME * DEFAULT_RUNNER_SPEED / speed);
        this.animSpeed = -speed;
    }

    static buildRunnerImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        context.fillStyle = '#0f0';
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }

    get x() {
        return this.imageRect.x;
    }

    set x(value) {
        this.imageRect.x = value;

        // this.collisionRect.x = this.imageRect.x + 0.1 * this.imageRect.width;
        // this.collisionRect.width = 0.8 * this.imageRect.width;
        
        let dx = 0.1 * this.imageRect.width;
        this.collisionRect.left = this.imageRect.left + dx;
        this.collisionRect.right = this.imageRect.right - dx;
    }

    get y() {
        return this.imageRect.y;
    }

    set y(value) {
        this.imageRect.y = value;
        
        // this.collisionRect.y = value + this.imageRect.height / 2;
        
        let dy = this.imageRect.height / 4;
        this.collisionRect.top = this.imageRect.top + dy;
        this.collisionRect.bottom = this.imageRect.bottom + dy;
    }

    get width() {
        return this.imageRect.width;
    }

    set width(value) {
        this.imageRect.width = value;

        // this.collisionRect.x = this.imageRect.x + 0.1 * this.imageRect.width;
        // this.collisionRect.width = 0.8 * this.imageRect.width;
        let dx = 0.1 * this.imageRect.width;
        this.collisionRect.left = this.imageRect.left + dx;
        this.collisionRect.right = this.imageRect.right - dx;
    }

    get height() {
        return this.imageRect.height;
    }

    set height(value) {
        this.imageRect.height = value;

        // this.collisionRect.bottom = this.imageRect.bottom;
        let dy = this.imageRect.height / 4;
        this.collisionRect.top = this.imageRect.top + dy;
        this.collisionRect.bottom = this.imageRect.bottom - dy;
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
        super.draw(context);

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

        this.targetSpeed = targetSpeed;
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
