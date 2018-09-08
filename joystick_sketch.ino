// Arduino pin numbers
const int SW_pin = 3; // digital pin connected to switch output
const int X_pin = A0; // analog pin connected to X output
const int Y_pin = A1; // analog pin connected to Y output

void setup() {
  pinMode(SW_pin, INPUT);
  digitalWrite(SW_pin, HIGH);
  Serial.begin(9600);
}

void loop() {
  
 // Serial.print("Switch:  ");
  
  int x = analogRead((X_pin));
  int y = analogRead((Y_pin));
  int b = digitalRead((SW_pin));
  int bVal = b*20000;
 // Serial.print(digitalRead(bVal));
  Serial.println(x+2000+bVal);
  //Serial.print("\n");
 // Serial.print("X-axis: ");
  //Serial.println((analogRead(X_pin)));
  //Serial.print("\n");
 // Serial.print("Y-axis: ");
//Serial.println(analogRead(Y_pin));
  
  delay(33);
}
