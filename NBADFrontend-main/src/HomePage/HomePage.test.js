import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './HomePage';

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mocking the auth.currentUser
jest.mock('../firebaseConfig', () => ({
    auth: {
        currentUser: null,
    },
}));

describe('HomePage Component', () => {
    it('renders the correct text content', () => {
        render(<HomePage />);

        const mainHeaderText = screen.getByText('Master Your Finances with Personal Budget');
        const subHeaderText = screen.getByText('Take control of your financial life, create budgets, and track your expenses.');

        expect(mainHeaderText).toBeInTheDocument();
        expect(subHeaderText).toBeInTheDocument();
    });
});
