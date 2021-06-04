/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000')
  });
  describe('testing tasks', ()=>{
    it('adding a task', () => {
      //type without input
      cy.get('input')
        .type('testando 123..', {delay: 100})
        .should('value', 'testando 123..');
      //add task
      cy.get('#add')
        .click()
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All (1)')
      cy.get('#completed')
        .should('contain', 'Completed')
      cy.get('#incomplete')
        .should('contain', 'Incomplete (1)')
      //mark task complete
      cy.get('#complete0')
        .click()
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All (1)')
      cy.get('#completed')
        .should('contain', 'Completed (1)')
      cy.get('#incomplete')
        .should('contain', 'Incomplete')
       //remove task
       cy.get('#remove0')
        .click()
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All')
      cy.get('#completed')
        .should('contain', 'Completed')
      cy.get('#incomplete')
        .should('contain', 'Incomplete', {delay: 1000})
    });
    it('adicionando varias tarefas', () => {
      //type in input
      cy.get('input')
        .type('task 123..', {delay: 100})
        .should('value', 'task 123..');
      //add to 1 task a 1 tarefa
      cy.get('#add')
        .click()

      //type in input
      cy.get('input')
        .type('task 123..', {delay: 100})
        .should('value', 'task 123..');
      //add to 1 task a 2 tarefa
      cy.get('#add')
        .click()
      
      //type in input
      cy.get('input')
        .type('task 123..', {delay: 100})
        .should('value', 'task 123..');
      //add to 1 task a 3 tarefa
      cy.get('#add')
        .click()
      
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All (3)')
      cy.get('#completed')
        .should('contain', 'Completed')
      cy.get('#incomplete')
        .should('contain', 'Incomplete (3)')
      //marca a 1 tarefa como completa
      cy.get('#complete0')
        .click()
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All (3)')
      cy.get('#completed')
        .should('contain', 'Completed (1)')
      cy.get('#incomplete')
        .should('contain', 'Incomplete (2)')
       //remove a 1 tarefa
       cy.get('#remove0')
        .click()
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All (2)')
      cy.get('#completed')
        .should('contain', 'Completed')
      cy.get('#incomplete')
        .should('contain', 'Incomplete (2)')
    });
    it('Testando os filtros', () => {
      //type in input
      cy.get('input')
        .type('task 1', {delay: 100})
        .should('value', 'task 1');
      //add to 1 task
      cy.get('#add')
        .click()

      //type in input
      cy.get('input')
        .type('task 2', {delay: 100})
        .should('value', 'task 2');
      //add to 2 task
      cy.get('#add')
        .click()

      //type in input
      cy.get('input')
        .type('task 3', {delay: 100})
        .should('value', 'task 3');
      //add to 3 task
      cy.get('#add')
        .click()
        
      //mark 1 task as complete
      cy.get('#complete0')
        .click()
      //check the counter on the buttons
      cy.get('#all')
        .should('contain', 'All (3)')
      cy.get('#completed')
        .should('contain', 'Completed (1)')
      cy.get('#incomplete')
        .should('contain', 'Incomplete (2)')
      
      //check the filters
      //completed
      cy.get('#completed')
        .click()
      cy.get('.tasks')
        .find('.task').should('have.length', 1);

      //incomplete
      cy.get('#incomplete')
        .click()
      cy.get('.tasks')
        .find('.task').should('have.length', 2);

      //all
      cy.get('#all')
        .click()
      cy.get('.tasks')
        .find('.task').should('have.length', 3);
    });
  });
});