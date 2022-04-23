import {interceptApiV1Request} from "../../../common";

describe('Formations page', () => {
  before(() => {
    interceptApiV1Request();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="formations tab"]').click({ waitForAnimations: false });
  });

  it('should be on formations page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    cy.get('[aria-labelledby="formations content"]').should('not.be.undefined');
  });
});
