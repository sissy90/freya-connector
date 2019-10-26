## takes PARAMATERS and transmits

## This is free and unencumbered software released into the public domain.
## see LICENSE file or https://unlicense.org/ for full text of license.

import pigpio # for pulse control
import time # for sleep()
import sys # to import variables from command line call

## grab the vars from the arguments passed to this program
mode_ = int(sys.argv[1]) # either up, down, or stop
time_ = int(sys.argv[2])

up_seq = '0101000001010101000000110'
down_seq = '0101000001010101001100000'
stop_seq = '0101000001010101000011000'

print("mode: ", mode_)

pi = pigpio.pi() # set the 'pi' variable to mean wean we need to access LOCAL pi

#string transmission module
def transmitter(sequence, time_):

	#set output pins
	G1 = 17

	pi.set_mode(G1, pigpio.OUTPUT) # GPIO 17 as output

	pi.wave_clear() # clear existing waveforms

	#create lists of parts of the wave we need
	start_=[]
	one_=[]
	zero_=[]
	end_=[]
	sequence_wave=[]

	# define times
	# start_bit = 1540
	# start_delay = 800
	space = 790
	zero_bit = 175
	zero_delay = space - zero_bit
	one_bit = 580
	one_delay = space - one_bit
	EOS_delay = 5345

	# sequence_wave.append(pigpio.pulse(1<<G1, 0, start_bit))
	# sequence_wave.append(pigpio.pulse(0, 1<<G1, start_delay))

	for x in range(0, 26): #adds the sequence bits to the waveform, in order.
		if int(sequence[x]) == 0:
			sequence_wave.append(pigpio.pulse(1<<G1, 0, zero_bit)) ## fix
			sequence_wave.append(pigpio.pulse(0, 1<<G1, zero_delay))
		else:
			sequence_wave.append(pigpio.pulse(1<<G1, 0, one_bit)) ## fix
			sequence_wave.append(pigpio.pulse(0, 1<<G1, one_delay))

	sequence_wave.append(pigpio.pulse(0, 0, EOS_delay))

	pi.wave_add_generic(sequence_wave)
	waveID = pi.wave_create() #save the completed wave and send wave ID to var

	pi.wave_send_repeat(waveID)
	time.sleep(time_)
	pi.wave_tx_stop() # stop waveform

	pi.wave_clear() # clear all waveforms

	pi.write(17, 0)
	print("transmission done")
## tell the program how to transmit using a given mode and time.
## if you're wondering why there's a _, it's because stuff like time is reserved by python
## and was causing issues. so I changed them all to be _.
def transmit(mode_,time_):

	print("transmitting now...")

	if mode_ == 'up':
		sequence = up_seq
	elif mode_ == 'down':
		sequence = down_seq
	else:
		sequence = stop_seq

	while pi.wave_tx_busy(): # wait for prior waveform to be sent
		time.sleep(0.2)
	transmitter(sequence,time_)

	sys.stdout.flush()

transmit(mode_,time_)
