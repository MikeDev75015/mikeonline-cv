import { Action, createReducer, on } from '@ngrx/store';
import { UserV1 } from '../../interfaces/models/v1/user.interface';
import {
  getUserSuccess,
  loginUserSuccess,
  logoutUser,
  logoutUserFailure,
  logoutUserSuccess,
} from '../actions/auth.actions';

export interface AuthState {
  accessToken: string;

  currentUser?: UserV1;
}

export const initialState: AuthState = {
  accessToken: '',
  currentUser: undefined,
};

const authReducer = createReducer(
  initialState,
  on(loginUserSuccess, (state: AuthState, { accessToken }): AuthState => ({ ...state, accessToken })),
  on(getUserSuccess, (state: AuthState, { user }): AuthState => ({ ...state, currentUser: user })),
  on(logoutUser, (state: AuthState): AuthState => ({ ...state, currentUser: undefined })),
  on(logoutUserSuccess, (state: AuthState): AuthState => ({ ...state, accessToken: '' })),
  on(logoutUserFailure, (state: AuthState): AuthState => ({ ...state, accessToken: '' })),
);

export function reducer(state: AuthState | undefined, action: Action): AuthState {
  return authReducer(state, action);
}
