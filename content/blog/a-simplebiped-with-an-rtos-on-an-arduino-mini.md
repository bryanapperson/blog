+++
title = "A SimpleBiped with an RTOS on an Arduino Mini"
description = "How I once built a bipedal robot using C, arduino and an RTOS"
date = "2015-04-09 20:48:42"
keywords = ['arduino', 'biped', 'c', 'development', 'object-detection', 'rtos', 'technology']
tags = ['arduino', 'biped', 'c', 'development', 'object-detection', 'rtos', 'technology']

+++

About two years back I wrote up a program for and designed a bipedal robot (I coined it the SimpleBiped) based on the [Arduino Micro](http://arduino.cc/en/Main/arduinoBoardMicro) board. This article is an outline of what I did, mainly for reference if I revisit this later, but hopefully its useful to you as well. I designed a bipedal robot wh That code looks something like this:ich uses ultrasonic sensors for object detection, and some basic logic for navigation as well as some primitives for servo control. The robot had 5 servos as defined in the code below. Here is a [SimpleBiped hardware spreadsheet](https://drive.google.com/file/d/0B_jveeQ1rgGPcnZSUU5SeWJadjA/view?usp=sharing) on what I used for the build. The body parts were found on Thingiverse, modified in blender and printed with an old thing-o-matic.

That printer was awesome at the time and definitely served it’s purpose. It unfortunately no longer works (going to make some iteration of the Prusa eventually). I don’t have pictures of the robot and my last iteration is in storage in NY right now (I am in Georgia). I will post the blender parts up some time on my Thingiverse (all that is there now is the enclosure for the Arduino micro I integrated into the body) and link them here. Once (and if) I get started on this I’ll post circuit diagrams as well. At first the robot would walk, stop, scan for objects - then make a choice and continue walking.

The code can be found [on github](https://github.com/bryanapperson/simplebiped). I did try to add an RTOS. Unfortunately I never got this working smoothly and the robot would jitter too much while walking due to the interrupts. Mutexs and Semaphores are tough to get right, I’d love to revisit this project at a later time (once I have a working 3D printer for body components again). Feel free to use this code (but not the name SimpleBiped) in your projects under a GNU/GPL liscence, or (and I would appreciate it), tell me where I went wrong with my mutexs!

If and when I do revisit this project I will definitely post further updates here.
