package com.example.nbadbackend.Objects;

import java.util.ArrayList;
import java.util.List;

public class Items {


    List<Item> items;

    public Items() {
        items = new ArrayList<>();
    }


    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "Items{" +
                "items=" + items +
                '}';
    }
}
