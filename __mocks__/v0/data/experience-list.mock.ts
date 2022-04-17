import { EJobType, IExperience, ITag } from '../../../src/app/core';

const lastExperience = {
  tagIdList: [1, 2, 3, 4, 5, 6, 7],
  tagList: [{ id: 1, name: 'Angular', times: 1, weight: 1 }, { id: 2, name: 'AWS Cloud', times: 2, weight: 2 }, { id: 3, name: 'CQRS', times: 3, weight: 3 }, { id: 4, name: 'DevOps', times: 4, weight: 4 }, { id: 5, name: 'Docker', times: 2, weight: 2 }, { id: 6, name: 'Jest', times: 3, weight: 3 }, { id: 7, name: 'Nest.js', times: 4, weight: 4 }],
  beginDate: '2020-04',
  actualJob: true,
  title: 'Développeur FullStack TS',
  jobType: EJobType.Freelance,
  detailList: [
    {
      lineList: [
        '* Pipeline CI/CD avec CircleCi :',
        'Workflow Staging, workflow Production',
        'Tests unitaires, Builds, Déploiements, Notifications Slack, Jira',
        'Déploiements automatiques pour Staging, avec approbations pour Master',
        'Optimisation des jobs avec gestion du cache',
        'Persistance et réutilisation des données générées dans le workspace',
        '* AWS Cloud :',
        'S3 bucket pour le frontend',
        'ECR avec Docker pour le backend',
        '* Structure des frontends avec Angular 2+ :',
        'Modules, Services, Pages, Components, Interfaces, Pipes',
        'Animations Angular, Angular Material, PrimeNG',
        'Compodoc pour la JS Doc',
        'Jest pour les Tests Unitaires',
        '* Structure des backends avec Nest.js :',
        'Modules, Controllers, Services, Interfaces, Schemas (mongoose), Dtos / Gateways (websockets)',
        'Swagger.io pour vérification des requètes API',
        'Jwt pour requètes entrantes sécurisées, protection par token bearer',
        'Compodoc pour la JS Doc',
        'Jest pour les Tests Unitaires',
        'Création de vues, d\'index dans MongoDb, optimisation des requètes',
        'Pipelines dynamiques pour méthode aggregate sur model MongoDb'
      ]
    },
    {
      // title: 'PRESTATIONS NTS ADVISORY :',
      lineList: [
        '* Développement d\'une plate-forme dynamique :',
        'Module de recherche par tag',
        'Barre de recherche avec Chip pour gestion des critères de recherche',
        'Barre latérale de filtres dynamiques',
        'Création loading personnalisé et animé par Css 3',
        'Sections / Menus dynamiques avec permissions associées pour accès / visibilité selon rôle de l\'utilisateur',
        'Affichage de tables dynamiques, gestions des filtres et données optimisées avec paramètres ' +
        'dans chaque requête d\'affichage',
        '* Développement de backends Microservices / API :',
        'Backend Authentification avec modules Auth, Users, Rôles et Permissions',
        'Backend Global pour gestion des ressources et du référentiel',
        'Backend Command pour requêtes d\'écriture, contrôles logique métier ' +
        'avant publication dans l\'eventStore',
        'Backend Mongo pour persistance dans MongoDb pour chaque event publié dans l\'eventStore',
        'Backend Query pour requètes de lecture / affichage en temps réel des données avec Websocket',
      ]
    },
    {
      // title: 'PRESTATIONS NDEV52 :',
      lineList: [
        '* Web App de Suivi de livraison pour client :',
        'CSS',
        'Géo-localisations',
        'Timeline pour statut livraison',
        'API Here, Traccar',
        '* PWA pour chauffeur/livreur :',
        'Timeline pour enlèvements et livraisons',
        'Géo-localisations',
        'Scannages des codes barres',
        'Gestion des encours',
        'Transferts de responsabilités avec signatures sur mobile',
        '* Web App de Régulation :',
        'Ajout de tables de gestion',
        'Module d\'optimisation de tournées',
        'Formulaires d\'ajout de missions ou de gestion par actions simples ou multiples',
        '* Backends Microservices / CQRS :',
        'API Google Maps, Gouv, Open Cage',
        'Stack des requêtes multiples pour exécution sans conflit',
        'Persistance MongoDb avec Mongoose',
        'Surveillance avec ChangeStream et mise à jour par websockets'
      ]
    }
  ],
  place: 'Paris (75), Full Remote'
};

const previousExperience = {
  tagIdList: [1, 6, 7, 230],
  tagList: [{ id: 1, name: 'Angular', times: 1, weight: 1 }, { id: 6, name: 'Jest', times: 3, weight: 3 }, { id: 7, name: 'Nest.js', times: 4, weight: 4 }, undefined as unknown as ITag],
  beginDate: '2019-01',
  endDate: '2020-04',
  title: 'Développeur FullStack JS',
  jobType: EJobType.Freelance,
  detailList: [
    {
      title: 'Widget',
      lineList: [
        '* Frontend React.js :',
        'Styling Css 3',
        'Ajout de nouvelles fonctionnalités',
        'Tracking Analytics avec Google Tag Manager',
        'Tracking Facebook avec Pixel FB',
        'Build / Déploiement automatique sur Netlify',
        '* Backend Node.js / Express :',
        'API Stripe, Stuart, Deliver.ee',
        'Build / Déploiement automatique sur Heroku'
      ]
    },
    {
      title: 'Dashboard / Module de Gestion',
      lineList: [
        '* Frontend Web App / PWA / Angular 7',
        'Angular material',
        'Notifications en temps réel avec Socket.io',
        'Gestion des transaction Stripe',
        'Gestion des courses Stuart, Deliver.ee',
        '* Backend Node.js / Express :',
        'API CRUD',
        'API Stripe, Stuart, Deliver.ee',
        'Module de facturation par mail',
      ]
    },
    {
      title: 'Espace Partners',
      lineList: [
        '* Gestion des essayages :',
        'Accès sécurisé',
        'Confirmation de la disponibilité de chaque article',
        'Possibilité de refuser une demande d\'essayage',
        'Validation du jour de l\'essayage',
        'Possibilité de décaler la date et/ou l\'heure de l\'essayage',
        'Possibilité de modifier les adresses de retrait et/ou dépot des articles',
        'Liste et statuts de tous les essayages'
      ]
    },
    {
      title: 'Shopify App',
      lineList: [
        '* Installation sur boutique :',
        'Intégration Widget',
        'Accès direct Espace Partners',
        '* Requètes API Shopify :',
        'Création de précommandes (Draft Order)',
        'Création / Finalisation de commandes',
        '* Gestion automatique du stock :',
        'Réservation des articles',
        'Retour en stock',
      ]
    }
  ],
  society: 'MERCI GUSTAVE',
  place: 'La Défense (92), Paris (75), Remote'
};

export const unsortedExperienceListMock: IExperience[] = [previousExperience, lastExperience];

export const sortedExperienceListMock: IExperience[] = [lastExperience, previousExperience];
