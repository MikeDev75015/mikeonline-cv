import {initializeTest} from "../../common";

describe('Formations page', () => {
  let formationsContent;

  before(() => {
    initializeTest();

    cy.get('[aria-labelledby="formations tab"]').click();

    formationsContent = cy.get('[aria-labelledby="formations content"]');
  });

  it('should be on formations page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#formations');
    });

    formationsContent.should((content) => {
      expect(content).toBeDefined();
    });
  });

});
