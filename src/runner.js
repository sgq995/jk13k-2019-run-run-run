import { Sprite } from './sprite';
import { Timer } from './timer';
import { Rect } from './rect';

const MIN_RUNNER_WIDTH  = 80;
const MIN_RUNNER_HEIGHT = 128;

const DEFAULT_RUNNER_X      = 180; 
const DEFAULT_RUNNER_Y      = 360;
const DEFAULT_RUNNER_WIDTH  = 120;
const DEFAULT_RUNNER_HEIGHT = 256;

const DEFAULT_ANIM_TIME    = 150;
const DEFAULT_RUNNER_SPEED = 30;

const RUNNER_STATIC_STATE = 0;
const RUNNER_LEFT_MOVE_STATE = 1;
const RUNNER_RIGHT_MOVE_STATE = 2;

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

export class Runner {
    constructor(clock, rect=Rect.from({x: DEFAULT_RUNNER_X, y: DEFAULT_RUNNER_Y, width: DEFAULT_RUNNER_WIDTH, height: DEFAULT_RUNNER_HEIGHT}), speed=DEFAULT_RUNNER_SPEED) {
        this.spriteRect = rect;

        this.staticSprite = new Sprite(Runner.buildRunnerImage('#0f0', RUNNER_STATIC_STATE), this.spriteRect);
        this.leftMoveSprite = new Sprite(Runner.buildRunnerImage('#0f0', RUNNER_LEFT_MOVE_STATE), this.spriteRect);
        this.rightMoveSprite = new Sprite(Runner.buildRunnerImage('#0f0', RUNNER_RIGHT_MOVE_STATE), this.spriteRect);
        this.sprite = this.staticSprite;

        this.speed = speed;

        let dx = this.spriteRect.width / 4;
        let dy = this.spriteRect.height / 4;
        this.collisionRect = new Rect(
            this.spriteRect.left + dx,
            this.spriteRect.top + dy,
            this.spriteRect.right - dx,
            this.spriteRect.bottom - dy);
        
        this.animTimer = new Timer(clock, DEFAULT_ANIM_TIME * DEFAULT_RUNNER_SPEED / speed);
        this.anim = [RUNNER_STATIC_STATE, RUNNER_LEFT_MOVE_STATE, RUNNER_STATIC_STATE, RUNNER_RIGHT_MOVE_STATE];
        this.animIdx = 0;
    }

    static buildHead(context, width, height) {
        context.beginPath();
        context.arc(width / 2, height / 8, height / 8, 0, 2 * Math.PI);
        context.fill();
    }

    static buildTrunkAndArms(context, width, height, state=RUNNER_STATIC_STATE) {
        context.beginPath();
        context.moveTo(width / 2, height / 4);
        context.lineTo(width / 8, height / 4);
        context.arcTo(0, height / 4, 0, height / 4 + height / 8, height / 8);
        
        if (state === RUNNER_LEFT_MOVE_STATE) {
            context.lineTo(0, height / 2);
            context.lineTo(width / 4, height / 2);
            context.lineTo(width / 4, 3 * height / 5);
        } else {
            context.lineTo(0, 3 * height / 5);
        }
        
        if (state === RUNNER_RIGHT_MOVE_STATE) {
            context.lineTo(3 * width / 4, 3 * height / 5);
            context.lineTo(3 * width / 4, height / 2);
            context.lineTo(width, height / 2);
        } else {
            context.lineTo(width, 3 * height / 5);
            context.lineTo(width, height / 4 + height / 8);
        }
        
        context.arcTo(width, height / 4, width - width / 8, height / 4, height / 8);
        context.closePath();
        context.fill();
    }

    static buildLegs(context, width, height, state=RUNNER_STATIC_STATE) {
        context.beginPath();
        context.moveTo(width / 4, height / 2);

        if (state === RUNNER_RIGHT_MOVE_STATE) {
            context.lineTo(width / 4, 3 * height / 4);
            context.lineTo(width / 2, 3 * height / 4);
            context.lineTo(width / 2, height);
        } else {
            context.lineTo(width / 4, height);
        }
        
        if (state === RUNNER_LEFT_MOVE_STATE) {
            context.lineTo(width / 2, height);
            context.lineTo(width / 2, 3 * height / 4);
            context.lineTo(3 * width / 4, 3 * height / 4);
        } else {
            context.lineTo(3 * width / 4, height);
        }

        context.lineTo(3 * width / 4, height / 2);

        context.closePath();
        context.fill();
    }

    static buildRunnerImage(color='#0f0', state=RUNNER_STATIC_STATE) {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 256;

        const context = canvas.getContext('2d');
        context.fillStyle = color;

        Runner.buildHead(context, canvas.width, canvas.height, state);
        Runner.buildTrunkAndArms(context, canvas.width, canvas.height, state);
        Runner.buildLegs(context, canvas.width, canvas.height, state);

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
            
            this.animIdx = (this.animIdx + 1) % this.anim.length;
            if (this.anim[this.animIdx] === RUNNER_STATIC_STATE) {
                this.sprite = this.staticSprite;
            } else if (this.anim[this.animIdx] === RUNNER_LEFT_MOVE_STATE) {
                this.sprite = this.leftMoveSprite;
            } else if (this.anim[this.animIdx] === RUNNER_RIGHT_MOVE_STATE) {
                this.sprite = this.rightMoveSprite;
            }
        }
    }

    draw(context) {
        this.sprite.draw(context);
        
        /*context.strokeRect(
            this.collisionRect.x, 
            this.collisionRect.y,
            this.collisionRect.width,
            this.collisionRect.height);*/
    }
}

export class AutonomousRunner extends Runner {
    constructor(targetSpeed, ...args) {
        super(...args);

        this.color = '#00f';
        this.targetSpeed = targetSpeed;

        this.isCollided = false;
        this.collisionFactor = 0.0;
    }

    set color(value) {
        this.staticSprite.image = Runner.buildRunnerImage(value, RUNNER_STATIC_STATE);
        this.leftMoveSprite.image = Runner.buildRunnerImage(value, RUNNER_LEFT_MOVE_STATE);
        this.rightMoveSprite.image = Runner.buildRunnerImage(value, RUNNER_RIGHT_MOVE_STATE);
    }
    
    updateColor() {
        let r = clamp(Math.round(this.collisionFactor * 255), 0, 255);
        let b = clamp(Math.round((1.0 - this.collisionFactor) * 255), 0, 255);

        r = r.toString(16);
        r = r.length < 2 ? '0' + r : r;

        b = b.toString(16);
        b = b.length < 2 ? '0' + b : b;

        this.color = `#${r}00${b}`;
    }

    update(deltaTime) {
        super.update(deltaTime);

        let speed = this.targetSpeed - this.speed;
        
        let collisionFactorDelta = deltaTime * speed / this.targetSpeed;
        if (this.isCollided && this.collisionFactor < 1.0) {
            this.collisionFactor = Math.min(this.collisionFactor + collisionFactorDelta, 1.0);
            this.updateColor();
        } else if (this.collisionFactor > 0.0) {
            this.collisionFactor = Math.max(this.collisionFactor - collisionFactorDelta, 0.0);
            this.updateColor();
        }

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
        } else {
            this.x -= Math.abs(this.width - newWidth) / 2;
            this.width = newWidth;
        }
    }
}
