
function updateGauge(temperature){
  document.getElementById("outside-temperature").innerHTML = temperature + "°"

};

function updateSensorReadings(jsonResponse) {
  let temperature = jsonResponse.temperature.toFixed(0);
  updateGauge(temperature);
}

/*
  SocketIO Code
*/
//   var socket = io.connect("http://" + document.domain + ":" + location.port);
var socket = io.connect();

//receive details from server
socket.on("updateSensorData", function (msg) {
  var sensorReadings = JSON.parse(msg);
  updateSensorReadings(sensorReadings);
});
