import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginRequest } from '../../../../core/interfaces/requests/login.request';
import { MessageSeverity } from '../../../../core/interfaces/types/message-severity.type';
import { loginUser } from '../../../../core/ngrx/actions/auth.actions';
import { ErrorMessageService } from '../../../../core/services/error-message/error-message.service';
import { AuthService } from '../../services/auth/auth.service';
import { FormField } from '../fragments/form-wrapper/interfaces/form-field.interface';
import { SEVERITY_MESSAGE_SUMMARY } from '../fragments/table-wrapper/constants/common.constant';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [MessageService],
})
export class SignInComponent implements OnInit, OnDestroy {
  public formFields: FormField[] | undefined;

  public formValues: LoginRequest = {
    username: '',
    password: '',
  };

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
  }

  ngOnInit(): void {
    this.subscriptionList.push(ErrorMessageService.onMessage().subscribe((message) => {
      if (message === 'INVALID_USERNAME_OR_PASSWORD') {
        this.displayMessage('L\'identifiant et/ou le mot de passe ne sont pas valides.', 'error');
      }
    }));

    this.formFields = [
      { field: 'username', inputLabel: '', inputType: 'text', defaultValue: '', inputPlaceholder: 'Identifiant' },
      { field: 'password', inputLabel: '', inputType: 'password', defaultValue: '', inputPlaceholder: 'Mot de passe' },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  public onLogin(): void {
    if (!this.formValues.username || !this.formValues.password) {
      this.displayMessage('Attention aux champs vides.', 'warn');
      return;
    }

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
