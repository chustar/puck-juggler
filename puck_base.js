var RESET = 20;
var LIGHT = 21;
var JUGGLE = 22;

var RED = 30;
var GREEN = 31;
var BLUE = 32;

var MAX_TIMEOUT = 25000;
var LIGHT_TIMEOUT = 500;

// Puck JS class.
function puck_firmware() {
    this.state = RESET;

    this.led = {};
    this.led[RED] = LED1;
    this.led[GREEN] = LED2;
    this.led[BLUE] = LED3;

    this.ledLit = {};
    this.ledLit[RED] = false;
    this.ledLit[GREEN] = false;
    this.ledLit[BLUE] = false;

    // When clicked, navigate through the functions.
    this.click = function (args) {
        this.reset();
        this.state = this.state == JUGGLE ? RESET : this.state + 1;

        switch (this.state) {
            case RESET:
                console.log("State from: " + this.state + " to: RESET");
                this.reset();
                break;

            case LIGHT:
                console.log("State from: " + this.state + " to: LIGHT");
                this.light();
                break;

            case JUGGLE:
                console.log("State from: " + this.state + " to: JUGGLE");
                this.juggle();
                break;

            default:
                console.log("State from: " + this.state + " to: WAIT, WHAT...?");
                reset();
                break;
        }
    };

    // Begin broadcasting IR reading every LIGHT_TIMEOUT.
    this.light = function () {
        this.lightIntervalId = setInterval(this.onLight.bind(this), LIGHT_TIMEOUT);
        this.updateBattery();
    };

    // On each interval update, updfate the service value.
    this.onLight = function () {
        var light = Puck.light();
        if (!this.lightZero) { this.lightZero = light; }
        if (!this.lightStartTime) { this.lightStartTime = getTime(); }

        NRF.updateServices({
            0xC900: {
                0xC91A: this.lightZero,
                0xC91B: light
            }
        });

        console.log('light: ' + light);
        maxTimeoutExceededCheck(this.lightIntervalId, this.lightStartTime);
    };

    // Begin juggling routine, auto turn-off after MAX_TIMEOUT.
    this.juggle = function () {
        Puck.on('mag', this.onMag.bind(this));
        Puck.magOn(2.5);

        setTimeout(this.reset.bind(this), MAX_TIMEOUT);
        this.updateBattery();
    };

    // On each position update, update services.
    this.onMag = function (pos) {
        if (!this.magZero) { this.magZero = pos; }
        if (!this.magStartTime) { this.magStartTime = getTime(); }

        NRF.updateServices({
            0xC900: {
                0xC92A: [this.magZero.x, this.magZero.y, this.magZero.z],
                0xC92B: [pos.x, pos.y, pos.z]
            }
        });

        console.log('x: ' + pos.x + ', y: ' + pos.y + ', z: ' + pos.z);
        maxTimeoutExceededCheck(this.lightStartTime, this.magStartTime);
    };

    // Updates current battery value when called.
    this.updateBattery = function () {
        NRF.updateServices({
            0xC900: {
                0xC93A: NRF.getBattery(),
            }
        });

        console.log('batt: ' + NRF.getBattery());
    };

    // Turns off the mag sensor and clears timeout values.
    // TODO: Consider just calling the Puck.reset() function.
    this.reset = function () {
        Puck.magOff();
        clearTimeout();
        clearInterval();

        // turn off LEDs.
        digitalWrite([LED1, LED2, LED3], 0b000);
    };

    // Blinks the LEDs for duration seconds.
    this.blinkLight = function (color, duration) {
        // begin blinking the LED.
        var that = this;
        this.blinkLightStartTime = getTime();
        this.blinkIntervalId = setInterval(function () {
            // For each LED, flip its color and write the new value.
            for (var i = 0; i < that.litLeds[i]; i++) {
                that.litLeds[i] = !that.litLeds[i];
                that.led[i].write(that.litLeds[i]);
            }

            maxTimeoutExceededCheck(this.blinkLightId, this.blinkLightStartTime, duration);
        }, duration);
    };
}

// If the specified interval has been running for longer than MAX_TIMEOUT, clear the interval.
function maxTimeoutExceededCheck(intervalId, startTime, duration) {
    if (!duration || duration === 0) { duration = MAX_TIMEOUT; }

    // If we've exceeded MAX_TIMEOUT, clear all intervals.
    if (getTime() - startTime > duration) {
        clearInterval(intervalId);
    }
}

// When initialized, set default services and hook up buttons.
function onInit() {
    NRF.setServices({
        0xC900: {
            0xC90A: { // LEDs
                writable: true,
                onWrite: function (evt) {
                    digitalWrite([LED3, LED2, LED1], evt.data[0]);
                }
            },
            0xC91A: { readable: true, broadcast: true, notify: true }, // Zero IR
            0xC91B: { readable: true, broadcast: true, notify: true }, // Current IR
            0xC92A: { readable: true, broadcast: true, notify: true }, // Zero MAG
            0xC92B: { readable: true, broadcast: true, notify: true }, // Current MAG
            0xC93A: { readable: true, broadcast: true, notify: true }, // Current BATT
        }
    });

    var p = new puck_firmware();

    setWatch(p.click.bind(p), BTN, {
        edge: 'rising',
        debounce: 10,
        repeat: true
    });
}

onInit();