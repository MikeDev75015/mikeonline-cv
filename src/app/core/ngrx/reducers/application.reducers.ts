import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationActions from '../actions/application.actions';

export interface AppState {
  appLoading?: boolean;
  appLoadingError: boolean;
  hideHeader: boolean;
}

export const initialState: AppState = {
  appLoadingError: false,
  appLoading: undefined,
  hideHeader: false,
};

const applicationReducer = createReducer(
  initialState,
  on(ApplicationActions.startAppLoading, (state: AppState): AppState => ({ ...state, appLoading: true })),
  on(ApplicationActions.endAppLoading, (state: AppState): AppState => ({ ...state, appLoading: false })),
  on(ApplicationActions.appLoadingSuccess, (state: AppState): AppState => ({ ...state, appLoadingError: false })),
  on(ApplicationActions.appLoadingFailure, (state: AppState): AppState => ({ ...state, appLoadingError: true })),
  on(ApplicationActions.showHeader, (state: AppState): AppState => ({ ...state, hideHeader: false })),
  on(ApplicationActions.hideHeader, (state: AppState): AppState => ({ ...state, hideHeader: true })),
);

export function reducer(state: AppState | undefined, action: Action): AppState {
  return applicationReducer(state, action);
}
