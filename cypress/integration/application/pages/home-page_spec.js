import {interceptApiV1Request} from "../../../common";

describe('Home page', () => {
  it('should be on home page', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'));

    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });

    cy.get('[aria-labelledby="home content"]').should('not.be.undefined');
  });

  it('should display the summary', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'));

    cy.get('[aria-labelledby="home summary"]').should('not.be.undefined');
  });

  it('should display the skills radar chart', () => {
    interceptApiV1Request()
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'));

    cy.get('[aria-labelledby="home radar chart"]').should('not.be.undefined');
  });
});
