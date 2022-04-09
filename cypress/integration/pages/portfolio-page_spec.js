import {environment} from "../../../src/environments/environment";

describe('Portfolio page', () => {
  before(() => {
    cy
      .intercept('GET', `${environment.BACKEND_URL}/v0/cv-infos`, {fixture: 'cv-infos.json'}).as('getCvInfos')
      .intercept('GET', `${environment.BACKEND_URL}/v0/tags`, {fixture: 'tags.json'}).as('getTags')
      .intercept('GET', `${environment.BACKEND_URL}/v0/competences`, {fixture: 'skills.json'}).as('getSkills')
      .intercept('GET', `${environment.BACKEND_URL}/v0/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
      .intercept('GET', `${environment.BACKEND_URL}/v0/formations`, {fixture: 'formations.json'}).as('getFormations')
      .intercept('GET', `${environment.BACKEND_URL}/v0/projects`, {fixture: 'projects.json'}).as('getProjects')
      .intercept('GET', `${environment.BACKEND_URL}/v0/interests`, {fixture: 'interests.json'}).as('getInterests')
  });

  beforeEach(() => {
    cy.visit('/');
    cy.wait(environment.SPLASH_SCREEN_DELAY);
    cy.get('[aria-labelledby="portfolio tab"]').click();
  });

  it('should be on portfolio page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#portfolio');
    });

    cy.get('[aria-labelledby="portfolio content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });
});
