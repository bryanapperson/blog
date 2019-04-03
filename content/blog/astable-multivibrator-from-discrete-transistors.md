+++
title = "				Astable Multivibrator from Discrete Transistors		"
date = "2016-01-24 23:34:29"
type = "post"
tags = ['astable-multivibrator', 'electronics', 'nand', 'transistor']
+++


				This blog post is about making an astable multivibrator from discrete transistors. This weekend I embarked on making a home-brew computer from discrete transistors. To test circuits like a JK flip-flop or SRAM, a clock is needed. In the spirit of keeping with an all discrete transistor computer, I used an astable multivibrator composed of two RTL NAND gates. I wanted to start with a very low frequency, so I targeted 10 seconds high, 10 low for the clock. Changing the size of the capacitor and resistor outside the NAND gates will adjust the frequency. The formula for the frequency of the clock works out to be something like this: [latex]f=\frac{1}{t}=\frac{1}{2RC}=\frac{1}{2 \times 4700\Omega \times 2200uF}=20.68s[/latex].
<h2>Designing the Astable Multivibrator</h2>
I am new to low-level electronics like this, but I had used Arduino in the past and the designers of that micro-controller advocate <a href="http://fritzing.org/home/">Fritzing</a>. I used Fritzing to design the schematic, breadboard and PCB. The first step was to design the schematic. I used and adaptation of a circuit I found here. The schematic looks like this:

[caption id="attachment_772" align="alignnone" width="975"]<a href="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_schem.png" rel="attachment wp-att-772"><img class="wp-image-772 size-large" src="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_schem-1024x801.png" alt="2 NAND Gate Astable Multivibrator Schematic" width="975" height="763" /></a> 2 NAND Gate Astable Multivibrator schematic[/caption]

The next step was to breadboard the circuit. The cover image of this blog post shows the real life version, however I was able to breadboard it in Fritzing to validate the circuit:

[caption id="attachment_773" align="alignnone" width="975"]<a href="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_bb.png" rel="attachment wp-att-773"><img class="size-large wp-image-773" src="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_bb-1024x410.png" alt="Astable Multivibrator on Breadboard" width="975" height="390" /></a> Astable Multivibrator on breadboard[/caption]

After that I went ahead and breadboarded/tested the circuit:

[caption id="attachment_774" align="alignnone" width="975"]<a href="http://bryanapperson.com/wp-content/uploads/2016/01/IMG_20160123_040150.jpg" rel="attachment wp-att-774"><img class="size-large wp-image-774" src="http://bryanapperson.com/wp-content/uploads/2016/01/IMG_20160123_040150-1024x766.jpg" alt="2 NAND Gate Astable Multivibrator Circuit" width="975" height="729" /></a> 2 NAND Gate Astable Multivibrator Circuit[/caption]

Everything worked as expected after making blue smoke out of an LED that was shorted.

The final step for having a drop in circuit for a test clock was to design a PCB. I made considerations for being able to change R8 and C1 to change the frequency to something like .5hz for use in testing other components as I go down the homebrew computer road. That was convenient because I was able to fabricate the PCB from the program directly.  I ordered a fabrication of the PCB from <a href="http://fab.fritzing.org/fritzing-fab">Fritzing Fab</a>.

[caption id="attachment_775" align="alignnone" width="363"]<a href="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_pcb_top.png" rel="attachment wp-att-775"><img class="size-full wp-image-775" src="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_pcb_top.png" alt="Top of Astable Multivibrator PCB" width="363" height="315" /></a> Top of Astable Multivibrator PCB[/caption]

[caption id="attachment_776" align="alignnone" width="363"]<a href="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_pcb_bottom.png" rel="attachment wp-att-776"><img class="size-full wp-image-776" src="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator_pcb_bottom.png" alt="Bottom of Astable Multivibrator PCB" width="363" height="315" /></a> Bottom of Astable Multivibrator PCB[/caption]

In about two weeks the PCB will be here from Germany and the parts will go on the board. The Fritzing file for this circuit can be downloaded <a href="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator.fzz">here</a>. Hopefully this article is helpful to anybody looking to make a clock circuit from discrete transistors using resistor-transistor logic NAND gates. Let me know your thoughts in the comments.		