import {initializeTest} from "../../common";

describe('Interests page', () => {
  let interestsContent;

  before(() => {
    initializeTest();

    cy.get('[aria-labelledby="interests tab"]').click();

    interestsContent = cy.get('[aria-labelledby="interests content"]');
  });

  it('should be on interests page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#interests');
    });

    interestsContent.should((content) => {
      expect(content).toBeDefined();
    });
  });

});
