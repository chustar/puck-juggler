var zero = Puck.mag();
var doorOpen = false;
function onMag(p) {
  p.x -= zero.x;
  p.y -= zero.y;
  p.z -= zero.z;
  var s = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);
  var open = s<1000;
  if (open!=doorOpen) {
    doorOpen = open;
    digitalPulse(open ? LED1 : LED2, 1,1000);
  }
}
Puck.on('mag', onMag);
Puck.magOn();   