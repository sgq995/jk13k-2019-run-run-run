export class Timer {
    constructor(clock, target=0) {
        this.clock = clock;
        
        this.startTick = this.clock.getTicks();
        this.currentTick = 0;
        this.previousTick = 0;

        this.targetTicks = target;
    }
    
    setTimeout(timeout) {
        this.targetTicks = timeout;
    }

    reset() {
        this.startTick = this.clock.getTicks();
        this.currentTick = this.startTick;
        this.previousTick = this.startTick;
    }

    update() {
        this.currentTick = this.clock.getTicks();
    }

    tick() {
        this.previousTick = this.currentTick;
        this.currentTick = this.clock.getTicks();
    }

    delta() {
        return this.currentTick - this.previousTick;
    }

    deltaStart() {
        return this.currentTick - this.startTick;
    }

    timeout() {
        return this.delta() > this.targetTicks;
    }
}
