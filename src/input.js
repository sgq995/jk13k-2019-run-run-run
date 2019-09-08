import { Rect } from "./rect";

const Keyboard = {
    VK_PAUSE: false,

    VK_UP: false,
    VK_RIGHT: false,
    VK_DOWN: false,
    VK_LEFT: false,
};
const handler = (e, v) => {
    switch (e.keyCode) {
        case 27:
        case 80:
            Keyboard.VK_PAUSE = v;
            break;

        case 38:
        case 90:
        case 87:
            Keyboard.VK_UP = v;
            break;
        
        case 39:
        case 68:
            Keyboard.VK_RIGHT = v;
            break;

        case 40:
        case 83:
            Keyboard.VK_DOWN = v;
            break;

        case 37:
        case 65:
        case 81:
            Keyboard.VK_LEFT = v;
            break;

        default: break;
    }  
};
document.addEventListener('keydown', (e) => { handler(e, true); });
document.addEventListener('keyup', (e) => { handler(e, false); });

export class Input {
    constructor() {
        this.delta = new Rect();

        this.pausePressed = false;
        this.pauseKeyCurrentState = Keyboard.VK_PAUSE;
        this.pauseKeyPreviousState = this.pauseKeyCurrentState;
    }

    get isPausePressed() {
        let pausePressed = this.pausePressed;
        this.pausePressed = false;
        return pausePressed;
    }

    handle(delta) {
        this.pauseKeyCurrentState = Keyboard.VK_PAUSE;
        if (this.pauseKeyCurrentState === false && this.pauseKeyPreviousState === true) {
            this.pausePressed = true;
        }
        this.pauseKeyPreviousState = this.pauseKeyCurrentState;
        
        if (Keyboard.VK_LEFT) {
            this.delta.x = -delta * 160;
        } else if (Keyboard.VK_RIGHT) {
            this.delta.x = delta * 160;
        } else {
            this.delta.x = 0;
        }
    }
}
