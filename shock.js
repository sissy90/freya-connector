const pigpio = require('pigpio');
const key = '00101100101001010';
const Gpio = pigpio.Gpio;

var  pi;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function transmitter(sequence, time) {
	const G1 = 17; // set output pins

	//pi.set_mode(G1, pigpio.OUTPUT); // GPIO 17 as output

	pi.waveClear();

	//create lists of parts of the wave we need
	let start_=[];
	let one_=[];
	let zero_=[];
	let end_=[];
	let sequence_wave=[];

	// define times
    const start_bit = 1540;
    const start_delay = 800;
    const space = 1040;
    const zero_bit = 220;
    const zero_delay = space - zero_bit;
    const one_bit = 740;
    const one_delay = space - one_bit ;
    const EOS_delay = 7600;

    sequence_wave.push(pigpio.pulse(1<<G1, 0, start_bit));
    sequence_wave.push(pigpio.pulse(0, 1<<G1, start_delay));

	//adds the sequence bits to the waveform, in order.
	for (var x = 0; x < 40; x++) {
		if (sequence[x] == 0) {
			sequence_wave.push(pigpio.pulse(1<<G1, 0, zero_bit)); // fix
			sequence_wave.push(pigpio.pulse(0, 1<<G1, zero_delay));
		}
        else {
			sequence_wave.push(pigpio.pulse(1<<G1, 0, one_bit)); // fix
			sequence_wave.push(pigpio.pulse(0, 1<<G1, one_delay));
		}
	}

    sequence_wave.push(pigpio.pulse(0, 0, EOS_delay));

    pi.waveAddGeneric(sequence_wave);
    let waveID = pi.waveCreate(); //save the completed wave and send wave ID to var

    pi.waveSendRepeat(waveID);
    sleep(time*1000);
    pi.waveTxStop(); // stop waveform

    pi.waveClear(); // clear all waveforms

    pi.write(17, 0);
    console.log("transmission done");
}

var transmit = function(mode_,power_,time_,channel_,key_) {
	var pi = new Gpio(17, {mode: Gpio.OUTPUT});

	console.log("transmitting now...");


    if (power_ < 3 && mode_ != 2){
    	//this is to fix a bug affecting power 0-2 causing errors. increases power to three if it's 0-2 to avoid it.
        power_ = 3;
	}

	// we convert the power value between 0-100 (After converting it to an interger) to a 7 bit binary encoded number.
    let power_binary = Number(power_).toString(2);
	power_binary = "0000000".substr(power_binary.length) + power_binary;


    //def channel string:
    if (channel_ == 2){
		var channel_sequence = '111';
		var channel_sequence_inverse = '000';
	}
    else{
		var channel_sequence = '000';
		var channel_sequence_inverse = '111';
	}

    if (mode_ == 1) {
		//flash the ight on the collar.
        var mode_sequnce = '1000';
        var mode_sequnce_inverse = '1110';
	}
	else if (mode_ == 3) {
        //vibrate the collar
        var mode_sequnce = '0010';
        var mode_sequnce_inverse = '1011';
	}
    else if (mode_ == 4) {
        //shock the collar
        var mode_sequnce = '0001';
        var mode_sequnce_inverse = '0111';
	}
	else if (mode_ == 2) {
        var mode_sequnce = '0100';
        var mode_sequnce_inverse = '1101';
	}
    else {
        //mode = 2
        // beep the collar. it was done like this so the 'else' is a beep, not a shock for safety.
        var mode_sequnce = '0100';
        var mode_sequnce_inverse = '1101';
	}

    // Define the key!

    let key_sequence = key_;

    let sequence = '1' + channel_sequence + mode_sequnce + key_sequence + power_binary + mode_sequnce_inverse + channel_sequence_inverse + '00';
	
console.log(Gpio);
console.log(pigpio);
    while (Gpio.waveBusy()){
		//wait for prior waveform to be sent
		sleep(200);
	}

    transmitter(sequence,time_);
}

exports.transmit = transmit;
