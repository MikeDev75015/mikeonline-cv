import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as ExperiencesReducers from '../reducers/experiences.reducers';
import { ExperiencesState } from '../reducers/experiences.reducers';

const experiencesState = createFeatureSelector<ExperiencesState>('experiences');

/**
 * Creates an ngrx selector allowing to retrieve all experiences in ExperiencesState
 */
export const selectExperiencesState = createSelector(
  experiencesState,
  (state: ExperiencesState) => state,
);

/**
 * Creates an ngrx selector allowing to get the loaded status
 */
export const selectExperiencesLoaded = createSelector(
  experiencesState,
  (state: ExperiencesState) => state.loaded,
);

/**
 * Get the selectors
 */
const { selectAll } = ExperiencesReducers.adapter.getSelectors(selectExperiencesState);

/**
 * Selector for all experiences
 */
export const selectAllExperiences = selectAll;
