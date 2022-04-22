import {interceptApiRequest} from "../../../common";

describe('Portfolio page', () => {
  before(() => {
    interceptApiRequest();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="portfolio tab"]').click({ waitForAnimations: false });
  });

  it('should be on portfolio page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should('not.be.undefined');
  });
});
