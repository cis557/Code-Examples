describe('Test that we can create a new student', () => {
  it('passes if we can login and create a new student', () => {
    // launch the web app
    cy.visit('http://localhost:3000')
    // check that the button with caption 'login' is displayed
    cy.get('button').contains('login')
    // click on the login button
    cy.get('button').click()
    // test that the 'Create Student' button is visible
    cy.get('button').contains('Create Student')

    // create a new student
    // type the name of the student
    // test that the input box is updated correctly
    cy.get('#name').type('Francis1').should('have.value', 'Francis1')

    // type the email of the student
    // test that the input box is updated correctly
    cy.get('#email').type('f@upenn.edu').should('have.value', 'f@upenn.edu')

    // type the major of the student
    // test that the input box is updated correctly
    cy.get('#major').type('dance').should('have.value', 'dance')

    // click on the login button
    cy.contains('Create Student').click()
    // test that an element with id the name of the new student is displayed
    cy.get('#Francis1').contains('Francis1')

  })
})