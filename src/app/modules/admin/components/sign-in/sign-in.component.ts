import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { loginUser } from '../../../../core/ngrx/actions/auth.actions';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [MessageService],
})
export class SignInComponent {
  public username = '';

  public userPassword = '';

  constructor(
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
  }

  public async onLogin(): Promise<void> {
    if (!this.username || !this.userPassword) {
      this.messageService.add({
        key: 'signInToast',
        severity: 'warn',
        summary: 'Oups !',
        detail: 'Attention aux champs vides.',
        life: 3000,
      });

      return;
    }

    this.store.dispatch(loginUser({ username: this.username, password: this.userPassword }));
  }

  public onValueChange(value: string, field: 'username' | 'userPassword') {
    this[field] = value;
  }
}
