import { IProject } from '../../core/interfaces/models/project.interface';

export const projectListMock = [
  {
    tagIdList: [1, 2, 5],
    tagList: [{ id: 1, name: 'Angular', times: 1, weight: 1 }, { id: 2, name: 'AWS Cloud', times: 2, weight: 2 }, { id: 5, name: 'Docker', times: 2, weight: 2 }],
    position: 0,
    pictureList: [
      {
        src: 'assets/img/portfolio_onlinecv.jpg',
        alt: 'Online CV',
        title: 'Online CV',
      },
    ],
    title: 'Online CV',
    subTitle: 'ANGULAR 13',
  },
  {
    tagIdList: [3, 7],
    tagList: [{ id: 3, name: 'CQRS', times: 3, weight: 3 }, { id: 7, name: 'Nest.js', times: 4, weight: 4 }],
    position: 1,
    pictureList: [
      {
        src: 'assets/img/portfolio_recettesmaison.jpg',
        alt: 'Recettes Maison',
        title: 'Recettes Maison',
      },
    ],
    title: 'Re7 Maison',
    subTitle: 'IONIC 5 / PWA',
    link: {
      title: 'Re7 Maison',
      url: 'https://app.re7-maison.fr',
      description: 'Application web et mobile pour vous emporter vos recettes maisons partout avec vous et les partager à ' +
        'tout moment avec qui vous voulez.',
    },
  },
  {
    tagIdList: [4, 6],
    tagList: [{ id: 4, name: 'DevOps', times: 4, weight: 4 }, { id: 6, name: 'Jest', times: 3, weight: 3 }],
    position: 2,
    styles: {
      classicView: {
        title: {
          'letter-spacing': '-1px',
        },
      },
    },
    pictureList: [
      {
        src: 'assets/img/npm.jpg',
        alt: 'NPM Package',
        title: 'NPM Package',
      },
    ],
    title: 'Mongodb Pipeline Builder',
    subTitle: 'TYPESCRIPT / NPM',
    link: {
      title: 'mongodb-pipeline-builder',
      url: 'https://www.npmjs.com/package/mongodb-pipeline-builder',
      description: 'mongodb-pipeline-builder is a pipeline builder for the db.collection.aggregate method and db.aggregate method. ' +
        'It will simplify pipelines by making them more readable and much easier to edit. It also allows you to test your pipelines ' +
        'on a dataset in order to verify them. Pipeline stages appear in an array. Documents pass through the stages in sequence.',
    },
  },
] as IProject[];
