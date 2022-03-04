import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from '../reducers/projects.reducers';
import * as ProjectsReducers from '../reducers/projects.reducers';

const projectsState = createFeatureSelector<ProjectsState>('projects');

/**
 * Creates an ngrx selector allowing to retrieve all projects in ProjectsState
 */
export const selectProjectsState = createSelector(
  projectsState,
  (state: ProjectsState) => state,
);

/**
 * Get the selectors
 */
const { selectAll } = ProjectsReducers.adapter.getSelectors(selectProjectsState);

/**
 * Selector for all projects
 */
export const selectAllProjects = selectAll;
