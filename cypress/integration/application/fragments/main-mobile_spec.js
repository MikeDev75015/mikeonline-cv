import {interceptApiV1Request} from "../../../common";

describe('Mobile main fragment', () => {
  beforeEach(() => {
    cy
      .viewport(375, 667)
      .viewport('iphone-8');
  });

  it('should display the home page by default', () => {
    interceptApiV1Request().visit('/');
    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });
  });

  it('Clicking toggle menu button should open the menu', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="mobile menu container"]').should('not.be.undefined');
  });

  it('Clicking skills button should display the skills page', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click();
    cy.get('[aria-labelledby="skills menu button"]').click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="skills content"]').should('not.be.undefined');
  });

  it('Clicking experiences button should display the experiences page', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="experiences menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should('not.be.undefined');
  });

  it('Clicking formations button should display the formations page', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="formations menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    cy.get('[aria-labelledby="formations content"]').should('not.be.undefined');
  });

  it('Clicking portfolio button should display the portfolio page', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="portfolio menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should('not.be.undefined');
  });

  it('Clicking interests button should display the interests page', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="interests menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    cy.get('[aria-labelledby="interests content"]').should('not.be.undefined');
  });

  it('Clicking home button should display the home page', () => {
    interceptApiV1Request().visit('/');
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="skills menu button"]').click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="home menu button"]').click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });

    cy.get('[aria-labelledby="home content"]').should('not.be.undefined');
  });
});
