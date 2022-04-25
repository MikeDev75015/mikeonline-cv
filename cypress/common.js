import cvInfosJsonFile from '../__mocks__/v1/json-files/cv-infos.json';
import tagsJsonFile from '../__mocks__/v1/json-files/tags.json';
import interestsJsonFile from '../__mocks__/v1/json-files/interests.json';
import skillsJsonFile from '../__mocks__/v1/json-files/skills.json';
import experiencesJsonFile from '../__mocks__/v1/json-files/experiences.json';
import formationsJsonFile from '../__mocks__/v1/json-files/formations.json';
import projectsJsonFile from '../__mocks__/v1/json-files/projects.json';
import usersJsonFile from '../__mocks__/v1/json-files/users.json';

const addTags = (list) => {
  return [...list].map((each) => {
    const tagList = each.tagIdList.map((id) => tagsJsonFile.find((tag) => tag.id === id));
    delete each['tagIdList'];
    return {
      ...each,
      tagList,
    };
  });
}

export const cvInfos = cvInfosJsonFile;
export const tags = tagsJsonFile;
export const interests = interestsJsonFile;
export const skillsWithTags = addTags(skillsJsonFile);
export const experiencesWithTags = addTags([experiencesJsonFile[2]]);
export const formationsWithTags = addTags([formationsJsonFile[0]]);
export const projectsWithTags = addTags([projectsJsonFile[4]]);
export const users = usersJsonFile;

export const interceptApiV1Request = () => {
  return cy
    .intercept(`**/v1/cv-infos*`, {statusCode: 200, body: cvInfos}).as('getCvInfos')
    .intercept(`**/v1/tags*`, {statusCode: 200, body: tags}).as('getTags')
    .intercept(`**/v1/interests*`, {statusCode: 200, body: interests}).as('getInterests')
    .intercept(`**/v1/skills*`, {statusCode: 200, body: skillsWithTags}).as('getSkills')
    .intercept(`**/v1/experiences*`, {statusCode: 200, body: experiencesWithTags}).as('getExperiences')
    .intercept(`**/v1/formations*`, {statusCode: 200, body: formationsWithTags}).as('getFormations')
    .intercept(`**/v1/projects*`, {statusCode: 200, body: projectsWithTags}).as('getProjects');
};

export const interceptLoginRequest = (loginFailure = true, logAsAdmin = false) => {
  if (loginFailure) {
    return cy
      .intercept(`**/login*`, {statusCode: 401, body: {message: 'INVALID_USERNAME_OR_PASSWORD'}}).as('login');
  }

  return cy
    .intercept(`**/login*`, {statusCode: 200, body: {accessToken: '12345678'}}).as('login')
    .intercept(`**/account*`, {statusCode: 200, body: users[logAsAdmin ? 0 : 1]}).as('account');
};

export const interceptLogoutRequest = (logoutFailure = true) => {
  if (logoutFailure) {
    return cy.intercept(`**/logout*`, {statusCode: 503, body: {message: 'NO_USER_FOUND'}}).as('logout');
  }

  return cy.intercept(`**/logout*`, {statusCode: 200, body: {message: 'SUCCESS'}}).as('logout');
};
