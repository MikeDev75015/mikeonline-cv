export const interceptApiRequest = (apiVersion = 'v0') => {
  return cy
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/cv-infos`, {fixture: 'cv-infos.json'}).as('getCvInfos')
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/tags`, {fixture: 'tags.json'}).as('getTags')
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/competences`, {fixture: 'skills.json'}).as('getSkills')
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/formations`, {fixture: 'formations.json'}).as('getFormations')
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/projects`, {fixture: 'projects.json'}).as('getProjects')
    .intercept('GET', `${Cypress.env('BACKEND_URL')}/${apiVersion}/interests`, {fixture: 'interests.json'}).as('getInterests');
};
