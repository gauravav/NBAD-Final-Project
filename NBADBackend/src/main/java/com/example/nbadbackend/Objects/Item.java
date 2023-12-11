package com.example.nbadbackend.Objects;

import com.google.cloud.Timestamp;

public class Item {

    String documentId;

    String itemName;

    int itemValue;

    String itemColor;

    String itemDate;

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getItemValue() {
        return itemValue;
    }

    public void setItemValue(int itemValue) {
        this.itemValue = itemValue;
    }

    public String getItemColor() {
        return itemColor;
    }

    public void setItemColor(String itemColor) {
        this.itemColor = itemColor;
    }

    public String getDate() {
        return itemDate;
    }

    public void setDate(String itemDate) {
        this.itemDate = itemDate;
    }

    @Override
    public String toString() {
        return "Item{" +
                "documentId='" + documentId + '\'' +
                ", itemName='" + itemName + '\'' +
                ", itemValue=" + itemValue +
                ", itemColor='" + itemColor + '\'' +
                ", itemDate='" + itemDate + '\'' +
                '}';
    }
}
