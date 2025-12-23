#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP32Servo.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend URLs
const char* sendDataURL = "http://localhost:3000/api/sensor-data/bulk";
const char* analyzeURL = "http://localhost:3000/api/sensors/analyze";

// Hardware IDs for violet sensors
const char* HUMIDITY_HW_ID = "HUM_001_A1B2";
const char* TEMP_AIR_HW_ID = "TEMP_001_C3D4";
const char* LIGHT_HW_ID = "LIGHT_001_E5F6";
const char* SOIL_MOISTURE_HW_ID = "HUM_002_G7H8";
const char* TEMP_SOIL_HW_ID = "TEMP_003_O5P6";

// Sensor IDs for violet (Plant 1)
const int HUMIDITY_SENSOR_ID = 1;
const int TEMP_AIR_SENSOR_ID = 2;
const int LIGHT_SENSOR_ID = 3;
const int SOIL_MOISTURE_SENSOR_ID = 4;
const int TEMP_SOIL_SENSOR_ID = 8;

// Pin definitions
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define SERVO_PIN 18
#define LDR_PIN 34
#define SOIL_MOISTURE_PIN 35
#define LED_RED_PIN 2
#define LED_GREEN_PIN 15
#define LED_BLUE_PIN 12

// Component initialization
DHT dht(DHT_PIN, DHT_TYPE);
Servo wateringServo;

// Global variables
unsigned long lastCycle = 0;
unsigned long cycleInterval = 30000; // 30 seconds for real backend
bool isWatering = false;
bool isLightingOn = false;
unsigned long wateringStartTime = 0;
unsigned long lightingStartTime = 0;

struct SensorReading {
  float airHumidity;
  float airTemperature;
  float soilTemperature;
  int lightLevel;
  int soilMoisture;
  bool isValid;
};

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("🌱 PlantCare IoT Client - Production Mode");
  
  // Initialize components
  dht.begin();
  wateringServo.attach(SERVO_PIN);
  
  // Initialize pins
  pinMode(LDR_PIN, INPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);
  
  wateringServo.write(0);
  setLEDStatus("connecting");
  
  connectToWiFi();
  
  Serial.println("✅ System ready - monitoring violet");
  setLEDStatus("ready");
}

void loop() {
  if (millis() - lastCycle >= cycleInterval) {
    performMonitoringCycle();
    lastCycle = millis();
  }
  
  handleActiveCommands();
  delay(100);
}

void performMonitoringCycle() {
  Serial.println("\n🔄 Monitoring violet...");
  setLEDStatus("reading");
  
  // Read sensors
  SensorReading reading = readAllSensors();
  
  if (!reading.isValid) {
    Serial.println("❌ Sensor reading failed");
    setLEDStatus("error");
    return;
  }
  
  // Send data to backend
  setLEDStatus("transmitting");
  if (!sendSensorDataToServer(reading)) {
    Serial.println("❌ Failed to send data");
    setLEDStatus("error");
    return;
  }
  
  // Request analysis
  if (requestAnalysisFromServer()) {
    setLEDStatus("ready");
  } else {
    setLEDStatus("error");
  }
}

SensorReading readAllSensors() {
  SensorReading reading;
  reading.isValid = true;
  
  // DHT22 sensor
  reading.airHumidity = dht.readHumidity();
  reading.airTemperature = dht.readTemperature();
  
  // Light sensor (with proper mapping)
  int rawLight = analogRead(LDR_PIN);
  reading.lightLevel = map(rawLight, 0, 4095, 0, 25000);
  
  // Soil moisture
  int rawSoil = analogRead(SOIL_MOISTURE_PIN);
  reading.soilMoisture = map(rawSoil, 0, 4095, 0, 100);
  
  // Soil temperature (default if sensor missing)
  reading.soilTemperature = 22.0;
  
  // Validation
  if (isnan(reading.airHumidity) || isnan(reading.airTemperature)) {
    reading.isValid = false;
  }
  
  Serial.printf("🌺 Фіалка: %.1f°C, %.1f%% RH, %d%% soil, %d lux\n", 
                reading.airTemperature, reading.airHumidity, 
                reading.soilMoisture, reading.lightLevel);
  
  return reading;
}

bool sendSensorDataToServer(SensorReading &reading) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(sendDataURL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000);
  
  // Create JSON payload
  StaticJsonDocument<1024> doc;
  JsonArray data = doc.createNestedArray("data");
  
  if (!isnan(reading.airHumidity)) {
    JsonObject humid = data.createNestedObject();
    humid["sensor_id"] = HUMIDITY_SENSOR_ID;
    humid["value"] = reading.airHumidity;
  }
  
  if (!isnan(reading.airTemperature)) {
    JsonObject temp = data.createNestedObject();
    temp["sensor_id"] = TEMP_AIR_SENSOR_ID;
    temp["value"] = reading.airTemperature;
  }
  
  JsonObject light = data.createNestedObject();
  light["sensor_id"] = LIGHT_SENSOR_ID;
  light["value"] = reading.lightLevel;
  
  JsonObject soil = data.createNestedObject();
  soil["sensor_id"] = SOIL_MOISTURE_SENSOR_ID;
  soil["value"] = reading.soilMoisture;
  
  JsonObject soilTemp = data.createNestedObject();
  soilTemp["sensor_id"] = TEMP_SOIL_SENSOR_ID;
  soilTemp["value"] = reading.soilTemperature;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send request
  int httpResponseCode = http.POST(jsonString);
  String response = http.getString();
  
  Serial.printf("📤 Data sent - Response: %d\n", httpResponseCode);
  
  bool success = (httpResponseCode == 200 || httpResponseCode == 201);
  http.end();
  return success;
}

bool requestAnalysisFromServer() {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(analyzeURL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(15000);
  
  // Create analysis request
  StaticJsonDocument<512> requestDoc;
  JsonArray hardwareIds = requestDoc.createNestedArray("hardware_ids");
  hardwareIds.add(HUMIDITY_HW_ID);
  hardwareIds.add(TEMP_AIR_HW_ID);
  hardwareIds.add(LIGHT_HW_ID);
  hardwareIds.add(SOIL_MOISTURE_HW_ID);
  hardwareIds.add(TEMP_SOIL_HW_ID);
  
  String requestJson;
  serializeJson(requestDoc, requestJson);
  
  // Send request
  int httpResponseCode = http.POST(requestJson);
  String response = http.getString();
  
  Serial.printf("🧠 Analysis response: %d\n", httpResponseCode);
  
  if (httpResponseCode == 200 || httpResponseCode == 201) {
    parseAndExecuteCommands(response);
    http.end();
    return true;
  }
  
  http.end();
  return false;
}

void parseAndExecuteCommands(String jsonResponse) {
  StaticJsonDocument<2048> doc;
  DeserializationError error = deserializeJson(doc, jsonResponse);
  
  if (error || !doc["success"]) {
    return;
  }
  
  // Show readable summary if available
  if (doc["data"]["iot_summary"]) {
    String summary = doc["data"]["iot_summary"];
    Serial.println("\n📋 === BACKEND ANALYSIS ===");
    Serial.println(summary);
    Serial.println("📋 === END ANALYSIS ===");
  }
  
  // Execute commands
  JsonArray results = doc["data"]["results"];
  for (JsonObject plant : results) {
    String plantName = plant["plant_name"];
    
    // Process only violet commands
    if (plantName != "Моя улюблена фіалка") continue;
    
    JsonArray recommendations = plant["recommendations"];
    for (JsonObject rec : recommendations) {
      String deviceType = rec["device_type"];
      String action = rec["action"];
      
      if (deviceType == "watering" && action == "start") {
        executeWateringCommand();
      } else if (deviceType == "lighting" && action == "start") {
        executeLightingCommand();
      }
      // heating and ventilation are console-only
    }
  }
}

void executeWateringCommand() {
  Serial.println("💧 Watering violet...");
  isWatering = true;
  wateringStartTime = millis();
  wateringServo.write(90);
  setLEDStatus("watering");
}

void executeLightingCommand() {
  Serial.println("💡 Extra lighting for violet...");
  isLightingOn = true;
  lightingStartTime = millis();
  setLEDStatus("lighting");
}

void handleActiveCommands() {
  // Handle watering timeout
  if (isWatering && (millis() - wateringStartTime >= 3000)) {
    wateringServo.write(0);
    isWatering = false;
    Serial.println("✅ Watering completed");
  }
  
  // Handle lighting timeout
  if (isLightingOn && (millis() - lightingStartTime >= 30000)) {
    isLightingOn = false;
    Serial.println("✅ Lighting completed");
  }
  
  // Return to ready state
  if (!isWatering && !isLightingOn) {
    setLEDStatus("ready");
  }
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("📶 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi failed!");
    setLEDStatus("error");
  }
}

void setLEDStatus(String status) {
  // Turn off all LEDs
  digitalWrite(LED_RED_PIN, LOW);
  digitalWrite(LED_GREEN_PIN, LOW);
  digitalWrite(LED_BLUE_PIN, LOW);
  
  if (status == "connecting") {
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, HIGH); // Yellow
  }
  else if (status == "ready") {
    digitalWrite(LED_GREEN_PIN, HIGH); // Green
  }
  else if (status == "reading") {
    digitalWrite(LED_BLUE_PIN, HIGH); // Blue
  }
  else if (status == "transmitting") {
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_BLUE_PIN, HIGH); // Purple
  }
  else if (status == "lighting") {
    // White light for grow lamp
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, HIGH);
    digitalWrite(LED_BLUE_PIN, HIGH);
  }
  else if (status == "error") {
    // Blink red
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_RED_PIN, HIGH);
      delay(200);
      digitalWrite(LED_RED_PIN, LOW);
      delay(200);
    }
  }
}