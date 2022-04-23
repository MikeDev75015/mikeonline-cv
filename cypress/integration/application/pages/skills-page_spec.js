import {interceptApiV1Request} from "../../../common";

describe('Skills page', () => {
  before(() => {
    interceptApiV1Request();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="skills tab"]').click({ waitForAnimations: false });
  });

  it('should be on skills page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="skills content"]').should('not.be.undefined');
  });
});
