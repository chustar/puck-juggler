var on = 0;
function toggle() {
  on = !on;
  digitalWrite(LED, on);
}

// Are we busy?
var busy = false;

// The device, if we're connected
var connected = false;

// The 'tx' characteristic, if connected
var txCharacteristic = false;

// Function to call 'toggle' on the other Puck
function sendToggle() {
  if (!busy) {
    busy = true;
    if (!connected) {
      NRF.requestDevice({ filters: [{ namePrefix: 'Puck' }] }).then(function(device) {
        return device.gatt.connect();
      }).then(function(d) {
        connected = d;
        return d.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
      }).then(function(s) {
        return s.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e");
      }).then(function(c) {
        txCharacteristic = c;
        busy = false;
        // Now actually send the toggle command
        sendToggle();
      }).catch(function() {
        if (connected) connected.disconnect();
        connected=false;
        digitalPulse(LED1, 1, 500); // light red if we had a problem
        busy = false;
      });
    } else {
      txCharacteristic.writeValue("toggle()\n").then(function() {
        digitalPulse(LED2, 1, 500); // light green to show it worked
        busy = false;
      }).catch(function() {
        digitalPulse(LED1, 1, 500); // light red if we had a problem
        busy = false;
      });
    }
  }
}