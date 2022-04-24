import {interceptApiV1Request} from "../../../common";

describe('Interests page', () => {
  it('should be on interests page', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="interests tab"]')
      .click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    cy.get('[aria-labelledby="interests content"]').should('not.be.undefined');
  });
});
