// https://docs.cypress.io/api/introduction/api.html

describe('Game Tests', () => {
  it('Creates a game properly with one player', () => {
    cy.visit('/');

    // Make sure clicking on the tabs goes to create game
    cy.get('.tabs')
      .find(' li')
      .last()
      .click();
    cy.contains('button', 'Create Game');

    // Create a game
    cy.get('#host-player-name-input').type('mort');
    cy.get('#host-avatar-select').select('1');

    cy.get('#create-game-button').click();

    cy.contains('#player-list .player-list-item', 'mort');

    //Start the game
    cy.get('#start-game-button').click();

    cy.url().should('include', '/game');

    // Click to add a card
    cy.wait(1000); // wait for firebase bindings

    cy.get('#turn-notification').should('exist');
    cy.get('#deck').click();
    cy.get('#drawn-cards svg').should('exist');
    cy.get('#history .list-item').should('exist');
  });
});
