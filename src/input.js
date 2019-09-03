const Keyboard = {
    VK_UP: false,
    VK_RIGHT: false,
    VK_DOWN: false,
    VK_LEFT: false,
};
const handler = (e, v) => {
    switch (e.keyCode) {
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
    constructor(sprite) {
        this.target = sprite;
    }

    handle(delta) {
        if (Keyboard.VK_LEFT) {
            this.target.x -= delta * 160;
        }
        if (Keyboard.VK_RIGHT) {
            this.target.x += delta * 160;
        }
    }
}
