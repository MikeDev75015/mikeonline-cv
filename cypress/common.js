import {environment} from "../src/environments/environment";

export const initializeTest = (urlToVisit = '/') => {
  cy
    .intercept('GET', `${environment.BACKEND_URL}/v0/tags`, { fixture: 'tags.json' }).as('getTags')
    .intercept('GET', `${environment.BACKEND_URL}/v0/competences`, { fixture: 'skills.json' }).as('getSkills')
    .intercept('GET', `${environment.BACKEND_URL}/v0/experiences`, { fixture: 'experiences.json' }).as('getExperiences')
    .intercept('GET', `${environment.BACKEND_URL}/v0/formations`, { fixture: 'formations.json' }).as('getFormations')
    .intercept('GET', `${environment.BACKEND_URL}/v0/projects`, { fixture: 'projects.json' }).as('getProjects')
    .intercept('GET', `${environment.BACKEND_URL}/v0/interests`, { fixture: 'interests.json' }).as('getInterests')
    .visit(urlToVisit);
};
