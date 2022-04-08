import {initializeTest} from "../../common";

describe('Skills page', () => {
  let skillsContent;

  before(() => {
    initializeTest();

    cy.get('[aria-labelledby="skills tab"]').click();

    skillsContent = cy.get('[aria-labelledby="skills content"]');
  });

  it('should be on skills page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });

    skillsContent.should((content) => {
      expect(content).toBeDefined();
    });
  });

});
