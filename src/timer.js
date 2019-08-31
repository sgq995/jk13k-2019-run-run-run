export class Timer {
    constructor(target=0) {
        this.startTick = 0;
        this.currentTick = 0;
        this.previousTick = 0;

        this.deltaTickTarget = target;
    }
    
    reset() {
        this.startTick = Date.now();
        this.currentTick = this.startTick;
        this.previousTick = this.startTick;
    }

    tick() {
        this.previousTick = this.currentTick;
        this.currentTick = Date.now();
    }

    delta() {
        return this.currentTick - this.previousTick;
    }

    deltaStart() {
        return this.currentTick - this.startTick;
    }

    timeout() {
        return this.delta() > this.deltaTickTarget;
    }
}
