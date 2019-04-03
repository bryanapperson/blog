+++
title = "				A SimpleBiped with an RTOS on an Arduino Mini		"
date = "2015-04-09 20:48:42"
tags = ['arduino', 'biped', 'c', 'development', 'object-detection', 'rtos', 'technology']
+++


				About two years back I wrote up a program for and designed a bipedal robot (I coined it the SimpleBiped) based on the <a title="Arduino Micro" href="http://arduino.cc/en/Main/arduinoBoardMicro">Arduino Micro</a> board. This article is an outline of what I did, mainly for reference if I revisit this later, but hopefully its useful to you as well. I designed a bipedal robot which uses ultrasonic sensors for object detection, and some basic logic for navigation as well as some primitives for servo control. The robot had 5 servos as defined in the code below. Here is a <a title="SimpleBiped Hardware" href="https://drive.google.com/file/d/0B_jveeQ1rgGPcnZSUU5SeWJadjA/view?usp=sharing">hardware spreadsheet</a> on what I used for the build. The body parts were found on Thingiverse, modified in blender and printed with this:

[caption id="attachment_682" align="aligncenter" width="300"]<a href="http://bryanapperson.com/wp-content/uploads/2015/04/2013-01-29_17-37-19_928.jpg"><img class="wp-image-682 size-medium" src="http://bryanapperson.com/wp-content/uploads/2015/04/2013-01-29_17-37-19_928-300x169.jpg" alt="My Old Thing-o-Matic" width="300" height="169" /></a> My Old Thing-o-Matic[/caption]

That printer was awesome at the time and definitely served it's purpose. It unfortunately no longer works (going to make some iteration of the Prusa eventually). I don't have pictures of the robot and my last iteration is in storage in NY right now (I am in Georgia). I will post the blender parts up some time on <a title="Thingiverse" href="http://www.thingiverse.com/bytedisorder/about">my Thingiverse</a> (all that is there now is the enclosure for the Arduino micro I integrated into the body) and link them here. Once (and if) I get started on this I'll post circuit diagrams as well. At first the robot would walk, stop, scan for objects - then make a choice and continue walking. That code looks something like this:
<pre class="lang:c++ decode:true" title="Arduino Biped Code">#include &lt;Servo.h&gt; 

#define Ultrasonic 12
#define EnableServo 13
#define BuzzerPin 4
#define ButtonPin 2
#define Red 3
#define Green 5
#define Blue 6


Servo Lleg;  // create servo object to control a servo 
Servo Rleg;
Servo Lfoot;
Servo Rfoot;
Servo Neck;

int RFcenter = 80;    // variable to store the center servo position 
int LLcenter = 80;
int RLcenter = 80;
int LFcenter = 80;
int Neckcenter = 90;
int obstacleDistance = 0;
int obstacleLeft = 0;
int obstacleRight = 0;
int presentDistance = 0;
int tAngle = 30; //tilt angle
int uAngle = 35; //turn angle
int sAngle = 35; //swing angle
const int pingPin = 12;

void setup() {
  // initialize serial communication:
  Serial.begin(19200);
  
  Lleg.attach(7);  // attaches the servo on pin x to the servo object 
  Rleg.attach(10);  // attaches the servo on pin x to the servo object 
  Lfoot.attach(8);  // attaches the servo on pin x to the servo object 
  Rfoot.attach(9);  // attaches the servo on pin x to the servo object
  Neck.attach(11);  // attaches the servo on pin x to the servo object

  pinMode(EnableServo,OUTPUT); 
  digitalWrite(EnableServo,HIGH); //this turns on the power to the servos
  CenterServos(); //center the servos
  delay(500);
  digitalWrite(EnableServo,LOW); //turn power off after centering
  
  pinMode(Red, OUTPUT);
  digitalWrite(Red, LOW);
  pinMode(Blue, OUTPUT);
  digitalWrite(Blue, LOW);
  pinMode(Green, OUTPUT);
  digitalWrite(Green, LOW);
  
    pinMode(BuzzerPin, OUTPUT);
  digitalWrite(BuzzerPin, LOW);
  //Buzzer.PlayMelody();
  
  pinMode(ButtonPin, INPUT);
  digitalWrite(ButtonPin, HIGH); //pull up activated
  
  Serial.print("Ready");

  //while (digitalRead(ButtonPin) != LOW){ 
    //do nothing until the button pressed
  //}
    BuzzerBeep();
  for(int i=0;i&lt;5;++i){
    delay(1000);
  }
    BuzzerBeep();
}

void loop()
{
  //check for obstacles, if none, go Forward, if found, turn the other way
  NeckLeft(1,30);
  NeckRight(1,30);
  CheckObstacle();
}

void CheckDistance(){
    // establish variables for duration of the ping, 
  // and the distance result in inches and centimeters:
  long duration, cm;

  // The PING))) is triggered by a HIGH pulse of 2 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(pingPin, LOW);

  // The same pin is used to read the signal from the PING))): a HIGH
  // pulse whose duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(pingPin, INPUT);
  duration = pulseIn(pingPin, HIGH);

  // convert the time into a distance
  
  cm = microsecondsToCentimeters(duration);
  obstacleDistance = cm;
}

long microsecondsToCentimeters(long microseconds)
{
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the
  // object we take half of the distance travelled.
  return microseconds / 29 / 2;
}

void CheckObstacle(){
  int Obstacle=0;
  CheckDistance();
  if (obstacleDistance &gt;= 20){
    Obstacle=0;
  }
  if (obstacleDistance &lt;= 20){ //check sensor
    obstacleDistance = presentDistance;
    BuzzerBeep();
    Neck.write(Neckcenter+30); //turn head left
    delay(100);
    CheckDistance();
    delay(100);
    obstacleDistance = obstacleLeft;
    Neck.write(Neckcenter-30); //turn head right
    delay(200);
    CheckDistance();
    delay(100);
    Neck.write(Neckcenter); //turn head to the center
    delay(100);
    obstacleDistance = obstacleRight;
    if (presentDistance &gt;= obstacleLeft){
    Obstacle=Obstacle+1;
    }
    else if (presentDistance &gt;= obstacleRight &amp;&amp; obstacleLeft &gt;= presentDistance){
      Obstacle=Obstacle+2;
    }
    else if (obstacleRight == obstacleLeft) {
    Obstacle=Obstacle+3;
    }
    else {
      Obstacle=Obstacle+3;
    }
  }
  switch (Obstacle){
    case 0: //no object
      digitalWrite(Green, HIGH);
      digitalWrite(Red, HIGH);
      Forward(1,30); //one step Forward
      digitalWrite(Green, LOW);
      digitalWrite(Red, LOW);
      break;
    case 1: //object on Left
      digitalWrite(Green, HIGH);
      TurnRight(2,30);
      digitalWrite(Green, LOW);
      break;
    case 2: //object on Right
      digitalWrite(Blue, HIGH);
      TurnLeft(2,30);
      digitalWrite(Blue, LOW);
      break;
    case 3: //obect in Front (both Left and Right detect the object)
      digitalWrite(Red, HIGH);
      TurnLeft(4,30); //turn around
      digitalWrite(Red, LOW);
      break;
  }
}

void CenterServos() // center the servos on powerup
{ 
    Lleg.write(LLcenter);              // tell servo to go to position in variable 'center' 
    Rleg.write(RLcenter);              // tell servo to go to position in variable 'center' 
    Lfoot.write(LFcenter);              // tell servo to go to position in variable 'center' 
    Rfoot.write(RFcenter);              // tell servo to go to position in variable 'center' 
    Neck.write(Neckcenter);              // tell servo to go to position in variable 'center' 
    delay(100);                     // waits 100ms for the servos to reach the position 
}

void BuzzerBeep(){ //beep the buzzer on event
    digitalWrite(BuzzerPin, HIGH);
    delay(100);
    digitalWrite(BuzzerPin, LOW);
}

//Servo Primatives

void TiltRightUp(byte ang, byte sp){  
  //tilt right up
  for (int i=0; i&lt;=ang; i+=5){
    Lfoot.write(LFcenter+i);
    Rfoot.write(RFcenter+i);
    delay(sp);
  }
}
void TiltRightDown(byte ang, byte sp){
  //tilt right down
  for (int i=ang; i&gt;0; i-=5){
    Lfoot.write(LFcenter+i);
    Rfoot.write(RFcenter+i);
    delay(sp);
  }
}

void TiltLeftUp(byte ang, byte sp){
  //tilt left up
  for (int i=0; i&lt;=ang; i+=5){
    Lfoot.write(LFcenter-i);
    Rfoot.write(RFcenter-i);
    delay(sp);
  }
}
void TiltLeftDown(byte ang, byte sp){
  //tilt left down
  for (int i=ang; i&gt;0; i-=5){
    Lfoot.write(LFcenter-i);
    Rfoot.write(RFcenter-i);
    delay(sp);
  }
}

void LeftFootUp(char ang, byte sp){
  //tilt left up
  for (int i=0; i&lt;=ang; i+=5){
    Lfoot.write(LFcenter-i);
    delay(sp);
  }
}
void LeftFootDown(byte ang, byte sp){
  //tilt left down
  for (int i=ang; i&gt;0; i-=5){
    Lfoot.write(LFcenter-i);
    delay(sp);
  }
}

void RightFootUp(byte ang, byte sp){  
  //tilt right up
  for (int i=0; i&lt;=ang; i+=5){
    Rfoot.write(RFcenter+i);
    delay(sp);
  }
}
void RightFootDown(byte ang, byte sp){
  //tilt right down
  for (int i=ang; i&gt;0; i-=5){
    Rfoot.write(RFcenter+i);
    delay(sp);
  }
}

void SwingRight(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Lleg.write(LLcenter-i);
    Rleg.write(RLcenter-i);
    delay(sp);
  }
}
void SwingRcenter(byte ang, byte sp){
  //swing r-&gt;center
  for (int i=ang; i&gt;0; i-=5){
    Lleg.write(LLcenter-i);
    Rleg.write(RLcenter-i);
    delay(sp);
  }
}

void SwingLeft(byte ang, byte sp){
  //swing left
  for (byte i=0; i&lt;=ang; i=i+5){
    Lleg.write(LLcenter+i);
    Rleg.write(RLcenter+i);
    delay(sp);
  }
}
void SwingLcenter(byte ang, byte sp){
  //swing l-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Lleg.write(LLcenter+i);
    Rleg.write(RLcenter+i);
    delay(sp);
  }
}

void RightLegIn(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Rleg.write(RLcenter-i);
    delay(sp);
  }
}
void RightLegIcenter(byte ang, byte sp){
  //swing r-&gt;center
  for (int i=ang; i&gt;0; i-=5){
    Rleg.write(RLcenter-i);
    delay(sp);
  }
}

void RightLegOut(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Rleg.write(RLcenter+i);
    delay(sp);
  }
}
void RightLegOcenter(byte ang, byte sp){
  //swing r-&gt;center
  for (int i=ang; i&gt;0; i-=5){
    Rleg.write(RLcenter+i);
    delay(sp);
  }
}

void LeftLegIn(byte ang, byte sp){
  //swing left
  for (byte i=0; i&lt;=ang; i=i+5){
    Lleg.write(LLcenter+i);
    delay(sp);
  }
}
void LeftLegIcenter(byte ang, byte sp){
  //swing l-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Lleg.write(LLcenter+i);
    delay(sp);
  }
}

void LeftLegOut(byte ang, byte sp){
  //swing left
  for (byte i=0; i&lt;=ang; i=i+5){
    Lleg.write(LLcenter-i);
    delay(sp);
  }
}
void LeftLegOcenter(byte ang, byte sp){
  //swing l-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Lleg.write(LLcenter-i);
    delay(sp);
  }
}

void NeckLeft(byte ang, byte sp){
  //swing left
  for (int i=0; i&lt;=ang; i+=5){
    Neck.write(Neckcenter+i);
    delay(sp);
  }
}
void NeckRight(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Neck.write(Neckcenter-i);
    delay(sp);
  }
}
void NeckIcenter(byte ang, byte sp){
  //swing neck-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Neck.write(Neckcenter+i);
    delay(sp);
  }
}
void NeckOcenter(byte ang, byte sp){
  //swing neck-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Neck.write(Neckcenter-i);
    delay(sp);
  }
}

//Walk Functions

void Forward(byte Steps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltRightUp(tAngle, Speed);
  for (byte j=0; j&lt;Steps; ++j){
    SwingRight(sAngle, Speed);
    TiltRightDown(tAngle, Speed);
    TiltLeftUp(tAngle, Speed);
    SwingRcenter(sAngle, Speed);
    SwingLeft(sAngle, Speed);
    TiltLeftDown(tAngle, Speed);
    TiltRightUp(tAngle, Speed);
    SwingLcenter(sAngle, Speed);
  }
  TiltRightDown(tAngle, Speed);
  digitalWrite(EnableServo,LOW);
}

void TurnLeft(byte Steps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltLeftUp(uAngle, Speed);
  delay(20);
  for (byte j=0; j&lt;Steps; ++j){
    LeftLegIn(sAngle, Speed);
    TiltLeftDown(uAngle, Speed);
    TiltRightUp(uAngle, Speed);
    delay(20);
    LeftLegIcenter(sAngle, Speed);
    RightLegOut(sAngle, Speed);
    TiltRightDown(uAngle, Speed);
    TiltLeftUp(uAngle, Speed);
    delay(20);
    RightLegOcenter(sAngle, Speed);
  }
  TiltLeftDown(uAngle, Speed);
  digitalWrite(EnableServo,LOW);
}

void TurnRight(byte Stps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltRightUp(uAngle, Speed);
  delay(20);
  for (byte f=0; f&lt;=Stps; ++f){
    RightLegIn(sAngle, Speed);
    TiltRightDown(uAngle, Speed);
    TiltLeftUp(uAngle, Speed);
    delay(20);
    RightLegIcenter(sAngle, Speed);
    LeftLegOut(sAngle, Speed);
    TiltLeftDown(uAngle, Speed);
    TiltRightUp(uAngle, Speed);
    delay(20);
    LeftLegOcenter(sAngle, Speed);
  }
  TiltRightDown(uAngle, Speed);
  digitalWrite(EnableServo,LOW);
}</pre>
This was all well and good, but I decided it would be nicer if the robot could scan for obstacles and walk at the same time. To this end, considering that Arduino natively runs programs as a loop, it was time to get into interrupts and get multiple threads running on that little ATmega32u4 with 28KB of usable Flash for programs, 2.5KB of SRAM, 1KB of EEPROM and a 16Mhz clock speed. So the question was, how? After some research I stumbled upon <a title="ChibiOS" href="http://www.chibios.org/dokuwiki/doku.php">ChibiOS</a> and the port for <a title="ChibiOS Arduino" href="https://github.com/greiman/ChibiOS-Arduino">ChibiOS Arduino</a>. ChibiOS is a great library for running multiple "threads" on Arduino. I modified the above code to this effect (see this <a href="http://forum.arduino.cc/index.php?topic=146980.msg1107595">forum thread</a>):
<pre class="inline-margin:10 lang:c++ decode:true " title="Arduino Biped with 3 ">#include &lt;Servo.h&gt;
#include &lt;ChibiOS_AVR.h&gt;

MUTEX_DECL(lockMutex);
MUTEX_DECL(serialMutex);

#define EnableServo 3
#define BuzzerPin 13
#define ButtonPin 2
#define Red 6
#define Green 5
#define Blue 4


Servo Lleg;  // create servo object to control a servo 
Servo Rleg;
Servo Lfoot;
Servo Rfoot;
Servo Neck;

#define EnableServo 13
#define BuzzerPin 4
#define ButtonPin 2
#define Red 3
#define Green 5
#define Blue 6

int RFcenter = 80;    // variables to store the center servo positions
int LLcenter = 80;
int RLcenter = 80;
int LFcenter = 80;
int Neckcenter = 90;
// Setup variables to store sensor readings
int obstacleDistance = 0;
int obstacleLeft = 0;
int obstacleCenter = 0;
int obstacleRight = 0;
int presentDistance = 0;
// declare reaction distances on object preception
int obstacleAhead = 20;
int obstacleWarning = 10;
int obstacleAlert = 8;
volatile int Obstacle = 0;
// declare angle values for walking
int tAngle = 25; //tilt angle
int uAngle = 35; //turn angle
int sAngle = 30; //swing angle
int neckAngle = 30; //angle for meck turn
const int pingPin = 12; // define sensor pin

// remember thread pointers
Thread* tp1;
Thread* tp2;

//------------------------------------------------------------------------------
// thread 1 - high priority for walking motion
// 200 byte stack beyond task switch and interrupt needs
static WORKING_AREA(waThread1, 200);

static msg_t Thread1(void *arg) {
  while (TRUE) {
  WalkDirection();
  }
}

//------------------------------------------------------------------------------
// thread 2 - scan for obstacles as walking
// 200 byte stack beyond task switch and interrupt needs
static WORKING_AREA(waThread2, 200);

static msg_t Thread2(void *arg) {
  while (TRUE) {
    ScanObstacle();
  }
  // end task
}
//------------------------------------------------------------------------------

void setup() {
  // initialize serial communication:
  Serial.begin(19200);
  
  // read any input
  delay(200);
  while (Serial.read() &gt;= 0) {}
  
  Lleg.attach(7);  // attaches the servo on pin x to the servo object 
  Rleg.attach(10);  // attaches the servo on pin x to the servo object 
  Lfoot.attach(8);  // attaches the servo on pin x to the servo object 
  Rfoot.attach(9);  // attaches the servo on pin x to the servo object
  Neck.attach(11);  // attaches the servo on pin x to the servo object

  pinMode(EnableServo,OUTPUT); 
  digitalWrite(EnableServo,HIGH); //this turns on the power to the servos
  CenterServos(); //center the servos
  delay(500);
  digitalWrite(EnableServo,LOW); //turn power off after centering
  
  pinMode(Red, OUTPUT);
  digitalWrite(Red, LOW);
  pinMode(Blue, OUTPUT);
  digitalWrite(Blue, LOW);
  pinMode(Green, OUTPUT);
  digitalWrite(Green, LOW);
  
    pinMode(BuzzerPin, OUTPUT);
  digitalWrite(BuzzerPin, LOW);
  //Buzzer.PlayMelody();
  
  pinMode(ButtonPin, INPUT);
  digitalWrite(ButtonPin, HIGH); //pull up activated
  
  Serial.print("Ready... ");

  chBegin(mainThread);
  // chBegin never returns, main thread continues with mainThread()
  // shouldn't return
  while(1) {}
}
//------------------------------------------------------------------------------
// main thread runs at NORMALPRIO
void mainThread() {
  
  // start walk thread
  tp1 = chThdCreateStatic(waThread1, sizeof(waThread1),
                          NORMALPRIO + 2, Thread1, NULL);

  // start object scan thread
  tp2 = chThdCreateStatic(waThread2, sizeof(waThread2),
                          NORMALPRIO + 2, Thread2, NULL);
}
//------------------------------------------------------------------------------
void loop() {
 // not used
}

void CheckDistance(){
    // establish variables for duration of the ping, 
  // and the distance result in inches and centimeters:
  long duration, cm;

  // The PING))) is triggered by a HIGH pulse of 2 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  chThdSleepMilliseconds(2);
  digitalWrite(pingPin, HIGH);
  chThdSleepMilliseconds(5);
  digitalWrite(pingPin, LOW);

  // The same pin is used to read the signal from the PING))): a HIGH
  // pulse whose duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(pingPin, INPUT);
  duration = pulseIn(pingPin, HIGH);

  // convert the time into a distance
  chThdSleepMilliseconds(10);
  cm = microsecondsToCentimeters(duration);
  obstacleDistance = cm;
}

long microsecondsToCentimeters(long microseconds)
{
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the
  // object we take half of the distance travelled.
  return microseconds / 29 / 2;
}

void ScanObstacle(){
  Neck.write(Neckcenter);
  chThdSleepMilliseconds(100);
  CheckDistance();
  if (obstacleDistance &gt; 20){ //no obstacle nearby
    chMtxLock(&amp;lockMutex);
    Obstacle=0;
    chMtxUnlock();
    chMtxLock(&amp;serialMutex);
    Serial.print(obstacleDistance);
    Serial.print("cm center over 20");
    Serial.println();
    chMtxUnlock();
  }
  if (obstacleDistance &lt;= obstacleAhead){ //check sensor
    BuzzerBeep();
    Neck.write(Neckcenter);
    chThdSleepMilliseconds(100);
  digitalWrite(Red, HIGH);
  CheckDistance();
  chThdSleepMilliseconds(10);
  obstacleCenter = obstacleDistance;
  Serial.print(obstacleCenter);
  Serial.print("cm center");
  Serial.println();
  Neck.write(Neckcenter+neckAngle); //turn head left
  chThdSleepMilliseconds(200);
  digitalWrite(Green, HIGH);
  CheckDistance();
  obstacleLeft = obstacleDistance;
  Serial.print(obstacleLeft);
  Serial.print("cm left");
  Serial.println();
  digitalWrite(Green, LOW);
  Neck.write(Neckcenter-neckAngle); //turn head right
  chThdSleepMilliseconds(200);
  digitalWrite(Blue, HIGH);
  CheckDistance();
  obstacleRight = obstacleDistance;
  Serial.print(obstacleRight);
  Serial.print("cm right");
  Serial.println();
  digitalWrite(Blue, LOW);
  Neck.write(Neckcenter);
  chMtxLock(&amp;lockMutex);
  if ((obstacleLeft &lt;= obstacleAhead) &amp;&amp; (obstacleRight &gt;= obstacleLeft)){
    Obstacle=1;
    }
    if ((obstacleRight &lt;= obstacleAhead) &amp;&amp; (obstacleLeft &gt;= obstacleRight)){
      Obstacle=2;
    }
      if (((obstacleLeft &lt;= obstacleAhead &amp;&amp; obstacleRight &lt;= obstacleAhead &amp;&amp; obstacleCenter &lt;= obstacleAhead) &amp;&amp; (obstacleCenter == obstacleLeft &amp;&amp; obstacleCenter == obstacleRight)) || (obstacleLeft &lt;= obstacleWarning &amp;&amp; obstacleRight &lt;= obstacleWarning &amp;&amp; obstacleCenter &lt;= obstacleWarning)){
      Obstacle=3;
  }
      if ((obstacleLeft &lt;= obstacleAlert) || (obstacleRight &lt;= obstacleAlert) || (obstacleCenter &lt;= obstacleAlert)) {
      Obstacle=4;
  }
  chMtxUnlock();
  }
}
void WalkDirection(){
  chMtxLock(&amp;lockMutex);
  int walkToggle = Obstacle;
  chMtxUnlock();
  Serial.print(walkToggle);
  Serial.print(" Case");
  Serial.println();
  
  switch (walkToggle){
    case 0: //no object
      digitalWrite(Green, HIGH);
      digitalWrite(Red, HIGH);
      Forward(1,30); //one step Forward
      digitalWrite(Green, LOW);
      digitalWrite(Red, LOW);
      break;
    case 1: //object on Left
      digitalWrite(Green, HIGH);
      TurnRight(2,30);
      digitalWrite(Green, LOW);
      break;
    case 2: //object on Right
      digitalWrite(Blue, HIGH);
      TurnLeft(2,30);
      digitalWrite(Blue, LOW);
      break;
    case 3: //obect in Front (both Left and Right detect the object)
      digitalWrite(Red, HIGH);
      TurnLeft(4,30); //turn around
      digitalWrite(Red, LOW);
      break;
    case 4: //obect in Front (both Left and Right detect the object)
      digitalWrite(Red, HIGH);
      Reverse(2,30); //turn around
      digitalWrite(Red, LOW);
      break;
  }
}

void CenterServos() // center the servos on powerup
{ 
    Lleg.write(LLcenter);              // tell servo to go to position in variable 'center' 
    Rleg.write(RLcenter);              // tell servo to go to position in variable 'center' 
    Lfoot.write(LFcenter);              // tell servo to go to position in variable 'center' 
    Rfoot.write(RFcenter);              // tell servo to go to position in variable 'center' 
    Neck.write(Neckcenter);              // tell servo to go to position in variable 'center' 
    delay(100);                     // waits 100ms for the servos to reach the position 
}

void BuzzerBeep(){ //beep the buzzer on event
    digitalWrite(BuzzerPin, HIGH);
    chThdSleepMilliseconds(100);
    digitalWrite(BuzzerPin, LOW);
}

//Servo Primatives

void TiltRightUp(byte ang, byte sp){  
  //tilt right up
  for (int i=0; i&lt;=ang; i+=5){
    Lfoot.write(LFcenter+i);
    Rfoot.write(RFcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void TiltRightDown(byte ang, byte sp){
  //tilt right down
  for (int i=ang; i&gt;0; i-=5){
    Lfoot.write(LFcenter+i);
    Rfoot.write(RFcenter+i);
    chThdSleepMilliseconds(sp);
  }
}

void TiltLeftUp(byte ang, byte sp){
  //tilt left up
  for (int i=0; i&lt;=ang; i+=5){
    Lfoot.write(LFcenter-i);
    Rfoot.write(RFcenter-i);
    chThdSleepMilliseconds(sp);
  }
}
void TiltLeftDown(byte ang, byte sp){
  //tilt left down
  for (int i=ang; i&gt;0; i-=5){
    Lfoot.write(LFcenter-i);
    Rfoot.write(RFcenter-i);
    chThdSleepMilliseconds(sp);
  }
}

void LeftFootUp(char ang, byte sp){
  //tilt left up
  for (int i=0; i&lt;=ang; i+=5){
    Lfoot.write(LFcenter-i);
    chThdSleepMilliseconds(sp);
  }
}
void LeftFootDown(byte ang, byte sp){
  //tilt left down
  for (int i=ang; i&gt;0; i-=5){
    Lfoot.write(LFcenter-i);
    chThdSleepMilliseconds(sp);
  }
}

void RightFootUp(byte ang, byte sp){  
  //tilt right up
  for (int i=0; i&lt;=ang; i+=5){
    Rfoot.write(RFcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void RightFootDown(byte ang, byte sp){
  //tilt right down
  for (int i=ang; i&gt;0; i-=5){
    Rfoot.write(RFcenter+i);
    chThdSleepMilliseconds(sp);
  }
}

void SwingRight(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Lleg.write(LLcenter-i);
    Rleg.write(RLcenter-i);
    chThdSleepMilliseconds(sp);
  }
}
void SwingRcenter(byte ang, byte sp){
  //swing r-&gt;center
  for (int i=ang; i&gt;0; i-=5){
    Lleg.write(LLcenter-i);
    Rleg.write(RLcenter-i);
    chThdSleepMilliseconds(sp);
  }
}

void SwingLeft(byte ang, byte sp){
  //swing left
  for (byte i=0; i&lt;=ang; i=i+5){
    Lleg.write(LLcenter+i);
    Rleg.write(RLcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void SwingLcenter(byte ang, byte sp){
  //swing l-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Lleg.write(LLcenter+i);
    Rleg.write(RLcenter+i);
    chThdSleepMilliseconds(sp);
  }
}

void RightLegIn(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Rleg.write(RLcenter-i);
    chThdSleepMilliseconds(sp);
  }
}
void RightLegIcenter(byte ang, byte sp){
  //swing r-&gt;center
  for (int i=ang; i&gt;0; i-=5){
    Rleg.write(RLcenter-i);
    chThdSleepMilliseconds(sp);
  }
}

void RightLegOut(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Rleg.write(RLcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void RightLegOcenter(byte ang, byte sp){
  //swing r-&gt;center
  for (int i=ang; i&gt;0; i-=5){
    Rleg.write(RLcenter+i);
    chThdSleepMilliseconds(sp);
  }
}

void LeftLegIn(byte ang, byte sp){
  //swing left
  for (byte i=0; i&lt;=ang; i=i+5){
    Lleg.write(LLcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void LeftLegIcenter(byte ang, byte sp){
  //swing l-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Lleg.write(LLcenter+i);
    chThdSleepMilliseconds(sp);
  }
}

void LeftLegOut(byte ang, byte sp){
  //swing left
  for (byte i=0; i&lt;=ang; i=i+5){
    Lleg.write(LLcenter-i);
    chThdSleepMilliseconds(sp);
  }
}
void LeftLegOcenter(byte ang, byte sp){
  //swing l-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Lleg.write(LLcenter-i);
    chThdSleepMilliseconds(sp);
  }
}

void NeckLeft(byte ang, byte sp){
  //swing left
  for (int i=0; i&lt;=ang; i+=5){
    Neck.write(Neckcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void NeckRight(byte ang, byte sp){
  //swing right
  for (int i=0; i&lt;=ang; i+=5){
    Neck.write(Neckcenter-i);
    chThdSleepMilliseconds(sp);
  }
}
void NeckIcenter(byte ang, byte sp){
  //swing neck-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Neck.write(Neckcenter+i);
    chThdSleepMilliseconds(sp);
  }
}
void NeckOcenter(byte ang, byte sp){
  //swing neck-&gt;center
  for (byte i=ang; i&gt;0; i=i-5){
    Neck.write(Neckcenter-i);
    chThdSleepMilliseconds(sp);
  }
}

//Walk Functions

void Forward(byte Steps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltRightUp(tAngle, Speed);
  for (byte j=0; j&lt;Steps; ++j){
    SwingRight(sAngle, Speed);
    TiltRightDown(tAngle, Speed);
    TiltLeftUp(tAngle, Speed);
    SwingRcenter(sAngle, Speed);
    SwingLeft(sAngle, Speed);
    TiltLeftDown(tAngle, Speed);
    TiltRightUp(tAngle, Speed);
    SwingLcenter(sAngle, Speed);
  }
  TiltRightDown(tAngle, Speed);
  digitalWrite(EnableServo,LOW);
}

void Reverse(byte Steps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltLeftUp(tAngle, Speed);
  for (byte j=0; j&lt;Steps; ++j){
    SwingRight(sAngle, Speed);
    TiltLeftDown(tAngle, Speed);
    TiltRightUp(tAngle, Speed);
    SwingRcenter(sAngle, Speed);
    SwingLeft(sAngle, Speed);
    TiltRightDown(tAngle, Speed);
    TiltLeftUp(tAngle, Speed);
    SwingLcenter(sAngle, Speed);
  }
  TiltLeftDown(tAngle, Speed);
  digitalWrite(EnableServo,LOW);
}

void TurnLeft(byte Steps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltLeftUp(uAngle, Speed);
  chThdSleepMilliseconds(20);
  for (byte j=0; j&lt;Steps; ++j){
    LeftLegIn(sAngle, Speed);
    TiltLeftDown(uAngle, Speed);
    TiltRightUp(uAngle, Speed);
    chThdSleepMilliseconds(20);
    LeftLegIcenter(sAngle, Speed);
    RightLegOut(sAngle, Speed);
    TiltRightDown(uAngle, Speed);
    TiltLeftUp(uAngle, Speed);
    chThdSleepMilliseconds(20);
    RightLegOcenter(sAngle, Speed);
  }
  TiltLeftDown(uAngle, Speed);
  digitalWrite(EnableServo,LOW);
}

void TurnRight(byte Stps, byte Speed){
  digitalWrite(EnableServo,HIGH);
  TiltRightUp(uAngle, Speed);
  chThdSleepMilliseconds(20);
  for (byte f=0; f&lt;=Stps; ++f){
    RightLegIn(sAngle, Speed);
    TiltRightDown(uAngle, Speed);
    TiltLeftUp(uAngle, Speed);
    chThdSleepMilliseconds(20);
    RightLegIcenter(sAngle, Speed);
    LeftLegOut(sAngle, Speed);
    TiltLeftDown(uAngle, Speed);
    TiltRightUp(uAngle, Speed);
    chThdSleepMilliseconds(20);
    LeftLegOcenter(sAngle, Speed);
  }
  TiltRightDown(uAngle, Speed);
  digitalWrite(EnableServo,LOW);
}</pre>
Unfortunately I never got this working smoothly and the robot would jitter too much while walking due to the interrupts. Mutexs and Semaphores are tough to get right, I'd love to revisit this project at a later time (once I have a working 3D printer for body components again). Feel free to use this code (but not the name SimpleBiped) in your projects under a GNU/GPL liscence, or (and I would appreciate it), tell me where I went wrong with my mutexs!

If and when I do revisit this project I will definitely post further updates here.		