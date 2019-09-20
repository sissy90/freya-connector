# freya-connector

This is a Raspberry Pi project to connect a shock collar to discord. Continue with caution. I am not responsible for any injuries.

## Required Hardware

### Shock Collar
Order Your collar from [here](http://bit.ly/322H3Rz "http://bit.ly/322H3Rz"). Other collars might work, but don't chance it.
### Raspberry Pi
You will need a Raspberry Pi with the ability to connect to the internet. I have chosen the Pi Zero W for this project, but other models should also work. You will also need the following to use your pi:
* Micro USB power supply
* Micro USB OTG hub
* Mini HDMI adaptor
* MicroSD card loaded with NOOBS

You can get the kit I bought [here](https://amzn.to/2Hsg3Dj "https://amzn.to/2Hsg3Dj"). This kit includes all the basic accessories listed above.

### Accessories

 1. **433Mhz Transmitter**
	 * Needed to send signals to the collar
	 * [https://ebay.to/2ZAVTBz](https://ebay.to/2ZAVTBz "https://ebay.to/2ZAVTBz")
1. **Solderless Header**
	* **Note**: this only applies to the Raspberry Pi Zero W
	* If you can't solder, then I highly recommend this.
	* [http://bit.ly/2HkHEX5](http://bit.ly/2HkHEX5 "http://bit.ly/2HkHEX5")
1. **Breadboard Kit**
	* This item is a bonus that is nice to have. It makes wiring up the transmitter easier, and will be useful for future projects.
	* if you don't want to buy this, then you will at least need some [Female-Female jumper wires](https://ebay.to/343p2Vp "https://ebay.to/343p2Vp") to connect to the transmitter.
	* [https://amzn.to/2HkHHlJ](https://amzn.to/2HkHHlJ "https://amzn.to/2HkHHlJ")
1. USB keyboard and mouse
1. Monitor or TV with HDMI inputs

## Setup
1. Insert your SD card that is pre-loaded with NOOBs
    * If you do not have a SD card with NOOBs, follow [this](https://thepi.io/how-to-install-noobs-on-the-raspberry-pi/) guide.
1. Plug in the pi, and let it boot up.
1. Select 'Raspbian' as your operating system, and install it.
    * This can take a while depending on the write speed of your SD card.
1. After Raspbian is installed, follow any prompts to update your timezone and software.
1. Open the terminal and run the following commands
    * node -v
        * should return at least version 8.x.x
    * npm -v
        * should return at least version 5.x.x
    * git --version
        * should return something :)
    * git clone https://github.com/sissy90/freya-connector.git

1. You are now ready to connect the transmitter. Shut down your pi and unplug it to be safe.
1. Connect the transmitter as shown below. If you are using a breadboard, it will look a little different.
![circuit](https://i.imgur.com/3qAQq9Z.png)



