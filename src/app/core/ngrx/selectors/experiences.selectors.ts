import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExperiencesState } from '../reducers/experiences.reducers';
import * as ExperiencesReducers from '../reducers/experiences.reducers';

const experiencesState = createFeatureSelector<ExperiencesState>('experiences');

/**
 * Creates an ngrx selector allowing to retrieve all experiences in ExperiencesState
 */
export const selectExperiencesState = createSelector(
  experiencesState,
  (state: ExperiencesState) => state,
);

/**
 * Get the selectors
 */
const { selectAll } = ExperiencesReducers.adapter.getSelectors(selectExperiencesState);

/**
 * Selector for all experiences
 */
export const selectAllExperiences = selectAll;
