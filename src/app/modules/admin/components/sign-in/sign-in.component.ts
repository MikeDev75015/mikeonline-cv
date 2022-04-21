import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MessageSeverity } from '../../../../core/interfaces/types/message-severity.type';
import { loginUser } from '../../../../core/ngrx/actions/auth.actions';
import { ErrorMessageService } from '../../../../core/services/error-message/error-message.service';
import { AuthService } from '../../services/auth/auth.service';
import { SEVERITY_MESSAGE_SUMMARY } from '../fragments/table-wrapper/constants/common.constant';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [MessageService],
})
export class SignInComponent implements OnInit, OnDestroy {
  public username = '';

  public userPassword = '';

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
        this.displayMessage('Le nom et/ou le mot de passe ne sont pas valides.', 'error');
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  public onLogin(): void {
    if (!this.username || !this.userPassword) {
      this.displayMessage('Attention aux champs vides.', 'warn');
      return;
    }

    this.store.dispatch(loginUser({ username: this.username, password: this.userPassword }));
  }

  public onValueChange(value: string, field: 'username' | 'userPassword') {
    this[field] = value;
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
      key: 'applicationError', summary: SEVERITY_MESSAGE_SUMMARY[severity], severity, detail, life,
    });
  }
}
