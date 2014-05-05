// labelPart() proxy

SyntaxElementMorph.prototype.originalLabelPart = SyntaxElementMorph.prototype.labelPart;

function overridenLabelPart(spec) {
	var part;
	switch (spec) {
		case '%port':
			part = new InputSlotMorph(
				null,
				false,
				function() { 
					socket.send("serialPortNames");
					return serialPortNames
				} 
				);
			part.setContents(Object.keys(serialPortNames)[0]);
			break;
		case '%arduinoType':
			part = new InputSlotMorph(
				null,
				false,
				arduinoTypes,
				true
				);
			part.setContents('ArduinoUNO');
			break; 
		case '%servoValue':
			part = new InputSlotMorph(
				null,
				false,
				{
					'angle (0-180)' : 90,
					'stopped' : ['stopped'] , 
					'clockwise' : ['clockwise'] ,
				 	'counter-clockwise' : ['counter-clockwise']
				}
				);
			part.setContents(['clockwise']);
			break;
		case '%pinMode':
			part = new InputSlotMorph(
				null,
				false,
				{
					'digital input' : ['digital input'],
					'digital output' : ['digital output'] ,
				 	'PWM' : ['PWM'] ,
				 	'servo' : ['servo']
				},
				true
				);
			part.setContents(['servo']);
			break;
		case '%servoPin':
			part = new InputSlotMorph(
				null,
				true,
				function() { return boardSpecs.servoPins },
				true
				);
			break;
		case '%leftPaw':
			part = new InputSlotMorph(
				null,
				true,
				function() { return boardSpecs.servoPins },
				true
				);
			break;
		case '%pwmPin':
			part = new InputSlotMorph(
				null,
				true,
				function() { return boardSpecs.pwmPins },
				true
				);
			break;
		case '%analogPin':
			part = new InputSlotMorph(
				null,
				true,
				function() { return boardSpecs.analogPins },
				true
				);
			break;
		case '%digitalPin':
			part = new InputSlotMorph(
				null,
				true,
				function() { return boardSpecs.digitalPins },
				true
				);
			break;
		default:
			part = SyntaxElementMorph.prototype.originalLabelPart(spec);
		}
	return part;
}

SyntaxElementMorph.prototype.labelPart = overridenLabelPart
