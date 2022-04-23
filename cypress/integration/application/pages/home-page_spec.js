import {interceptApiV1Request} from "../../../common";

describe('Home page', () => {
  before(() => {
    interceptApiV1Request();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'));
  });

  it('should be on home page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });

    cy.get('[aria-labelledby="home content"]').should('not.be.undefined');
  });

  it('should display the summary', () => {
    cy.get('[aria-labelledby="home summary"]').should('not.be.undefined');
  });

  it('should display the skills radar chart', () => {
    cy.get('[aria-labelledby="home radar chart"]').should('not.be.undefined');
  });
});
