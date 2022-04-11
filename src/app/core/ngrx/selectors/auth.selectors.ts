import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducers';

const authState = createFeatureSelector<AuthState>('auth');

/**
 * Creates the ngrx selector allowing to retrieve the current user in AuthState
 */
export const selectCurrentUser = createSelector(
  authState,
  (state: AuthState) => state.currentUser,
);
