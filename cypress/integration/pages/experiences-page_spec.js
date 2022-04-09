import {interceptApiRequest} from "../common";

describe('Experiences page', () => {
  before(() => {
    interceptApiRequest();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'))
      .get('[aria-labelledby="experiences tab"]').click({ waitForAnimations: false });
  });

  it('should be on experiences page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });
});
