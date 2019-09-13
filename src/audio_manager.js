import { CPlayer } from "./player-small";
import { songRunning } from "./song_running";
import { songCrash } from "./song_crash";

export class AudioManager {
    constructor() {
        const runningPlayer = new CPlayer();
        runningPlayer.init(songRunning);
        this.runningSong = document.createElement('audio');
        
        const runningSongId = setInterval(() => {
            const done = runningPlayer.generate() >= 1;
            if (done) {
                clearInterval(runningSongId);
                const wave = runningPlayer.createWave();
                const src = URL.createObjectURL(new Blob([wave], {type: 'audio/wav'}));
                this.runningSong.loop = true;
                this.runningSong.src = src;
            }
        }, 0);

        const crashPlayer = new CPlayer();
        crashPlayer.init(songCrash);
        this.crashSong = document.createElement('audio');

        const crashSongId = setInterval(() => {
            const done = crashPlayer.generate() >= 1;
            if (done) {
                clearInterval(crashSongId);
                const wave = crashPlayer.createWave();
                const src = URL.createObjectURL(new Blob([wave], {type: 'audio/wav'}));
                this.crashSong.src = src;
            }
        }, 0);
    }

    playRunningSong() {
        this.runningSong.play();
    }

    pauseRunningSong() {
        this.runningSong.pause();
    }

    resetRunningSong() {
        this.runningSong.pause();
        this.runningSong.currentTime = 0;
        this.runningSong.play();
    }

    playCrashSong() {
        this.crashSong.play();
    }
}
