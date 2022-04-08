import {environment} from "../../../src/environments/environment";

describe('main component', () => {
  before(() => {
    cy
      .intercept('GET', `${environment.BACKEND_URL}/v0/tags`, {fixture: 'tags.json'}).as('getTags')
      .intercept('GET', `${environment.BACKEND_URL}/v0/competences`, {fixture: 'skills.json'}).as('getSkills')
      .intercept('GET', `${environment.BACKEND_URL}/v0/experiences`, {fixture: 'experiences.json'}).as('getExperiences')
      .intercept('GET', `${environment.BACKEND_URL}/v0/formations`, {fixture: 'formations.json'}).as('getFormations')
      .intercept('GET', `${environment.BACKEND_URL}/v0/projects`, {fixture: 'projects.json'}).as('getProjects')
      .intercept('GET', `${environment.BACKEND_URL}/v0/interests`, {fixture: 'interests.json'}).as('getInterests')
      .visit('/');
  });

  it('should display to the skills tab by default', () => {
    cy.url().should((url) => {
      expect(url).toContain('/#skills');
    });
  });

  describe('tab menu', () => {
    it('Clicking experiences tab should display to the experiences page', () => {
      cy
        .get('[aria-labelledby="experiences tab"]').click()
        .url().should((url) => {
        expect(url).toContain('/#experiences');
      })
        .get('[aria-labelledby="experiences content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking formations tab should display to the formations page', () => {
      cy
        .get('[aria-labelledby="formations tab"]').click()
        .url().should((url) => {
        expect(url).toContain('/#formations');
      })
        .get('[aria-labelledby="formations content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking portfolio tab should display to the portfolio page', () => {
      cy
        .get('[aria-labelledby="portfolio tab"]').click()
        .url().should((url) => {
        expect(url).toContain('/#portfolio');
      })
        .get('[aria-labelledby="portfolio content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking interests tab should display to the interests page', () => {
      cy
        .get('[aria-labelledby="interests tab"]').click()
        .url().should((url) => {
        expect(url).toContain('/#interests');
      })
        .get('[aria-labelledby="interests content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking skills tab should display to the skills page', () => {
      cy
        .get('[aria-labelledby="skills tab"]').click()
        .url().should((url) => {
        expect(url).toContain('/#skills');
      })
        .get('[aria-labelledby="skills content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });
  });

  describe('mobile menu', () => {
    let toggleMenuButton;

    beforeEach(() => {
      cy
        .viewport(375, 667)
        .viewport('iphone-8');

      toggleMenuButton = cy.get('[aria-labelledby="toggle menu button"]');
    });

    it('menu should be opened', () => {
      toggleMenuButton.click();
      cy.get('[aria-labelledby="mobile menu container"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking experiences button should display to the experiences page', () => {
      toggleMenuButton.click();
      cy
        .get('[aria-labelledby="experiences menu button"]').click()
        .url().should((url) => {
        expect(url).toContain('/#experiences');
      })
        .get('[aria-labelledby="experiences content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking formations button should display to the formations page', () => {
      toggleMenuButton.click();
      cy
        .get('[aria-labelledby="formations menu button"]').click()
        .url().should((url) => {
        expect(url).toContain('/#formations');
      })
        .get('[aria-labelledby="formations content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking portfolio button should display to the portfolio page', () => {
      toggleMenuButton.click();
      cy
        .get('[aria-labelledby="portfolio menu button"]').click()
        .url().should((url) => {
        expect(url).toContain('/#portfolio');
      })
        .get('[aria-labelledby="portfolio content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking interests button should display to the interests page', () => {
      toggleMenuButton.click();
      cy
        .get('[aria-labelledby="interests menu button"]').click()
        .url().should((url) => {
        expect(url).toContain('/#interests');
      })
        .get('[aria-labelledby="interests content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });

    it('Clicking skills button should display to the skills page', () => {
      toggleMenuButton.click();
      cy
        .get('[aria-labelledby="skills menu button"]').click()
        .url().should((url) => {
        expect(url).toContain('/#skills');
      })
        .get('[aria-labelledby="skills content"]').should((content) => {
        expect(content).toBeDefined();
      });
    });
  });
});
