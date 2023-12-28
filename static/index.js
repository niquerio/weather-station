
function updateGauge(temperature){
  document.getElementById("outside-temperature").innerHTML = temperature + "°"

};

function updateSensorReadings(jsonResponse) {
  let temperature = jsonResponse.temperature.toFixed(0);
  updateGauge(temperature);
}

function setDateTime(){
  date = new Date().toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"});
  document.getElementById("clock-date").innerHTML = date;
  time = new Date().toLocaleTimeString('en-us', {hour: "numeric", minute: "numeric"});
  document.getElementById("clock-time").innerHTML = time;
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

setInterval(setDateTime,1000)
