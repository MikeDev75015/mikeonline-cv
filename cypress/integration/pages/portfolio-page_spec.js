import {initializeTest} from "../../common";

describe('Portfolio page', () => {
  let portfolioContent;

  before(() => {
    initializeTest();

    cy.get('[aria-labelledby="portfolio tab"]').click();

    portfolioContent = cy.get('[aria-labelledby="portfolio content"]');
  });

  it('should be on portfolio page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    portfolioContent.should((content) => {
      expect(content).toBeDefined();
    });
  });

});
