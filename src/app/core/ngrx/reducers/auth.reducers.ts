import { Action, createReducer, on } from '@ngrx/store';
import { UserV1 } from '../../interfaces/models/v1/user.interface';
import { getUserFailure, getUserSuccess, logoutUser } from '../actions/auth.actions';

export interface AuthState {
  currentUser?: UserV1;
}

export const initialState: AuthState = {
  currentUser: undefined,
};

const authReducer = createReducer(
  initialState,
  on(getUserSuccess, (state: AuthState, { user }): AuthState => ({ ...state, currentUser: user })),
  on(getUserFailure, (state: AuthState): AuthState => ({ ...state, currentUser: undefined })),
  on(logoutUser, (state: AuthState): AuthState => ({ ...state, currentUser: undefined })),
);

export function reducer(state: AuthState | undefined, action: Action): AuthState {
  return authReducer(state, action);
}
