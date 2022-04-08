import {environment} from "../../../src/environments/environment";

describe('Interests page', () => {
  let interestsContent;

  before(() => {
    cy
      .intercept('GET', `${environment.BACKEND_URL}/v0/tags`, {fixture: 'tags.json'}).as('getTags')
      .intercept('GET', `${environment.BACKEND_URL}/v0/competences`, {fixture: 'skills.json'}).as('getSkills')
      .intercept('GET', `${environment.BACKEND_URL}/v0/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
      .intercept('GET', `${environment.BACKEND_URL}/v0/formations`, {fixture: 'formations.json'}).as('getFormations')
      .intercept('GET', `${environment.BACKEND_URL}/v0/projects`, {fixture: 'projects.json'}).as('getProjects')
      .intercept('GET', `${environment.BACKEND_URL}/v0/interests`, {fixture: 'interests.json'}).as('getInterests')
      .visit('/');

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
