import {environment} from "../../../src/environments/environment";

describe('Skills page', () => {
  let skillsContent;

  before(() => {
    cy
      .intercept('GET', `${environment.BACKEND_URL}/v0/tags`, {fixture: 'tags.json'}).as('getTags')
      .intercept('GET', `${environment.BACKEND_URL}/v0/competences`, {fixture: 'skills.json'}).as('getSkills')
      .intercept('GET', `${environment.BACKEND_URL}/v0/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
      .intercept('GET', `${environment.BACKEND_URL}/v0/formations`, {fixture: 'formations.json'}).as('getFormations')
      .intercept('GET', `${environment.BACKEND_URL}/v0/projects`, {fixture: 'projects.json'}).as('getProjects')
      .intercept('GET', `${environment.BACKEND_URL}/v0/interests`, {fixture: 'interests.json'}).as('getInterests')
      .visit('/');

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
