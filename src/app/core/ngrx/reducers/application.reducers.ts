import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationActions from '../actions/application.actions';

export interface ApplicationState {
  appLoading?: boolean;
  appLoadingError: boolean;
  cvInfosLoaded: boolean;
  hideHeader: boolean;
}

export const initialState: ApplicationState = {
  appLoading: undefined,
  cvInfosLoaded: false,
  hideHeader: false,
  appLoadingError: false,
};

const applicationReducer = createReducer(
  initialState,
  on(ApplicationActions.startAppLoading, (state: ApplicationState): ApplicationState => ({ ...state, appLoading: true })),
  on(ApplicationActions.endAppLoading, (state: ApplicationState): ApplicationState => ({ ...state, appLoading: false })),
  on(ApplicationActions.appLoadingSuccess, (state: ApplicationState): ApplicationState => ({ ...state, appLoadingError: false })),
  on(ApplicationActions.appLoadingFailure, (state: ApplicationState): ApplicationState => ({ ...state, appLoadingError: true })),

  on(ApplicationActions.cvInfosLoaded, (state: ApplicationState): ApplicationState => ({ ...state, cvInfosLoaded: true })),

  on(ApplicationActions.showHeader, (state: ApplicationState): ApplicationState => ({ ...state, hideHeader: false })),
  on(ApplicationActions.hideHeader, (state: ApplicationState): ApplicationState => ({ ...state, hideHeader: true })),
);

export function reducer(state: ApplicationState | undefined, action: Action): ApplicationState {
  return applicationReducer(state, action);
}
