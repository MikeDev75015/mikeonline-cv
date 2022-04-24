import {interceptApiV1Request} from "../../../common";

describe('Mobile main fragment', () => {
  before(() => {
    interceptApiV1Request();
  });

  beforeEach(() => {
    cy
      .viewport(375, 667)
      .viewport('iphone-8')
      .visit('/');
  });

  it('should display the home page by default', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });
  });

  it('Clicking toggle menu button should open the menu', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({waitForAnimations: false});
    cy.get('[aria-labelledby="mobile menu container"]').should('not.be.undefined');
  });

  it('Clicking skills button should display the skills page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click();
    cy.get('[aria-labelledby="skills menu button"]').click({waitForAnimations: false});

    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="skills content"]').should('not.be.undefined');
  });

  it('Clicking experiences button should display the experiences page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="experiences menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should('not.be.undefined');
  });

  it('Clicking formations button should display the formations page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="formations menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    cy.get('[aria-labelledby="formations content"]').should('not.be.undefined');
  });

  it('Clicking portfolio button should display the portfolio page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="portfolio menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should('not.be.undefined');
  });

  it('Clicking interests button should display the interests page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="interests menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    cy.get('[aria-labelledby="interests content"]').should('not.be.undefined');
  });

  it('Clicking home button should display the home page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="interests menu button"]').click({ waitForAnimations: false });
    cy.wait(1000);

    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="home menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });

    cy.get('[aria-labelledby="home content"]').should('not.be.undefined');
  });
});
