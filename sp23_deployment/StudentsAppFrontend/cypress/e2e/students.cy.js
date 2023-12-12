describe('our first E2E test', () => {
  it('Testing login flow', () => {
    // open the app
    cy.visit('http://localhost:3000')
    // query the DOM
    // select a DOM element by role and its text content
    cy.get('button').contains('Login')
    // select a DOM element by id
    // cy.get('#root')
    // select the input, and type some text in it
    cy.get('input').type('Faith')
    cy.get('input').should('have.value', 'Faith')
    // trigger event
    cy.get('button').click()
    // we are at the end of the login flow
    cy.get('button').contains('Logout')
  })

  it('add a student flow', () => {
    cy.visit('http://localhost:3000')
    cy.get('input').type('Faith')
    cy.get('button').click()
    // add a new student
    //cy.get('#name').type('Matt')
    //cy.get('#email').type('Matt@matt.edu')
    //cy.get('#major').type('Music')
    //cy.get('#new').click()
    cy.get('table').contains('Matt')

  })
})