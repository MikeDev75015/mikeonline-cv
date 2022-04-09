describe('Experiences page', () => {
  before(() => {
    cy
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/cv-infos`, {fixture: 'cv-infos.json'}).as('getCvInfos')
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/tags`, {fixture: 'tags.json'}).as('getTags')
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/competences`, {fixture: 'skills.json'}).as('getSkills')
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/formations`, {fixture: 'formations.json'}).as('getFormations')
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/projects`, {fixture: 'projects.json'}).as('getProjects')
      .intercept('GET', `${Cypress.env('BACKEND_URL')}/v0/interests`, {fixture: 'interests.json'}).as('getInterests')
  });

  beforeEach(() => {
    cy.visit('/');
    cy.wait(Cypress.env('SPLASH_SCREEN_DELAY'));
    cy.get('[aria-labelledby="experiences tab"]').click();
  });

  it('should be on experiences page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#experiences');
    });

    cy.get('[aria-labelledby="experiences content"]').should((content) => {
      expect(content).toBeDefined();
    });
  });
});
