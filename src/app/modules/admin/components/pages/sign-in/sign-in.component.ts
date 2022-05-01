import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginRequest } from '../../../../../core/interfaces/requests/login.request';
import { MessageSeverity } from '../../../../../core/interfaces/types/message-severity.type';
import { loginUser } from '../../../../../core/ngrx/actions/auth.actions';
import { selectCurrentUser } from '../../../../../core/ngrx/selectors/auth.selectors';
import { ErrorMessageService } from '../../../../../core/services/error-message/error-message.service';
import { AuthService } from '../../../services/auth/auth.service';
import { getValidationField } from '../../fragments/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../fragments/form-wrapper/interfaces/validation-type.enum';
import { SEVERITY_MESSAGE_SUMMARY } from '../../fragments/table-wrapper/constants/common.constant';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [MessageService],
})
export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
  public isLoading = false;

  public formFields: FormField[] | undefined;

  public formValues: LoginRequest = {
    username: '',
    password: '',
  };

  public showInput = false;

  public isValidForm = false;

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
  }

  /**
   * cleanInputsAndSetFocus
   * @private
   */
  private static cleanInputsAndSetFocus(): void {
    const usernameInput = document.querySelector('.p-inputtext[type="text"]') as HTMLInputElement;
    const passwordInput = document.querySelector('.p-inputtext[type="password"]') as HTMLInputElement;
    if (!usernameInput || !passwordInput) {
      return;
    }
    usernameInput.value = '';
    passwordInput.value = '';
    usernameInput.focus();
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.store.pipe(select(selectCurrentUser)).subscribe({
        next: (currentUser) => {
          if (currentUser) {
            this.isLoading = false;
          }
        },
      }),
    );

    this.subscriptionList.push(ErrorMessageService.onMessage().subscribe((message) => {
      if (message === 'INVALID_USERNAME_OR_PASSWORD') {
        this.displayMessage('L\'identifiant et/ou le mot de passe ne sont pas valides.', 'error');
      } else {
        this.displayMessage('Erreur inattendue lors de la tentative de connexion, Merci de réessayer dans un petit moment.', 'error');
      }

      this.isLoading = false;
    }));

    this.formFields = [
      {
        field: 'username', inputLabel: '', inputType: 'text', defaultValue: '', inputPlaceholder: 'Identifiant',
        mandatoryField: true, validationFieldList: [getValidationField(ValidationType.required, {})],
      },
      {
        field: 'password', inputLabel: '', inputType: 'password', defaultValue: '', inputPlaceholder: 'Mot de passe',
        mandatoryField: true, validationFieldList: [getValidationField(ValidationType.required, {})],
      },
    ];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      SignInComponent.cleanInputsAndSetFocus();
      this.showInput = true;
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  public onLogin(): void {
    if (!this.formValues.username || !this.formValues.password) {
      this.displayMessage('Attention aux champs vides.', 'warn');
      return;
    }

    this.isLoading = true;

    this.store.dispatch(loginUser(this.formValues));
  }

  /**
   * onFormValueChange
   * @param formValues
   */
  public onFormValueChange(formValues: LoginRequest): void {
    this.formValues = formValues;
  }

  /**
   * displayMessage
   * @param detail
   * @param severity
   * @param life
   * @private
   */
  private displayMessage(detail: string, severity: MessageSeverity, life = 5000): void {
    this.messageService.add({
      key: 'applicationError', summary: SEVERITY_MESSAGE_SUMMARY[severity], severity, detail, life, closable: true,
    });
  }
}
