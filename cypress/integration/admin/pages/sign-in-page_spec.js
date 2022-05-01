import {interceptApiV1Request, interceptLoginRequest} from "../../../common";

describe('Sign-in page', () => {
  beforeEach(() => {
    cy.visit('/admin').wait(500);
  });

  it('should be on the sign-in page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/sign-in');
    });

    cy.get('[data-cy="sign-in content"]').should('be.visible');
    cy.get('[data-cy="form-fields"]').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.visible');
    cy.get('[data-cy="app-button"]').should('be.visible');
  });

  it('should write in username input', () => {
    cy.get('[data-cy="input-text"]').type('toto');
    cy.get('[data-cy="input-text"]').should((input) => {
      expect(input.val()).toStrictEqual('toto');
    });
  });

  it('should write in password input', () => {
    cy.get('[data-cy="input-password"]').type('1234');
    cy.get('[data-cy="input-password"]').should((input) => {
      expect(input.val()).toStrictEqual('1234');
    });
  });


  describe('Submit button', () => {
    it('should be disabled if the password input is empty', () => {
      cy.get('[data-cy="input-text"]').type('toto');
      cy.get('[data-cy="submit-button"]').should('be.disabled');
    });

    it('should be disabled if the username input is empty', () => {
      cy.get('[data-cy="input-password"]').type('1234');
      cy.get('[data-cy="submit-button"]').should('be.disabled');
    });

    it('should not be disabled and display an error if the login request fails', () => {
      interceptLoginRequest();
      cy.get('[data-cy="input-text"]').type('toto');
      cy.get('[data-cy="input-password"]').type('1234');
      cy.get('[data-cy="submit-button"]').should('not.be.disabled');
      cy.get('[data-cy="submit-button"]').click();

      cy.get('[data-cy="primeng-toast"]').should('be.visible');
      cy.url().should((url) => {
        expect(url).toContain('/sign-in');
      });
    });

    it('should log in the user and navigate to the first admin tab if the login request succeeds', () => {
      interceptLoginRequest(false);
      interceptApiV1Request();
      cy.get('[data-cy="input-text"]').type('toto');
      cy.get('[data-cy="input-password"]').type('1234');
      cy.get('[data-cy="submit-button"]').should('not.be.disabled');
      cy.get('[data-cy="submit-button"]').click();

      cy.url().should((url) => {
        expect(url).not.toContain('/sign-in');
      });
      cy.get('[data-cy="admin-layout-header"]').should('be.visible');
    });
  });
});
