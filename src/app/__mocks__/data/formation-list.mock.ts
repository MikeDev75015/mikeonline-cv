import { IFormation } from '../../core/interfaces/models/formation.interface';

const lastFormation = {
  tagIdList: [2, 4, 5],
  tagList: [{ id: 2, name: 'AWS Cloud', times: 2, weight: 2 }, { id: 4, name: 'DevOps', times: 4, weight: 4 }, {
    id: 5,
    name: 'Docker',
    times: 2,
    weight: 2,
  }],
  endDate: '2021-03',
  title: 'Mettez en place l\'intégration et la livraison continues avec la démarche\n' +
    'DevOps',
  certificate: true,
  detailList: [
    {
      title: 'Voir le certificat (Nom: Nodanche)',
      url: 'https://openclassrooms.com/fr/course-certificates/3219841287',
    },
    {
      title: 'Détail du cours (10 heures) :',
      lineList: [
        '* P1 - Mettez en place l\'intégration continue',
        '# Qu\'est-ce que l\'intégration continue ?',
        'Étape 1 : Planifiez votre développement',
        'Étape 2 : Compilez et intégrez votre code',
        'Étape 3 : Testez votre code',
        'Étape 4 : Mesurez la qualité de votre code',
        'Étape 5 : Gérez les livrables de votre application',
        'Utilisez GitLab pour mettre en place un pipeline CI/CD',
        '# Planifiez votre développement',
        'Créez votre projet GitLab',
        'Créez votre première epic',
        'Créez votre première user story',
        'Organisez votre backlog',
        '# Intégrez votre code en continu',
        'Clonez le projet sur votre poste',
        'Activez l\'intégration continue sur votre projet avec GitLab',
        'Lancez votre pipeline CI/CD',
        'Et si l\'application contient un bug ?',
        '# Garantissez la qualité de votre code',
        'Mesurez la qualité de votre code',
        'Packagez votre application pour la déployer',
        'Les autres outils de l\'intégration continue',

        '* P2 - Mettez en place la livraison continue',
        '# Qu\'est-ce que la livraison continue ?',
        'Étape 1 : Codifiez votre infrastructure avec l\'Infrastructure-as-Code',
        'Étape 2 : Déployez votre application',
        'Étape 3 : Testez votre application',
        'Étape 4 : Supervisez le comportement de votre application',
        'Étape 5 : Mettez en place des notifications d\'alertes',
        '# Codifiez votre infrastructure',
        'Construisez les images de votre application avec Docker',
        'Déployez votre application avec Docker Compose',
        '# Déployez et testez votre code sur différents environnements',
        'Préparez votre environnement de travail',
        '# Monitorez votre application',
        'Supervisez votre application avec Prometheus',
        'Mettez en place des notifications Slack',
      ],
    },
  ],
  society: 'OPENCLASSROOMS.COM',
  place: 'E-Learning',
};
const previousFormation = {
  tagIdList: [4],
  tagList: [{ id: 4, name: 'DevOps', times: 4, weight: 4 }],
  endDate: '2021-01',
  title: 'Découvrez la méthodologie DevOps',
  certificate: true,
  detailList: [
    {
      title: 'Voir le certificat (Nom: Nodanche)',
      url: 'https://openclassrooms.com/fr/course-certificates/2584013962',
    },
    {
      title: 'Détail du cours (6 heures) :',
      lineList: [
        '* Découvrez les origines de la méthodologie DevOps',
        'D\'où vient le DevOps ?',
        'La transformation d\'Etsy vers le DevOps',
        'L\'impact du DevOps sur un grand groupe français',

        '* Identifiez les caractéristiques de la méthodologie DevOps',
        'Culture',
        'Automatisation',
        'Lean',
        'Mesure',
        'Sharing (Partage)',

        '* Mettez en place le DevOps en évitant les pièges',
        'Ne tombez pas dans le piège !',
        'Assurez une bonne mise en place du DevOps',

        '* Recrutez un SRE pour assurer le DevOps dans votre entreprise',
        'Un peu d\'histoire',
        'Le rôle du SRE',
        'Les piliers du SRE',
        'Les quatre signaux dorés',
      ],
    },
  ],
  society: 'OPENCLASSROOMS.COM',
  place: 'E-Learning',
};
const firstFormation = {
  tagIdList: [1, 5, 6, 7],
  tagList: [{ id: 1, name: 'Angular', times: 1, weight: 1 }, { id: 5, name: 'Docker', times: 2, weight: 2 }, {
    id: 6,
    name: 'Jest',
    times: 3,
    weight: 3,
  }, { id: 7, name: 'Nest.js', times: 4, weight: 4 }],
  beginDate: '2018-09',
  endDate: '2019-02',
  title: 'Développeur Front-End',
  certificate: true,
  detailList: [
    {
      title: 'Cours (4 mois)',
      lineList: [
        'Développement d’applications Web Full JavaScript',
        'Framework Angular',
        'Node.js & MongoDB',
        'Javascript et Ajax perfectionnement',
        'JavaScript & le DOM',
        'jQuery',
        'JavaScript : les bases du langage',
        'Framework Bootstrap HTML/CSS/Javascript',
        'Le référencement naturel SEO',
        'Google Analytics',
        'Google Tag Manager',
        'Intégration HTML5/CSS3',
        'HTML5/CSS3 : Le préprocesseur CSS SASS',
        'Créer un site web HTML5/CSS3',
        'Adobe® Photoshop CC',
      ],
    },
    {
      title: 'Stage Merci Gustave (6 semaines)',
    },
  ],
  place: 'Paris (75), Montreuil (93)',
  society: 'DORANCO',
};

export const unsortedFormationListMock = [previousFormation, firstFormation, lastFormation] as IFormation[];

export const sortedFormationListMock = [lastFormation, previousFormation, firstFormation] as IFormation[];
