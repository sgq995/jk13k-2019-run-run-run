export class Clock {
    constructor(rate) {
        this.startTime = Date.now();
        this.currentTime = this.startTime;
        this.previousTime = this.startTime;
        this.deltaTime = 0;

        this.tickRate = rate;
        this.tickCount = 0;
    }

    update() {
        this.currentTime = Date.now();
        this.deltaTime += this.currentTime - this.previousTime;
        this.previousTime = this.currentTime;

        if (this.deltaTime >= this.tickRate) {
            let increment = parseInt(this.deltaTime / this.tickRate);
            this.tickCount += increment;
            this.deltaTime -= increment * this.tickRate;
        }
    }

    getTicks() {
        return this.tickCount;
    }

    ticksToMilliseconds(ticks) {
        return ticks * this.tickRate;
    }

    ticksToSeconds(ticks) {
        return this.ticksToMilliseconds(ticks) / 1000;
    }
}