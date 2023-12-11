package com.example.nbadbackend;

import com.example.nbadbackend.Objects.Budget;
import com.example.nbadbackend.Objects.Budgets;
import com.example.nbadbackend.Objects.Item;
import com.example.nbadbackend.Objects.Items;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService {

    private Firestore firestore;
    Logger logger = org.apache.logging.log4j.LogManager.getLogger(FirestoreService.class);


    public Budgets getDataFromFirestore(String uid) throws InterruptedException, ExecutionException {
        firestore = FirestoreClient.getFirestore();
        // Reference to the Firestore collection
        CollectionReference collection = firestore.collection(uid);
        logger.info("collection: " + collection.toString());

        List<String> documentDataList = new ArrayList<>();

        Iterable<DocumentReference> documentReferences = collection.listDocuments();

        Budgets budgets = new Budgets();
        List<Budget> budgetList = new ArrayList<>();
        for (DocumentReference documentReference : documentReferences) {
            // Get the document data for each reference
            ApiFuture<DocumentSnapshot> future = documentReference.get();
            DocumentSnapshot documentSnapshot = future.get();
            if (documentSnapshot.exists()) {
                // Add document data to the list
                documentDataList.add(Objects.requireNonNull(documentSnapshot.getData()).toString());
                Budget budget = new Budget();
                budget.setDocumentId(documentSnapshot.getId());
                budget.setBudgetName(documentSnapshot.getString("budgetName"));
                budget.setItems(Integer.parseInt(String.valueOf(Objects.requireNonNull(documentSnapshot.getLong("items")))));
                budget.setTotalBudget(Integer.parseInt(String.valueOf(Objects.requireNonNull(documentSnapshot.getLong("totalBudget")))));


                //getItems
                CollectionReference collectionItems = documentReference.collection("items");
                Iterable<DocumentReference> documentReferencesItems = collectionItems.listDocuments();
                Items items = new Items();
                List<Item> itemList = new ArrayList<>();
                for (DocumentReference documentReferenceItem : documentReferencesItems) {
                    ApiFuture<DocumentSnapshot> futureItem = documentReferenceItem.get();
                    DocumentSnapshot documentSnapshotItem = futureItem.get();
                    if (documentSnapshotItem.exists()) {
                        logger.info("documentSnapshotItem: " + documentSnapshotItem.toString());
                        Item item = new Item();
                        item.setDocumentId(documentSnapshotItem.getId());
                        item.setItemName(documentSnapshotItem.getString("itemName"));
                        item.setItemValue(Integer.parseInt(String.valueOf(documentSnapshotItem.getLong("itemValue"))));
                        item.setItemColor(documentSnapshotItem.getString("itemColor"));
                        //Get variable itemDate which is timestamp in firestore
                        item.setDate(String.valueOf(documentSnapshotItem.getTimestamp("itemDate")));
                        logger.info("item: " + Objects.requireNonNull(item).toString());
                        itemList.add(item);
                    }
                }
                items.setItems(itemList);
                logger.info("items: " + Objects.requireNonNull(items).toString());
                budget.setItemList(items);
                budgetList.add(budget);
                logger.info("budget: " + Objects.requireNonNull(budget).toString());
            }
        }
        budgets.setBudgets(budgetList);
        logger.info("budgets: " + budgets.toString());
        return budgets;
    }

    public String addBudgetToFirestore(String uid, Budget budget) throws ExecutionException, InterruptedException {
        firestore = FirestoreClient.getFirestore();
        // Reference to the Firestore collection
        CollectionReference collection = firestore.collection(uid);
        logger.info("collection: " + collection.toString());

        DocumentReference documentReference = collection.document();
        logger.info("documentReference: " + documentReference.toString());

        budget.setDocumentId(documentReference.getId());
        logger.info("budget: " + budget.toString());

        // Add document data  with name and value using a hashmap and also a collection inside a document
        Map<Object, Object> map = new HashMap<>();
        map.put("budgetName", budget.getBudgetName());
        map.put("items", budget.getItems());
        map.put("totalBudget", budget.getTotalBudget());

        documentReference.set(map);
        return documentReference.getId();
    }

    public String addItem(String uid, String documentId, Item item) throws ExecutionException, InterruptedException {
        firestore = FirestoreClient.getFirestore();
        // Reference to the Firestore collection
        CollectionReference collection = firestore.collection(uid);
        logger.info("collection: " + collection.toString());

        DocumentReference documentReference = collection.document(documentId);
        logger.info("documentReference: " + documentReference.toString());

        //Also increase items field count by 1
        Budget budget = new Budget();
        DocumentSnapshot documentSnapshot = documentReference.get().get();
        budget.setItems(Integer.parseInt(String.valueOf(Objects.requireNonNull(documentSnapshot.getLong("items")))));
        budget.setItems(budget.getItems() + 1);
        documentReference.update("items", budget.getItems());


        CollectionReference collectionItems = documentReference.collection("items");
        logger.info("collectionItems: " + collectionItems.toString());

        DocumentReference documentReferenceItem = collectionItems.document();
        logger.info("documentReferenceItem: " + documentReferenceItem.toString());

        item.setDocumentId(documentReferenceItem.getId());
        logger.info("item: " + item.toString());

        Timestamp timestamp = null;

        // Convert date to Firestore Timestamp
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            simpleDateFormat.setTimeZone(TimeZone.getTimeZone("EST")); // Set timezone to EST
            Date date = simpleDateFormat.parse(item.getDate());
            timestamp = Timestamp.of(date);
        } catch (ParseException e) {
            logger.error("Error parsing date: " + e.getMessage());
        }


        // Add document data  with name and value using a hashmap and also a collection inside a document
        Map<Object, Object> map = new HashMap<>();
        map.put("itemName", item.getItemName());
        map.put("itemValue", item.getItemValue());
        map.put("itemColor", item.getItemColor());
        map.put("itemDate", timestamp);

        documentReferenceItem.set(map);
        //return document id of new added item
        return documentReferenceItem.getId();
    }


    public void deleteItem(String uid, String documentId, String itemDocumentId) throws ExecutionException, InterruptedException {
        firestore = FirestoreClient.getFirestore();
        // Reference to the Firestore collection
        CollectionReference collection = firestore.collection(uid);

        DocumentReference documentReference = collection.document(documentId);

        // Decrease items field count by 1
        Budget budget = new Budget();
        DocumentSnapshot documentSnapshot = documentReference.get().get();
        budget.setItems(Integer.parseInt(String.valueOf(Objects.requireNonNull(documentSnapshot.getLong("items")))));
        budget.setItems(budget.getItems() - 1);
        documentReference.update("items", budget.getItems());

        // Reference to the items sub-collection
        CollectionReference collectionItems = documentReference.collection("items");

        // Reference to the specific item document
        DocumentReference documentReferenceItem = collectionItems.document(itemDocumentId);

        // Delete the item document
        documentReferenceItem.delete();
    }


    public void deleteBudget(String uid, String budgetDocumentId) {
        firestore = FirestoreClient.getFirestore();
        // Reference to the Firestore collection
        CollectionReference collection = firestore.collection(uid);

        // Reference to the specific budget document
        DocumentReference documentReference = collection.document(budgetDocumentId);

        // Delete the budget document
        documentReference.delete();
    }

    public HashMap<Integer, int[]> getMonthsData(String uid) throws InterruptedException, ExecutionException {
        firestore = FirestoreClient.getFirestore();
        CollectionReference collection = firestore.collection(uid);
        List<String> documentDataList = new ArrayList<>();
        HashMap <Integer, int[]> monthsData = new HashMap<>();
        Iterable<DocumentReference> documentReferences = collection.listDocuments();
        Budgets budgets = new Budgets();
        List<Budget> budgetList = new ArrayList<>();
        for (DocumentReference documentReference : documentReferences) {
            // Get the document data for each reference
            ApiFuture<DocumentSnapshot> future = documentReference.get();
            DocumentSnapshot documentSnapshot = future.get();
            if (documentSnapshot.exists()) {
                // Add document data to the list
                documentDataList.add(Objects.requireNonNull(documentSnapshot.getData()).toString());

                CollectionReference collectionItems = documentReference.collection("items");
                Iterable<DocumentReference> documentReferencesItems = collectionItems.listDocuments();
                List<Item> itemList = new ArrayList<>();
                for (DocumentReference documentReferenceItem : documentReferencesItems) {
                    ApiFuture<DocumentSnapshot> futureItem = documentReferenceItem.get();
                    DocumentSnapshot documentSnapshotItem = futureItem.get();
                    if (documentSnapshotItem.exists()) {
                        String timeStamp = String.valueOf(documentSnapshotItem.getTimestamp("itemDate"));
                        int value = Integer.parseInt(String.valueOf(documentSnapshotItem.getLong("itemValue")));
                        String date = timeStamp.split("T")[0];
                        int year = Integer.parseInt(date.split("-")[0]);
                        int month = Integer.parseInt(date.split("-")[1]);
                        if(monthsData.containsKey(year))
                        {
                            int[] monthData = monthsData.get(year);
                            monthData[month-1] += value;
                            monthsData.put(year, monthData);
                        }
                        else
                        {
                            int[] monthData = new int[12];
                            monthData[month-1] = value;
                            monthsData.put(year, monthData);
                        }

                    }
                }
            }
        }
        budgets.setBudgets(budgetList);
        //log all values of hashmap
        for (Map.Entry<Integer, int[]> entry : monthsData.entrySet()) {
            logger.info("Key = " + entry.getKey() +
                    ", Value = " + Arrays.toString(entry.getValue()));
        }
        return monthsData;
    }

}

