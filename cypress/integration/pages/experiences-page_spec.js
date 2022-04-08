import {initializeTest} from "../../common";

describe('Experiences page', () => {
  let experiencesContent;

  before(() => {
    initializeTest();

    cy.get('[aria-labelledby="experiences tab"]').click();

    experiencesContent = cy.get('[aria-labelledby="experiences content"]');
  });

  it('should be on experiences page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    experiencesContent.should((content) => {
      expect(content).toBeDefined();
    });
  });

});
