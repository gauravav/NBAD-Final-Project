package com.example.nbadbackend.Objects;

import java.util.List;

public class Budgets {

    List<Budget> budgets;

    public List<Budget> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<Budget> budgets) {
        this.budgets = budgets;
    }

    @Override
    public String toString() {
        return "Budgets{" +
                "budgets=" + budgets +
                '}';
    }
}
