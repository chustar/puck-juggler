function main() {
    var c = new click_recorder();
    c.start();
}

function click_recorder() {
    this.pattern = [];

    this.globalStopId = 0;

    this.pressWatchId = 0;
    this.clickLengthId = 0;
    this.playbackId = 0;

    this.start = function() {
        this.globalStopId = setTimeout(this.stop.bind(this), 10000);
        this.pressWatchId = setWatch(this.click.bind(this), BTN, {edge: 'rising', debounce: 50, repeat: true});
    };

    this.stop = function() {
        clearTimeout(this.clickLengthId);
        this.clickLengthId = 0;

        clearWatch(this.pressWatchId);
        this.pressWatchId = 0;

        clearTimeout(this.globalStopId);
        this.globalStopId = 0;

        this.playback();
    };

    this.click = function(args) {
        this.pattern.push(args.time - args.lastTime);
        
        if (this.clearTimeout !== 0)
        {
            clearTimeout(this.clickLengthId);
        }
        this.clickLengthId = setTimeout(this.stop.bind(this), 3500);
    };

    this.playback = function() {
        for (var i = 0; i < this.pattern.length; i++) {
            digitalPulse(LED2, 1, this.pattern);
        }
    };
}

main();
