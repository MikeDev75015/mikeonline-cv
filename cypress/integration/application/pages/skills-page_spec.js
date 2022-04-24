import {interceptApiV1Request} from "../../../common";

describe('Skills page', () => {
  it('should be on skills page', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="skills tab"]')
      .click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="skills content"]').should('not.be.undefined');
  });
});
