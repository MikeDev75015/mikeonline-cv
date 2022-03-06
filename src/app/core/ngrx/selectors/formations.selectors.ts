import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormationsState } from '../reducers/formations.reducers';
import * as FormationsReducers from '../reducers/formations.reducers';

const formationsState = createFeatureSelector<FormationsState>('formations');

/**
 * Creates an ngrx selector allowing to retrieve all formations in FormationsState
 */
export const selectFormationsState = createSelector(
  formationsState,
  (state: FormationsState) => state,
);

/**
 * Creates an ngrx selector allowing to get the loaded status
 */
export const selectFormationsLoaded = createSelector(
  formationsState,
  (state: FormationsState) => state.loaded,
);

/**
 * Get the selectors
 */
const { selectAll } = FormationsReducers.adapter.getSelectors(selectFormationsState);

/**
 * Selector for all formations
 */
export const selectAllFormations = selectAll;
