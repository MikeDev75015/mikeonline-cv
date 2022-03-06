import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InterestsState } from '../reducers/interests.reducers';
import * as InterestsReducers from '../reducers/interests.reducers';

const interestsState = createFeatureSelector<InterestsState>('interests');

/**
 * Creates an ngrx selector allowing to retrieve all interests in InterestsState
 */
export const selectInterestsState = createSelector(
  interestsState,
  (state: InterestsState) => state,
);

/**
 * Creates an ngrx selector allowing to get the loaded status
 */
export const selectInterestsLoaded = createSelector(
  interestsState,
  (state: InterestsState) => state.loaded,
);

/**
 * Get the selectors
 */
const { selectAll } = InterestsReducers.adapter.getSelectors(selectInterestsState);

/**
 * Selector for all interests
 */
export const selectAllInterests = selectAll;
