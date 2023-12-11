package com.example.nbadbackend;


import com.example.nbadbackend.Objects.Budget;
import com.example.nbadbackend.Objects.Budgets;
import com.example.nbadbackend.Objects.Item;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.apache.http.protocol.HTTP;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.cloud.firestore.Firestore;
import org.springframework.http.MediaType;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.zip.GZIPOutputStream;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://138.197.53.171:3000")
@RequestMapping("/data")
public class DataController {


    FirestoreService firestoreService = new FirestoreService();;
    Logger logger = org.apache.logging.log4j.LogManager.getLogger(DataController.class);

    @PostMapping("/getAllBudgets")
    public ResponseEntity<byte[]> getAllBudgets(@RequestBody Map<String, String> payload,
                                                HttpServletResponse response) throws IOException, ExecutionException, InterruptedException, FirebaseAuthException {
        try {

            String token = payload.get("token");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();
        logger.info("uid: " + uid);

        Budgets budgets = firestoreService.getDataFromFirestore(uid);
        firestoreService.getMonthsData(uid);
        logger.info("budgets: " + budgets.toString());

        byte[] compressedData = compressData(budgets); // Compress the data

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);

        } catch (FirebaseAuthException | IOException | ExecutionException | InterruptedException e) {
            logger.error("Error getting all budgets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }

    }

    @PostMapping("/getMonthsData")
    public ResponseEntity<byte[]> getMonthsData(@RequestBody Map<String, String> payload,
                                                HttpServletResponse response) throws IOException, ExecutionException, InterruptedException, FirebaseAuthException {
        try {

            String token = payload.get("token");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();
        logger.info("uid: " + uid);

        HashMap<Integer, int[]> map = firestoreService.getMonthsData(uid);

        byte[] compressedData = compressData(map); // Compress the data

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
        headers.setContentType(MediaType.TEXT_PLAIN);

            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
        } catch (FirebaseAuthException | IOException | ExecutionException | InterruptedException e) {
            logger.error("Error getting months data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }




    // Helper method to compress data using Gzip
    private byte[] compressData(Object data) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (GZIPOutputStream gzipOutputStream = new GZIPOutputStream(byteArrayOutputStream)) {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(gzipOutputStream, data);
        }
        return byteArrayOutputStream.toByteArray();
    }


    @PostMapping("/addBudget")
    public ResponseEntity<byte[]> addBudget(@RequestBody Map<String, String> payload) throws ExecutionException, InterruptedException, IOException {
        try {

            String token = payload.get("token");
        FirebaseToken decodedToken = null;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
        String uid = decodedToken.getUid();
        logger.info("uid: " + uid);
        String budgetName = payload.get("budgetName");
        int budgetTotal = Integer.parseInt(payload.get("totalBudget"));
        Budget budget = new Budget();
        budget.setBudgetName(budgetName);
        budget.setItems(0);

        budget.setTotalBudget(budgetTotal);
        budget.setDocumentId(firestoreService.addBudgetToFirestore(uid, budget));

        byte[] compressedData = compressData(budget); // Compress the data

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
        headers.setContentType(MediaType.APPLICATION_JSON);

            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
        } catch (IOException | ExecutionException | InterruptedException e) {
            logger.error("Error adding budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }

    @PostMapping("/addItem")
    public ResponseEntity<byte[]> addItem(@RequestBody Map<String, String> payload,
                                          HttpServletResponse response) throws ExecutionException, InterruptedException, IOException, FirebaseAuthException {
        try {

            String token = payload.get("token");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();
        logger.info("uid for adding item: " + uid);
        String budgetId = payload.get("budgetId");

        Item item = new Item();
        item.setItemName(payload.get("itemName"));
        String value = payload.get("itemValue");
        item.setDate(payload.get("date"));

        double doubleValue = Double.parseDouble(value);

        int roundedValue;
        if (doubleValue % 1 == 0) {
            // The value is an integer
            roundedValue = (int) doubleValue;
        } else {
            // The value is a decimal, round it to the nearest integer
            roundedValue = (int) Math.round(doubleValue);
        }



        item.setItemValue(roundedValue);
        item.setItemColor(payload.get("itemColor"));

        String documentId = firestoreService.addItem(uid, budgetId, item);
        item.setDocumentId(documentId);

        byte[] compressedData = compressData(item); // Compress the item data

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
        headers.setContentType(MediaType.APPLICATION_JSON);

            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
        } catch (FirebaseAuthException | IOException | ExecutionException | InterruptedException e) {
            logger.error("Error adding item", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }

    }

    @PostMapping("/deleteItem")
    public ResponseEntity<byte[]> deleteItem(@RequestBody Map<String, String> payload,
                                             HttpServletResponse response) throws ExecutionException, InterruptedException, FirebaseAuthException, IOException {
        try {

            String token = payload.get("token");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();
        logger.info("uid for deleting item: " + uid);
        String budgetId = payload.get("budgetId");
        String itemDocumentId = payload.get("itemDocumentId"); // The unique ID of the item to be deleted

        firestoreService.deleteItem(uid, budgetId, itemDocumentId);

        String successMessage = "Item Deleted Successfully";

        byte[] compressedData = compressData(successMessage); // Compress the response message

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
        headers.setContentType(MediaType.TEXT_PLAIN);

            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
        } catch (FirebaseAuthException | IOException | ExecutionException | InterruptedException e) {
            logger.error("Error deleting item", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }

    }


    @PostMapping("/deleteBudget")
    public ResponseEntity<byte[]> deleteBudget(@RequestBody Map<String, String> payload) throws ExecutionException, InterruptedException, FirebaseAuthException, IOException {
        try {

            String token = payload.get("token");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();
        logger.info("uid for deleting budget: " + uid);

        String budgetDocumentId = payload.get("budgetDocumentId"); // The unique ID of the budget to be deleted
        firestoreService.deleteBudget(uid, budgetDocumentId);

        // Create a compressed response with a success message
        String successMessage = "Budget Deleted Successfully";
        byte[] compressedData = compressData(successMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_ENCODING, "gzip");
        headers.setContentType(MediaType.TEXT_PLAIN);

            return new ResponseEntity<>(compressedData, headers, HttpStatus.OK);
        } catch (FirebaseAuthException | IOException e) {
            logger.error("Error deleting budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }

}
