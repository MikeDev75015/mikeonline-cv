import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SkillsReducers from '../reducers/skills.reducers';
import { SkillsState } from '../reducers/skills.reducers';

const skillsState = createFeatureSelector<SkillsState>('skills');

/**
 * Creates an ngrx selector allowing to retrieve all skills in SkillsState
 */
export const selectSkillsState = createSelector(
  skillsState,
  (state: SkillsState) => state,
);

/**
 * Creates an ngrx selector allowing to get the loaded status
 */
export const selectSkillsLoaded = createSelector(
  skillsState,
  (state: SkillsState) => state.loaded,
);

/**
 * Get the selectors
 */
const { selectAll } = SkillsReducers.adapter.getSelectors(selectSkillsState);

/**
 * Selector for all skills
 */
export const selectAllSkills = selectAll;
