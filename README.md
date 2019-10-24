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
     * make sure you get a model with 2 antennas as shown here
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

### Operating System
1. Once the micro SD Card is inserted into your Raspberry Pi, plug the Pi into a power source. You will be offered a choice when the installer has loaded. You should check the box for Raspbian, and then click Install.
   * If you do not have a SD card with NOOBs, follow [this](https://thepi.io/how-to-install-noobs-on-the-raspberry-pi/) guide.

![](https://i.imgur.com/YqxX6y1.png)

2. Click ‘Yes’ at the warning dialog, and then sit back and relax. It will take a while, but Raspbian will install.

![](https://i.imgur.com/GC2wRDT.png)

3. When Raspbian has been installed, click OK and your Raspberry Pi will restart and Raspbian will then boot up.

![](https://i.imgur.com/8vC0NFM.png)


4. After Raspbian is installed, follow any prompts to update your timezone and software.

### Fitting Hammer Header
    * Source: https://learn.pimoroni.com/tutorial/sandyj/fitting-hammer-headers

* It's important to hammer on a sturdy, stable, well-supported surface like a worktop or a solid wood table (although not your expensive dining table!)
* The jig comes in three pieces, and has two nylon bolts. Snap apart the acrylic pieces, and peel off the protective film (although this isn't absolutely necessary).
* **Note:** newer versions of the hammer header kit come with black metal bolts and nuts. The only difference is that the nuts go on top of your Pi Zero / W or pHAT to hold it securely to the baseplate while you hammer the header in.

* Push the nylon bolts through the larger plastic piece with the long rectangular hole cut in it for the GPIO pins. It doesn't matter which way up this piece is.

![](https://i.imgur.com/5voc5d1.jpg)

* Next, put the other rectangular acrylic piece below it, so that the heads of the nylon bolts fit neatly into the two holes. This piece prevents the pins from being pushed too far through.

![](https://i.imgur.com/feaMuGw.jpg)

* Now, push your Pi Zero PCB, right way up, onto the jig.
* **If you have a kit with metal nuts and bolts, then screw the nuts onto the bolts now, to hold the PCB securely to the baseplate.**

![](https://i.imgur.com/bqdfRuB.jpg)

* Place the hammer header on top of the pin holes on your Pi Zero, making sure that the longer ends of the pins (without the retaining nubbins) are pointing upwards.

![](https://i.imgur.com/wzO95u4.jpg)

* Now, place the last acrylic piece on top of the pins and push it down until it touches them.

![](https://i.imgur.com/yzGEXIv.jpg)

* Using a hammer, gently tap back and forth on the top acrylic piece to push the pins through. Pushing one end of the header all the way it can cause the other pins to bend when you hammer them in. It's worth taking your time over this part.

![](https://i.imgur.com/o3amIxZ.jpg)

* Now, it should look like this:

![](https://i.imgur.com/QltGeWW.jpg)

### Setting up the software
* Once the system reboot after installation, open the command line (terminal).

![](https://i.imgur.com/yqVXbAT.png)

* Make sure that node, npm and git are installed simply by entering:
  * node -v
  * npm -v
  * git --version

![](https://i.imgur.com/5QQMBAt.png)

* The node version should be at least 8.x.x.
* **Note:** If you don’t have a mouse this command lets you control the pointer with the numpad:
  * setxkbmap -option keypad:pointerkeys.
  * Press ctrl + shift + numlock to activate.
* Now run git and type:
  * git clone https://github.com/sissy90/freya-connector.git

![](https://i.imgur.com/74HC9ok.png)

* In the terminal navigate to the project directory and install dependencies:
  * cd freya-connector
  * npm install

![](https://i.imgur.com/sZAsDSU.png)

* Now you need to update your username in the userConfig.json file. Still in the project directory run: 
  * nano userConfig.json

![](https://i.imgur.com/RzS99Uu.png)

* Or use a text editor - open it through file manager in /home/pi/freya-connector folder.

* Now, you need to join Bot Test Server in Discord: https://discord.gg/bxmW8z6

![](https://i.imgur.com/lan4jsS.png)

* Get back to the terminal. In project directory run:
  * sudo pigpiod
  * node server.js

![](https://i.imgur.com/n80WxUg.png)

* Now, Discord’s Bot Test Server Freya should tell you that you’re online!

![](https://i.imgur.com/3XDX8LL.png)

### Wiring up the transmitter

* **Make sure that the Pi is turned off for these steps**
* Here is a basic wiring diagram for the 433Mhz transmitter:

![circuit](https://i.imgur.com/3qAQq9Z.png)

* This will look different if you are using a breadboard vs. just female-female jumpers
