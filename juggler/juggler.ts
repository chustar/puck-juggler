
class Juggler {
  zero: {};
  blinkValue: number = 0;

  start() {
    Puck.magOn(SampleRate.Hz_0_63);
    this.zero = Puck.mag();

    // pulse the green LED.
    LED2.write(1);
    setTimeout(() => {
      LED2.write(0);
    }, 500);

    setInterval(this.captureFrame, 100);
    setInterval(this.blink, 500);
  }

  stop() {
    Puck.magOff();
    clearInterval(null);
    
    // pulse the green LED.
    LED1.write(1);
    setTimeout(() => {
      LED1.write(0);
    }, 500);
  }

  captureFrame() {
    // get the current position.
    var pos = Puck.mag();

    // broadcast to rasberry pi.
  }

  blink() {
    LED2.write(this.blinkValue);
    this.blinkValue = this.blinkValue == 0 ? 1 : 0;
  }
}