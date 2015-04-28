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
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  FastLED.addLeds<WS2801, DATA_PIN_ART, CLOCK_PIN_ART, RGB>(leds_art, NUM_LEDS_ART);
   Serial.begin(9600); 
   for (int i=0; i < 5; i++){
     pinMode(buttons[i], INPUT);
     Serial.println(buttons[i]);
   }
   pinMode(buttonMisil, INPUT);

}


void loop() {
  //rainbow_fade();
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
  //intensidad();
  //rainbow_fade();
  
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
      Serial.print("el numero de boton:  ");
      Serial.println("Misil");
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
      Serial.println("Misil sin seguridad");
      delay(3000);
    }
  }
  lastButtonStateMisil = buttonStateMisil;
  if (buttonPushCounterMisil % 2 == 0) {
  } else {
  }
}  
  
void rainbow_fade() {                         //-m2-FADE ALL LEDS THROUGH HSV RAINBOW
    for(int i=0; i<25; i++) {
      ihue++;
      if (ihue > 255) {ihue = 0;}
      for(int idex = 0 ; idex < NUM_LEDS; idex++ ) {
        Serial.println(idex);
        leds[idex] = CHSV(ihue, 255, 255);
      }
      LEDS.show();    
      delay(40);
    }
}

void intensidad(){
  for(int i = 0; i < NUM_LEDS; i++) { 
    leds[i] = 0xFF0000;  
    FastLED.show();
  }
  delay(30);
}

  






