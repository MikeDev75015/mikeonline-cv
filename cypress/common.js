import tagsJsonFile from '../__mocks__/v1/json-files/tags.json';
import skillsJsonFile from '../__mocks__/v1/json-files/skills.json';
import experiencesJsonFile from '../__mocks__/v1/json-files/experiences.json';
import formationsJsonFile from '../__mocks__/v1/json-files/formations.json';
import projectsJsonFile from '../__mocks__/v1/json-files/projects.json';
import usersJsonFile from '../__mocks__/v1/json-files/users.json';

const addTags = (list, tags) => {
  return list.map((each) => {
    const tagList = each.tagIdList.map((id) => tags.find((tag) => tag.id === id));
    delete each['tagIdList'];
    return {
      ...each,
      tagList,
    };
  });
}

export const interceptApiV1Request = () => {
  return cy
    .intercept(`**/v1/cv-infos*`, {fixture: 'cv-infos.json'}).as('getCvInfos')
    .intercept(`**/v1/tags*`, {fixture: 'tags.json'}).as('getTags')
    .intercept(`**/v1/interests*`, {fixture: 'interests.json'}).as('getInterests')
    .intercept(`**/v1/skills*`, addTags(skillsJsonFile, tagsJsonFile)).as('getSkills')
    .intercept(`**/v1/experiences*`, addTags([experiencesJsonFile[2]], tagsJsonFile)).as('getExperiences')
    .intercept(`**/v1/formations*`, addTags([formationsJsonFile[0]], tagsJsonFile)).as('getFormations')
    .intercept(`**/v1/projects*`, addTags([projectsJsonFile[4]], tagsJsonFile)).as('getProjects');
};

export const interceptLoginRequest = (logAsAdmin = false) => {
  return cy
    .intercept(`**/login*`, {accessToken: '12345678'}).as('login')
    .intercept(`**/account*`, usersJsonFile[logAsAdmin ? 0 : 1]).as('account');
};

export const interceptLogoutRequest = () => {
  return cy.intercept(`**/logout*`, {message: 'SUCCESS'}).as('logout');
};
