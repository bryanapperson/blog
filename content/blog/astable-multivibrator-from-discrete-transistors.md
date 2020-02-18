+++
title = "Astable Multivibrator from Discrete Transistors"
date = "2016-01-24"
katex = "true"
keywords = [ "astable-multivibrator, electronics, nand, transistor"  ]
tags = ['astable-multivibrator', 'electronics', 'nand', 'transistor']
+++

This blog post is about making an astable multivibrator from discrete
transistors. This weekend I embarked on making a home-brew computer from
discrete transistors. To test circuits like a JK flip-flop or SRAM, a clock is
needed. In the spirit of keeping with an all discrete transistor computer, I
used an astable multivibrator composed of two RTL NAND gates. I wanted to start
with a very low frequency, so I targeted 10 seconds high, 10 low for the clock.
Changing the size of the capacitor and resistor outside the NAND gates will
adjust the frequency. The formula for the frequency of the clock works out to be
something like
this: $:f=\frac{1}{t}=\frac{1}{2RC}=\frac{1}{2 \times 4700\Omega \times 2200uF}=20.68s$.

## Designing the Astable Multivibrator

I am new to low-level electronics like this, but I had used Arduino in the past
and the designers of that micro-controller advocate
<a href="http://fritzing.org/home/">Fritzing</a>. I used Fritzing to design the
schematic, breadboard and PCB. The first step was to design the schematic. I
used and adaptation of a circuit I found here.

The next step was to breadboard the circuit. The cover image of this blog post
shows the real life version, however I was able to breadboard it in Fritzing to
validate the circuit.

After that I went ahead and breadboarded/tested the circuit. Everything worked
as expected after making blue smoke out of an LED that was shorted.

The final step for having a drop in circuit for a test clock was to design a
PCB. I made considerations for being able to change R8 and C1 to change the
frequency to something like .5hz for use in testing other components as I go
down the homebrew computer road. That was convenient because I was able to
fabricate the PCB from the program directly.  I ordered a fabrication of the PCB
from <a href="http://fab.fritzing.org/fritzing-fab">Fritzing Fab</a>.

In about two weeks the PCB will be here from Germany and the parts will go
on the board. The Fritzing file for this circuit can be downloaded
<a href="http://bryanapperson.com/wp-content/uploads/2016/01/point5hzastablemultivibrator.fzz">here</a>. Hopefully
this article is helpful to anybody looking to make a clock circuit from discrete
transistors using resistor-transistor logic NAND gates. Let me know your
thoughts in the comments.
