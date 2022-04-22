import tagsFile from '../__mocks__/v1/json-files/tags.json';
import skills from '../__mocks__/v1/json-files/skills.json';
import experiences from '../__mocks__/v1/json-files/experiences.json';
import formations from '../__mocks__/v1/json-files/formations.json';
import projects from '../__mocks__/v1/json-files/projects.json';
import users from '../__mocks__/v1/json-files/users.json';

export const interceptApiRequest = (apiVersion = 'v1') => {
  return cy
    .intercept(`**/${apiVersion}/cv-infos*`, {fixture: 'cv-infos.json'}).as('getCvInfos')
    .intercept(`**/${apiVersion}/tags*`, {fixture: 'tags.json'}).as('getTags')
    .intercept(`**/${apiVersion}/interests*`, {fixture: 'interests.json'}).as('getInterests')
    .intercept(`**/${apiVersion}/skills*`, addTags(skills, tagsFile)).as('getSkills')
    .intercept(`**/${apiVersion}/experiences*`, addTags([experiences[2]], tagsFile)).as('getExperiences')
    .intercept(`**/${apiVersion}/formations*`, addTags([formations[0]], tagsFile)).as('getFormations')
    .intercept(`**/${apiVersion}/projects*`, addTags([projects[4]], tagsFile)).as('getProjects')
    .intercept(`**/login*`, {accessToken: '12345678'}).as('login')
    .intercept(`**/account*`, users[0]).as('account')
    .intercept(`**/logout*`, {message: 'SUCCESS'}).as('logout');
};

export const addTags = (list, tags) => {
  return list.map((each) => {
    const tagList = each.tagIdList.map((id) => tags.find((tag) => tag.id === id));
    delete each['tagIdList'];
    return {
      ...each,
      tagList,
    };
  });
}
