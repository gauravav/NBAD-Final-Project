package com.example.nbadbackend.Objects;

public class Budget {

    String documentId;

    String budgetName;

    int items;

    int totalBudget;


    Items itemList;

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public int getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(int totalBudget) {
        this.totalBudget = totalBudget;
    }

    public String getBudgetName() {
        return budgetName;
    }

    public void setBudgetName(String budgetName) {
        this.budgetName = budgetName;
    }

    public int getItems() {
        return items;
    }

    public void setItems(int items) {
        this.items = items;
    }

    public Items getItemList() {
        return itemList;
    }

    public void setItemList(Items itemList) {
        this.itemList = itemList;
    }

    @Override
    public String toString() {
        return "Budget{" +
                "budgetName='" + budgetName + '\'' +
                ", items=" + items +
                ", itemList=" + itemList +
                '}';
    }
}
