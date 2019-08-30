import { Renderer } from './renderer';
import { Runner } from './runner';

export default class App {
    constructor() {
        this.renderer = new Renderer('game-render');
        this.entities = [];
    }

    start() {
        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        this.renderer.clear();

        this.entities.forEach(sprite => {
            sprite.draw(this.renderer.context);
        });
    }
}
