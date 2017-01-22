/// <reference path="node_modules/puck/puck.d.ts" />
var Juggler = (function () {
    function Juggler() {
        this.blinkValue = 0;
    }
    Juggler.prototype.start = function () {
        Puck.magOn(SampleRate.Hz_0_63);
        this.zero = Puck.mag();
        // pulse the green LED.
        LED2.write(1);
        setTimeout(function () {
            LED2.write(0);
        }, 500);
        setInterval(this.captureFrame, 100);
        setInterval(this.blink, 500);
    };
    Juggler.prototype.stop = function () {
        Puck.magOff();
        clearInterval(null);
        // pulse the green LED.
        LED1.write(1);
        setTimeout(function () {
            LED1.write(0);
        }, 500);
    };
    Juggler.prototype.captureFrame = function () {
        // get the current position.
        var pos = Puck.mag();
        // broadcast to rasberry pi.
    };
    Juggler.prototype.blink = function () {
        LED2.write(this.blinkValue);
        this.blinkValue = this.blinkValue == 0 ? 1 : 0;
    };
    return Juggler;
}());
//# sourceMappingURL=juggler.js.map