import { Action, createReducer, on } from '@ngrx/store';
import { IUser } from '../../interfaces/models/user.interface';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  currentUser?: IUser;
}

export const initialState: AuthState = {
  currentUser: undefined,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginUserSuccess, (state: AuthState, { user }): AuthState => ({ ...state, currentUser: user })),
  on(AuthActions.logoutUser, (state: AuthState): AuthState => ({ ...state, currentUser: undefined })),
);

export function reducer(state: AuthState | undefined, action: Action): AuthState {
  return authReducer(state, action);
}
