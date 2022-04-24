import {interceptApiV1Request} from "../../../common";

describe('Formations page', () => {
  it('should be on formations page', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="formations tab"]')
      .click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    cy.get('[aria-labelledby="formations content"]').should('not.be.undefined');
  });
});
