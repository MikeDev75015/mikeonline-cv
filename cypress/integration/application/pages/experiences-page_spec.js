import {interceptApiV1Request} from "../../../common";

describe('Experiences page', () => {
  it('should be on experiences page', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="experiences tab"]')
      .click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should('not.be.undefined');
  });
});
