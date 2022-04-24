import {interceptApiV1Request} from "../../../common";

describe('Portfolio page', () => {
  it('should be on portfolio page', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="portfolio tab"]')
      .click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should('not.be.undefined');
  });
});
