var pharoUrl = "localhost:8080/";
var snapUrl = pharoUrl + "s4a.html";
var webSocketUrl= "ws://localhost:4001/s4a";

var analogReadings = [];
var digitalReadings = [];
var analogReadingThreadId;
var digitalReadingThreadId;
var serialPortNames = {};
var arduinoTypes = {
	"Mini"                     : "ArduinoMini",
	"Pro w/ atmega168"         : "ArduinoPro",
	"Mega"                     : "ArduinoMega",
	"Ng or older w/ atmega8"   : "ArduinoATmega8",
	"Uno"                      : "ArduinoUNO",
	"Lilypad w/ atmega328"     : "ArduinoLilyPad328",
	"Lilypad w/ atmega168"     : "ArduinoLilyPad",
	"Ng or older w/ atmega168" : "ArduinoATmega168",
	"Pro w/ atmega328"         : "ArduinoPro328",
	"Diecimila w/ atmega168"   : "ArduinoDiecimila",
	"Mega 2560"                : "ArduinoMega2560",
	"Bluetooth"                : "ArduinoBT",
	"Duemilanove w/ atmega328" : "ArduinoATmega328",
};

var boardSpecs = {
	"analogPins"  : {},
	"digitalPins" : {},
	"servoPins"   : {},
	"pwmPins"     : {}
};

// WebSocket

var socket = new WebSocket(webSocketUrl);
var webSocketRefreshInterval = 10; //milliseconds


socket.onopen = function() { initializeAll() }

socket.onmessage = function(message) {
	messageArray = message.data.split("&");
	switch (messageArray[0]) {
		case 'analogReadings':
			analogReadings = JSON.parse(messageArray[1]);
			break;
		case 'digitalReadings':
			digitalReadings = JSON.parse(messageArray[1]);
			break;
		case 'boardSpecs':
			boardSpecs = JSON.parse(messageArray[1]);
			break;
		case 'serialPortNames':
			serialPortNames = JSON.parse(messageArray[1]);
			break;
	}
};

socket.onclose = function() { 
	inform("Connection lost!", "Lost connection to the server.\nPlease make sure the server is running, then reload this page and try again.");
	releaseAll();
}

// Initialize-release

function initializeAll() {
	socket.send('greetings'); // will send a greeting back if no board is already connected. If it is, will send the boardSpecs
	setInterval(updateState, webSocketRefreshInterval * 15); // we don't need to keep state too updated, so 15 times slower than realtime is more than ok
}

function releaseAll() {
	if (analogReadingThreadId) { clearInterval(analogReadingThreadId) };
	if (digitalReadingThreadId) { clearInterval(digitalReadingThreadId) };
}

// Readings

function requestAnalogReadings() { socket.send('analogReadings') }
function requestDigitalReadings() { socket.send('digitalReadings') }

// State

function updateState() {
	socket.send('serialPortNames') // will send back possible serial port names where an Arduino may be connected
	socket.send('boardSpecs'); 
}

// GUI

function inform(title, message) {
	(new DialogBoxMorph()).inform(title, message, world);
}
