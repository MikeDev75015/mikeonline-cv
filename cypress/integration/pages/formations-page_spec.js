import {environment} from "../../../src/environments/environment";

describe('Formations page', () => {
  let formationsContent;

  before(() => {
    cy
      .intercept('GET', `${environment.BACKEND_URL}/v0/tags`, {fixture: 'tags.json'}).as('getTags')
      .intercept('GET', `${environment.BACKEND_URL}/v0/competences`, {fixture: 'skills.json'}).as('getSkills')
      .intercept('GET', `${environment.BACKEND_URL}/v0/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
      .intercept('GET', `${environment.BACKEND_URL}/v0/formations`, {fixture: 'formations.json'}).as('getFormations')
      .intercept('GET', `${environment.BACKEND_URL}/v0/projects`, {fixture: 'projects.json'}).as('getProjects')
      .intercept('GET', `${environment.BACKEND_URL}/v0/interests`, {fixture: 'interests.json'}).as('getInterests')
      .visit('/');

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
