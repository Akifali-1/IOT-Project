#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>  // For JSON serialization

// Wi-Fi and WebSocket server details
const char* ssid = "rayyan";                // Replace with your WiFi SSID
const char* password = "rayyan142";        // Replace with your WiFi password
const char* websocketServer = "192.168.113.152";   // Replace with your WebSocket server address
const int websocketPort = 5001;               // Replace with your WebSocket server port

// Pins for controlling devices
int POWER = D2;
int TEMPINC = D1;
int TEMPDEC = D0;

  // Temperature decrement pin

// Variables
int temp = 24;  // Initial temperature value
WebSocketsClient webSocket;

void setup() {
    // Initialize serial monitor
    Serial.begin(115200);

    // Setup pins
    pinMode(POWER, OUTPUT);
    pinMode(TEMPINC, OUTPUT);
    pinMode(TEMPDEC, OUTPUT);

    // Start with pins low
    digitalWrite(POWER, LOW);
    digitalWrite(TEMPINC, LOW);
    digitalWrite(TEMPDEC, LOW);

    // Connect to Wi-Fi
    Serial.print("Connecting to Wi-Fi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWi-Fi connected!");
    Serial.println("IP Address: " + WiFi.localIP().toString());

    // Connect to WebSocket server
    Serial.println("Connecting to WebSocket server...");
    webSocket.begin(websocketServer, websocketPort, "/");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);  // Retry connection every 5 seconds if disconnected
}

void loop() {
    webSocket.loop(); // Keep WebSocket connection alive
}

// WebSocket event handler
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
    if (type == WStype_CONNECTED) {
        Serial.println("Connected to WebSocket server!");
    } else if (type == WStype_DISCONNECTED) {
        Serial.println("Disconnected from WebSocket server!");
    } else if (type == WStype_TEXT) {
        String message = String((char*)payload);
        Serial.println("Message received: " + message);

        // Handle incoming commands (if needed)
        processWebSocketMessage(message);
    }
}

void processWebSocketMessage(const String &message) {
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error) {
        Serial.print("JSON parse error: ");
        Serial.println(error.c_str());
        return;
    }

    // Parse the command and status from the received JSON message
    if (doc.containsKey("status")) {
        const char* status = doc["status"];
        if (strcmp(status, "on") == 0) {
            Serial.println("Turning AC ON");
            digitalWrite(POWER, HIGH);  // Simulate turning the AC ON
            delay(1000);
            digitalWrite(POWER, LOW);  // Reset the POWER pin
        }
    }

    if (doc.containsKey("control")) {
        const char* control = doc["control"];
        if (strcmp(control, "+") == 0) {
            increaseTemperature();
        } else if (strcmp(control, "-") == 0) {
            decreaseTemperature();
        }
    }
}

// Send temperature update to WebSocket server
// void sendTemperatureUpdate() {
//     if (webSocket.isConnected()) {
//         StaticJsonDocument<200> doc;
//         doc["room"] = "bedroom";
//         doc["control"] = temp;

//         String message;
//         serializeJson(doc, message);
//         webSocket.sendTXT(message);
//         Serial.println("Temperature update sent: " + message);
//     } else {
//         Serial.println("WebSocket not connected. Cannot send temperature update.");
//     }
// }

// Control functions
void togglePower() {
    Serial.println("Power toggled.");
    digitalWrite(POWER, HIGH);
    delay(1000);
    digitalWrite(POWER, LOW);
}

void increaseTemperature() {
   Serial.println("Increased");
    digitalWrite(TEMPINC, HIGH);
    delay(1000);
    digitalWrite(TEMPINC, LOW);}

void decreaseTemperature() {
   Serial.println("Decreased");
    digitalWrite(TEMPDEC, HIGH);
    delay(1000);
    digitalWrite(TEMPDEC, LOW);
}