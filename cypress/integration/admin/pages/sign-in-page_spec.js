import {interceptApiV1Request, interceptLoginRequest} from "../../../common";

describe('Sign-in page', () => {
  beforeEach(() => {
    cy
      .viewport(1200, 700)
      .visit('/admin');
  });

  it('should be on the sign-in page', () => {
    cy.url().should((url) => {
      expect(url).toContain('/sign-in');
    });

    cy.get('[data-cy="content"]').should('be.visible');
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


  describe('click on the submit button', () => {
    it('should display an error if the password input is empty', () => {
      cy.get('[data-cy="input-text"]').type('toto');
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="primeng-toast"]').should('be.visible');
    });

    it('should display an error if the username input is empty', () => {
      cy.get('[data-cy="input-password"]').type('1234');
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="primeng-toast"]').should('be.visible');
    });

    it('should display an error if user does not exist', () => {
      cy.get('[data-cy="input-text"]').type('toto');
      cy.get('[data-cy="input-password"]').type('1234');
      cy.get('[data-cy="submit-button"]').click();

      cy.get('[data-cy="primeng-toast"]').should('be.visible');
      cy.url().should((url) => {
        expect(url).toContain('/sign-in');
      });
    });

    it('should log the user in and navigate to the first admin tab', () => {
      interceptLoginRequest();
      interceptApiV1Request();
      cy.get('[data-cy="input-text"]').type('toto');
      cy.get('[data-cy="input-password"]').type('1234');
      cy.get('[data-cy="submit-button"]').click();

      cy.url().should((url) => {
        expect(url).not.toContain('/sign-in');
      });
      cy.get('[data-cy="admin-layout-header"]').should('be.visible');
    });
  });
});
