#include <WiFi.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <WiFiClient.h>
#include <Wire.h>


#define DHTPIN 25 
#define DHTTYPE DHT11
#define LED1 26
#define LED2 27
#define Light 33

//Connect WiFi
const char* id = "nam";
const char* pass = "66666666";

//Connect MQTT
const char* mqttsever = "mqtt.wuys.me";
const char* usermqtt = "ntn";
const char* passmqtt = "12345678";
const char*clientID="esp32";
int portmqtt =  1883;

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espclient;
PubSubClient client(espclient);

void setup_WiFi() {
  Serial.printf("Connecting..");
  Serial.printf(id);
  WiFi.mode(WIFI_STA);
  WiFi.begin(id, pass);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("");
  Serial.println("WiFi Connected");
  Serial.println("IP Aaddress: ");
  Serial.println(WiFi.localIP());
}

void connect() {
  while (!client.connected()) {
    Serial.print("Connecting MQTT...");
    if (client.connect(clientID, usermqtt, passmqtt)) {
      Serial.println("Connected");
      //đăng kí nhận dữ liệu từ topic
      client.subscribe("DEVICE1");
      Serial.println("Connect client DEVICE1");
      client.subscribe("DEVICE2");
      Serial.println("Connect client DEVICE2");
    } else {
      Serial.print("Failed");
      Serial.println("Try again in 3s");
      delay(3000);
    }
  }
}


void setup() {
  delay(500);
  Serial.begin(115200);
  delay(500);
  setup_WiFi();
  Wire.begin ();
  dht.begin();
  
  client.setServer(mqttsever, portmqtt);
  client.setCallback(callback);

  pinMode(LED1, OUTPUT);
  digitalWrite(LED1, HIGH);
  pinMode(LED2, OUTPUT);
  digitalWrite(LED2, HIGH);
}
void callback(char * topic, byte * payload, unsigned int length)
{
 if(strcmp(topic , "DEVICE1")==0)
 {
    if((char)payload[0]=='0')
    {
      Serial.println("LED1 ON");
      digitalWrite(LED1, LOW);
      }
     else {
      Serial.println("LED1 OFF");
      digitalWrite(LED1, HIGH);
      }
   }
 if(strcmp(topic , "DEVICE2")==0)
 {
    if((char)payload[0]=='0')
    {
      Serial.println("LED2 ON");
      digitalWrite(LED2, LOW);
      }
      else {
      Serial.println("LED2 OFF");
      digitalWrite(LED2, HIGH);
      }
    } 
}

long lastMsg = 0;
void loop() {
  if (!client.connected()) {
    connect();
  }
  client.loop();

  unsigned long now = millis();
  if(now - lastMsg >5000){
  // Read Đata
  int h = dht.readHumidity();
  int t = dht.readTemperature();
  int l = analogRead(Light);
  int f = dht.readTemperature(true);
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.println("%");
  Serial.print(F("Temperature: "));
  Serial.print(t);
  Serial.println("°C");
  Serial.print("Light: ");
  Serial.print(l);
  Serial.println(" lux");
  //Ket hop Data
  String Data = String(t) +","+ String(h) + "," + String(l);
  client.publish("sensors", Data.c_str());
  Serial.print("Pushed Data: ");
  Serial.println(Data);
  lastMsg = now;

 }
}
