import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../reducers/application.reducers';

/**
 * Returns the application state
 * @param state
 */
const applicationState = createFeatureSelector<ApplicationState>('application');

/**
 * Creates the ngrx selector allowing to retrieve the cvInfosLoaded in ApplicationState
 */
export const selectAppCvInfosLoaded = createSelector(
  applicationState,
  (state: ApplicationState): boolean => state.cvInfosLoaded,
);

/**
 * Creates the ngrx selector allowing to retrieve the hideHeader in ApplicationState
 */
export const selectAppHideHeader = createSelector(
  applicationState,
  (state: ApplicationState): boolean => state.hideHeader,
)
