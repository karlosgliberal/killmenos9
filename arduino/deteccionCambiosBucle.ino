#include "FastLED.h"

#define NUM_LEDS 25
#define DATA_PIN 10
#define NUM_LEDS_ART 5
#define DATA_PIN_ART 2 //amarillo
#define CLOCK_PIN_ART 3 //verde

int ihue = 0;
CRGB leds[NUM_LEDS];
CRGB leds_art[NUM_LEDS_ART];
const int  buttonPin = 6;
byte buttons[] = {4, 5, 6, 7, 8};
byte buttonMisil = 9;

bool pulsado = false;

int buttonPushCounter[] = {0, 0, 0, 0, 0};
int buttonState[]       = {0, 0, 0, 0, 0};
int lastButtonState[]   = {0, 0, 0, 0, 0};

int buttonPushCounterMisil = 0;
int buttonStateMisil       = 0;
int lastButtonStateMisil   = 0;

void setup() {
  delay(2000);
  FastLED.addLeds<WS2801, DATA_PIN_ART, CLOCK_PIN_ART, RGB>(leds_art, NUM_LEDS_ART);
   Serial.begin(9600);
   for (int i=0; i < 5; i++){
     pinMode(buttons[i], INPUT);
     Serial.println(buttons[i]);
   }
   pinMode(buttonMisil, INPUT);
}


void loop() {
  for (int i=0; i < 5; i++){
    buttonState[i] = digitalRead(buttons[i]);
  }
  buttonStateMisil = digitalRead(buttonMisil);
  botones(0);
  botones(1);
  botones(2);
  botones(3);
  botones(4);
  misil();
}


void botones(int i) {
  if (buttonState[i] != lastButtonState[i]) {
    if (buttonState[i] == HIGH) {
      buttonPushCounter[i]++;
      Serial.println("on");
      Serial.print("number of button pushes:  ");
      Serial.println(buttonPushCounter[i]);
      Serial.print("el numero de boton:  ");
      Serial.println(i);
    }
    else {
      Serial.println("off");
    }
  }
  lastButtonState[i] = buttonState[i];
  if (buttonPushCounter[i] % 2 == 0) {
    leds_art[i] = 0x006400;
    leds_art[i].fadeLightBy( 64 );
    LEDS.show();
  } else {
    leds_art[i] = 0xFF0000;
    leds_art[i].fadeLightBy( 64 );
    LEDS.show();
  }
}

//Boton misil
void misil() {
  for (int i=0; i < 5; i++){
   if(buttonPushCounter[i] != 0){
     pulsado = true;
   }
  }
  if (buttonStateMisil != lastButtonStateMisil) {
    if (buttonStateMisil == HIGH && pulsado == false) {
      buttonPushCounterMisil++;
      Serial.println("Poner seguridad");
      leds_art[0] = 0x000000;
      LEDS.show();
      delay(400);
      leds_art[1] = 0x000000;
      LEDS.show();
      delay(400);
      leds_art[2] = 0x000000;
      LEDS.show();
      delay(400);
      leds_art[3] = 0x000000;
      LEDS.show();
      delay(400);
      leds_art[4] = 0x000000;
      LEDS.show();
      delay(400);
      asm volatile ("  jmp 0");
    }
    else {
      Serial.print("el numero de boton:  ");
      Serial.println("Misil");
      delay(3000);
    }
  }
  lastButtonStateMisil = buttonStateMisil;
  if (buttonPushCounterMisil % 2 == 0) {
  } else {
  }
}
