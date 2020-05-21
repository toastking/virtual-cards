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

  it('Players can join an in progress game', () => {
    cy.visit('/');

    // Make sure clicking on the tabs goes to create game
    cy.get('.tabs')
      .find(' li')
      .last()
      .click();
    // Create a game
    cy.get('#host-player-name-input').type('mort');
    cy.get('#host-avatar-select').select('1');
    cy.get('#create-game-button').click();

    cy.url().should('include', '/lobby');

    cy.url().then(url => {
      const gameId = url.split('/').slice(-1)[0];
      cy.visit(`/#/start/${gameId}`);
      cy.get('#game-field').should('have.value', gameId);
    });

    // Join the game
    cy.get('#player-name-input').type('kev');
    cy.get('#player-avatar-select').select('3');

    cy.get('#join-game-button').click();

    cy.url().should('include', '/lobby');

    //Start the game
    cy.get('#start-game-button').click();

    cy.url().should('include', '/game');

    cy.get('#deck').should('exist');
  });
});
