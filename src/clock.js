export class Clock {
    constructor(rate=1, timestamp) {        
        this.startTime = Clock.filterTimestamp(timestamp);
        this.currentTime = this.startTime;
        this.previousTime = this.startTime;
        this.deltaTime = 0;

        this.tickRate = rate;
        this.tickCount = 0;
    }

    static isValidTimestamp(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }
    
    static isPreciseTimestamp() {
        return (performance && performance.now) ? true : false;
    }
    
    static timestampNow() {
        return Clock.isPreciseTimestamp() ? performance.now() : Date.now();
    }

    static filterTimestamp(timestamp) {
        if (Clock.isValidTimestamp(timestamp)) {
            return Clock.isPreciseTimestamp() ? Clock.timestampNow() : timestamp;
        } else {
            return Clock.timestampNow();
        }
    }
    
    reset(timestamp) {
        this.startTime = Clock.filterTimestamp(timestamp);
        this.currentTime = this.startTime;
        this.previousTime = this.startTime;
        this.deltaTime = 0;
    }

    resetTicks() {
        this.tickCount = 0;
    }

    update(timestamp) {
        this.currentTime = Clock.filterTimestamp(timestamp);
        this.deltaTime += Math.max(this.currentTime - this.previousTime, 0);
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