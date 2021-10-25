describe('Tests the weather app', () => {
    it('Visits the app and checks the temperature in Douala', () => {
      cy.visit('http://localhost:8000');
      cy.get('#btn1').contains('Get Weather');
      cy.get('#city').type('Douala').should('have.value', 'Douala');
      cy.get('#btn1').click();
      cy.get('#data').contains('88.7');
    })
  })
  
