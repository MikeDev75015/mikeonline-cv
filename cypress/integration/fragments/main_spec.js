describe('main component', () => {
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
  });

  it('should display the home page by default', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#home');
    });
  });

  describe('tab menu', () => {
    beforeEach(() => {
      cy.wait(Cypress.env('SPLASH_SCREEN_DELAY'));
    });

    it('Clicking skills tab should display the skills page', () => {
      cy.get('[aria-labelledby="skills tab"]').click({ waitForAnimations: false });

      cy.url().should((url) => {
        expect(url).toContain('/#skills');
      });

      cy.get('[aria-labelledby="skills content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking experiences tab should display the experiences page', () => {
      cy.get('[aria-labelledby="experiences tab"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#experiences');
      });

      cy.get('[aria-labelledby="experiences content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking formations tab should display the formations page', () => {
      cy.get('[aria-labelledby="formations tab"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#formations');
      });

      cy.get('[aria-labelledby="formations content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking portfolio tab should display the portfolio page', () => {
      cy.get('[aria-labelledby="portfolio tab"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#portfolio');
      });

      cy.get('[aria-labelledby="portfolio content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking interests tab should display the interests page', () => {
      cy.get('[aria-labelledby="interests tab"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#interests');
      });

      cy.get('[aria-labelledby="interests content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });
  });

  describe('mobile menu', () => {
    beforeEach(() => {
      cy
        .viewport(375, 667)
        .viewport('iphone-8');
    });

    it('menu should be opened', () => {
      cy.get('[aria-labelledby="toggle menu button"]').click();
      cy.get('[aria-labelledby="mobile menu container"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking skills button should display the skills page', () => {
      cy.get('[aria-labelledby="toggle menu button"]').click();
      cy.get('[aria-labelledby="skills menu button"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#skills');
      });

      cy.get('[aria-labelledby="skills content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking experiences button should display the experiences page', () => {
      cy.get('[aria-labelledby="toggle menu button"]').click();
      cy.get('[aria-labelledby="experiences menu button"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#experiences');
      });

      cy.get('[aria-labelledby="experiences content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking formations button should display the formations page', () => {
      cy.get('[aria-labelledby="toggle menu button"]').click();
      cy.get('[aria-labelledby="formations menu button"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#formations');
      });

      cy.get('[aria-labelledby="formations content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking portfolio button should display the portfolio page', () => {
      cy.get('[aria-labelledby="toggle menu button"]').click();
      cy.get('[aria-labelledby="portfolio menu button"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#portfolio');
      });

      cy.get('[aria-labelledby="portfolio content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking interests button should display the interests page', () => {
      cy.get('[aria-labelledby="toggle menu button"]').click();
      cy.get('[aria-labelledby="interests menu button"]').click();

      cy.url().should((url) => {
        expect(url).toContain('/#interests');
      });

      cy.get('[aria-labelledby="interests content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });
  });
});
