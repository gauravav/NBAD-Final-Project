package com.example.nbadbackend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

@RestController
@CrossOrigin(origins = "http://138.197.53.171:3000")
@RequestMapping("/auth")
public class AuthController {

    Logger logger = org.apache.logging.log4j.LogManager.getLogger(AuthController.class);

//    private static final String FIREBASE_AUTH_SIGN_UP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + FIREBASE_API_KEY;

    @PostMapping("checkToken")
    public ResponseEntity<byte[]> checkToken(@RequestBody Map<String, String> payload) {
        try {
            String token = payload.get("token");
            logger.info("token: " + token);

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            // Access user information in decodedToken
            String uid = decodedToken.getUid();
            logger.info("uid: " + uid);

            // Create a Map to hold the response data
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("uid", uid);
            responseMap.put("name", decodedToken.getName());

            // Convert the Map to a JSON string
            String jsonResponse = convertMapToJson(responseMap);

            // Compress the JSON string
            byte[] compressedData = compressData(jsonResponse);

            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Send the compressed response with a 200 OK status
            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
        } catch (FirebaseAuthException e) {
            // Handle authentication failure with a 401 Unauthorized status
            logger.error("Authentication failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new byte[0]);
        } catch (IOException e) {
            // Handle other exceptions with a 500 Internal Server Error status
            logger.error("Internal server error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }

//    @PostMapping("getUID")
//    public ResponseEntity<byte[]> getUID(@RequestBody Map<String, String> payload) {
//        try {
//            String token = payload.get("token");
//            logger.info("token: " + token);
//
//            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
//            // Access user information in decodedToken
//            String uid = decodedToken.getUid();
//            logger.info("uid: " + uid);
//
//            // Create a Map to hold the response data
//            Map<String, String> responseMap = new HashMap<>();
//            responseMap.put("uid", uid);
//            responseMap.put("name", decodedToken.getName());
//
//            // Convert the Map to a JSON string
//            String jsonResponse = convertMapToJson(responseMap);
//
//            // Compress the JSON string
//            byte[] compressedData = compressData(jsonResponse);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            // Send the compressed response with a 200 OK status
//            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
//        } catch (FirebaseAuthException e) {
//            // Handle authentication failure with a 401 Unauthorized status
//            logger.error("Authentication failed", e);
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new byte[0]);
//        } catch (IOException e) {
//            // Handle other exceptions with a 500 Internal Server Error status
//            logger.error("Internal server error", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
//        }
//    }

    // Helper method to convert a Map to a JSON string
    private String convertMapToJson(Map<String, String> map) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(map);
    }

    // Helper method to compress data using Gzip
    private byte[] compressData(String data) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (GZIPOutputStream gzipOutputStream = new GZIPOutputStream(byteArrayOutputStream)) {
            gzipOutputStream.write(data.getBytes());
        }

        return byteArrayOutputStream.toByteArray();
    }

//    @PostMapping("getToken")
//    public ResponseEntity<byte[]> getToken(@RequestBody Map<String, String> payload) {
//        try {
//            String email = payload.get("email");
//            String password = payload.get("password");
//            logger.info("email: " + email);
//            logger.info("password: " + password);
//
//            String token = generateFirebaseToken(email, password);
//            logger.info("token: " + token);
//
//            // Create a Map to hold the response data
//            Map<String, String> responseMap = new HashMap<>();
//            responseMap.put("token", token);
//
//            // Convert the Map to a JSON string
//            String jsonResponse = convertMapToJson(responseMap);
//
//            // Compress the JSON string
//            byte[] compressedData = compressData(jsonResponse);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            // Send the compressed response with a 200 OK status
//            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
//        } catch (IOException e) {
//            // Handle other exceptions with a 500 Internal Server Error status
//            logger.error("Internal server error", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
//        }
//    }

//    private static String generateFirebaseToken(String email, String password) throws IOException {
//        URL url = new URL(FIREBASE_AUTH_SIGN_UP_URL);
//        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//        connection.setRequestMethod("POST");
//        connection.setRequestProperty("Content-Type", "application/json");
//        connection.setDoOutput(true);
//
//        // Build the JSON payload
//        String payload = String.format("{\"email\":\"%s\",\"password\":\"%s\",\"returnSecureToken\":true}", email, password);
//
//        // Write the payload to the request
//        try (OutputStream os = connection.getOutputStream()) {
//            byte[] input = payload.getBytes("utf-8");
//            os.write(input, 0, input.length);
//        }
//
//        // Read the response from the Firebase Authentication API
//        try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
//            StringBuilder response = new StringBuilder();
//            String responseLine;
//            while ((responseLine = br.readLine()) != null) {
//                response.append(responseLine.trim());
//            }
//
//            // Parse the JSON response using Jackson
//            ObjectMapper objectMapper = new ObjectMapper();
//            JsonNode rootNode = objectMapper.readTree(response.toString());
//            String idToken = rootNode.path("idToken").asText();
//
//            return idToken;
//        } finally {
//            connection.disconnect();
//        }
//    }





}

