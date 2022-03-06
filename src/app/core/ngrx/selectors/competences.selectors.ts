import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompetencesState } from '../reducers/competences.reducers';
import * as CompetencesReducers from '../reducers/competences.reducers';

const competencesState = createFeatureSelector<CompetencesState>('competences');

/**
 * Creates an ngrx selector allowing to retrieve all competences in CompetencesState
 */
export const selectCompetencesState = createSelector(
  competencesState,
  (state: CompetencesState) => state,
);

/**
 * Creates an ngrx selector allowing to get the loaded status
 */
export const selectCompetencesLoaded = createSelector(
  competencesState,
  (state: CompetencesState) => state.loaded,
);

/**
 * Get the selectors
 */
const { selectAll } = CompetencesReducers.adapter.getSelectors(selectCompetencesState);

/**
 * Selector for all competences
 */
export const selectAllCompetences = selectAll;
