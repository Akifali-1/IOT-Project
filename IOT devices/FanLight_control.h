#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>  // Include the ArduinoJson library

const char* ssid = "rayyan";
const char* password = "rayyan142";

WebSocketsClient webSocket;
const int ledPin = 5;
const int fanPin = 2;

void setup() {
  Serial.begin(115200);

  // Initialize pins
  pinMode(ledPin, OUTPUT);
  pinMode(fanPin, OUTPUT);

  // Turn off LED and Fan initially
  digitalWrite(ledPin, LOW);
  analogWrite(fanPin, 0); // Set fan speed to 0

  Serial.println("LED and Fan initially OFF");

  // Connect to WiFi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Connect to WebSocket server
  Serial.println("Connecting to WebSocket server...");
  webSocket.begin("192.168.113.152", 5001, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);  // Retry every 5 seconds if disconnected
}

void loop() {
  webSocket.loop();
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_TEXT) {
    String message = String((char*)payload);
    Serial.print("Received message: ");
    Serial.println(message);  // Print the message content

    // Create a JSON document and parse the message
    StaticJsonDocument<200> doc;  // Adjust size as needed
    DeserializationError error = deserializeJson(doc, message);

    if (error) {
      Serial.print("Failed to parse JSON: ");
      Serial.println(error.c_str());
      return;
    }

    // Extract device, status, and room from the JSON document
    const char* device = doc["device"];  // Get device
    const char* status = doc["status"];  // Get status
    const char* room = doc["room"];      // Get room

    // Check if the device is "light" and room is "livingroom" and toggle LED based on status
    if (strcmp(device, "light") == 0 && strcmp(room, "livingroom") == 0) {
      if (strcmp(status, "on") == 0) {
        digitalWrite(ledPin, LOW);
        Serial.println("livingroom light turned ON");
      } else if (strcmp(status, "off") == 0) {
        digitalWrite(ledPin, HIGH);
        Serial.println("livingroom light turned OFF");
      } else {
        Serial.println("Unknown status received");  // Handle unexpected status
      }
    } 
    // Check if the device is "fan" and room is "livingroom" and adjust Fan based on status
    else if (strcmp(device, "fan") == 0 && strcmp(room, "livingroom") == 0) {
      
      int fanSpeed = 0;
      if (strcmp(status, "1") == 0) {
        fanSpeed = 50;
      } else if (strcmp(status, "2") == 0) {
        fanSpeed = 100;
      } else if (strcmp(status, "3") == 0) {
        fanSpeed = 150;
      } else if (strcmp(status, "4") == 0) {
        fanSpeed = 200;
      } else if (strcmp(status, "5") == 0) {
        fanSpeed = 250;
      }
      else if (strcmp(status, "on") == 0) {
        fanSpeed = 250;
        Serial.println("livingroom fan turned OFF");
      }
       else if (strcmp(status, "off") == 0) {
        fanSpeed = 0;
        Serial.println("livingroom fan turned OFF");
      } else {
        Serial.println("Unknown fan status received");  // Handle unexpected status
        return;
      }

      analogWrite(fanPin, fanSpeed);
      if (fanSpeed > 0) {
        Serial.print("livingroom fan speed set to: ");
        Serial.println(fanSpeed);
      }
    } else {
      Serial.println("Unknown device or room received");  // Handle unexpected device or room
    }
  } else if (type == WStype_DISCONNECTED) {
    Serial.println("Disconnected from WebSocket server");
  } else if (type == WStype_CONNECTED) {
    Serial.println("Connected to WebSocket server");
  }
}