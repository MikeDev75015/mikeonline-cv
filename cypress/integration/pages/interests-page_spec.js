import {interceptApiRequest} from "../common";

describe('Interests page', () => {
  before(() => {
    interceptApiRequest();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="interests tab"]').click({ waitForAnimations: false });
  });

  it('should be on interests page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    cy.get('[aria-labelledby="interests content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });
});
