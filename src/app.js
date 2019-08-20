import Renderer from './renderer.js'

class App {
    constructor() {
        this.renderer = new Renderer('game-render');
    }

    start() {
        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        this.renderer.clear();
        this.renderer.draw();
    }
}

export default App;
