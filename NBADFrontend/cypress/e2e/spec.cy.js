// cypress/integration/HomePage.spec.cy.js
describe('HomePage Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should display the homepage content', () => {
    cy.get('.homepage').should('exist');
    cy.get('.hero-content').should('exist');
    cy.contains('Master Your Finances with Personal Budget');
  });

  it('should navigate to signup page when Sign Up button is clicked', () => {
    cy.get('.cta-button').contains('Sign Up').click();
    cy.url().should('include', '/signup');
  });

  // navigate to login and enter credentials
  it('should navigate to login page when Login button is clicked', () => {
    cy.get('.right-links').contains('Login').click();
    cy.url().should('include', '/login');
    });


    it('should navigate to login page when Login button is clicked', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('#email').type('gavula@uncc.edu');
      cy.get('#password').type('gaurav11596');
      cy.get('.login-form button').click();
      cy.url().should('include', '/myDashboard');
    });

    it('should navigate to charts page when Charts button is clicked', () => {
        cy.get('.left-links').contains('Charts').click();
        cy.url().should('include', '/monthly');
    });

    it('should click sign out button and navigate to home page', () => {
      cy.get('.dropdown-toggle').click();
      cy.contains('.dropdown-menu li', 'Sign Out').click();
      cy.url().should('eq', 'http://localhost:3000/');
    });
});
