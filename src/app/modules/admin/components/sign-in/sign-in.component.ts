import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginUser } from '../../../../core/ngrx/actions/auth.actions';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  public username = '';

  public userPassword = '';

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
  }

  async onLogin(): Promise<void> {
    this.store.dispatch(loginUser({ username: this.username, password: this.userPassword }));
  }
}
