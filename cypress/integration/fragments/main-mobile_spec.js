import {interceptApiRequest} from "../common";

describe('main component', () => {
  before(() => {
    interceptApiRequest();
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

  it('Clicking toggle menu button should be opened', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="mobile menu container"]').should((content) => {
      expect(content).toBeDefined();
    });
  });

  it('Clicking skills button should display the skills page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="skills menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    cy.get('[aria-labelledby="skills content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });

  it('Clicking experiences button should display the experiences page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="experiences menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });

  it('Clicking formations button should display the formations page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="formations menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    cy.get('[aria-labelledby="formations content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });

  it('Clicking portfolio button should display the portfolio page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="portfolio menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });

  it('Clicking interests button should display the interests page', () => {
    cy.get('[aria-labelledby="toggle menu button"]').click({ waitForAnimations: false });
    cy.get('[aria-labelledby="interests menu button"]').click({ waitForAnimations: false });

    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    cy.get('[aria-labelledby="interests content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });
});
