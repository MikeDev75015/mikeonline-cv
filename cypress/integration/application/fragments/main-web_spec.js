import {interceptApiV1Request} from "../../../common";

describe('main component', () => {
  before(() => {
    interceptApiV1Request();
  });

  beforeEach(() => {
    cy
      .visit('/')
      .wait(Cypress.env('SPLASH_SCREEN_DELAY'));
  });

  it('should display the home page by default', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });

    cy.get('[aria-labelledby="home content"]').should('not.be.undefined');
  });

  it('Clicking skills tab should display the skills page', () => {
    cy.get('[aria-labelledby="skills tab"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="skills content"]').should('not.be.undefined');
  });

  it('Clicking experiences tab should display the experiences page', () => {
    cy.get('[aria-labelledby="experiences tab"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should('not.be.undefined');
  });

  it('Clicking formations tab should display the formations page', () => {
    cy.get('[aria-labelledby="formations tab"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    cy.get('[aria-labelledby="formations content"]').should('not.be.undefined');
  });

  it('Clicking portfolio tab should display the portfolio page', () => {
    cy.get('[aria-labelledby="portfolio tab"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should('not.be.undefined');
  });

  it('Clicking interests tab should display the interests page', () => {
    cy.get('[aria-labelledby="interests tab"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    cy.get('[aria-labelledby="interests content"]').should('not.be.undefined');
  });

  it('Clicking home tab should display the home page', () => {
    cy.get('[aria-labelledby="interests tab"]').click({ waitForAnimations: false });
    cy.wait(1000);

    cy.get('[aria-labelledby="home tab"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });

    cy.get('[aria-labelledby="home content"]').should('not.be.undefined');
  });
});
