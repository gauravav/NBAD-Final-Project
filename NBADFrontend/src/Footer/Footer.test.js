import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
    it('renders the footer text', () => {
        const { getByText } = render(<Footer />);
        const footerText = getByText(/All rights reserved © Gaurav Avula/i);
        expect(footerText).toBeInTheDocument();
    });
});