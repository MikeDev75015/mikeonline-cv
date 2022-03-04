import { createAction, props } from '@ngrx/store';
import { IProject } from '../../interfaces/models/project.interface';

/**
 * Fetch Projects
 */
export const fetchProjects = createAction('[Projects] Fetch Projects');

/**
 * Fetch Projects Failure
 */
export const fetchProjectsFailure = createAction('[Projects] Fetch Projects Failure');

/**
 * Fetch Projects Success
 */
export const fetchProjectsSuccess = createAction(
  '[Projects] Fetch Projects Success', props<{ projectList: IProject[] }>(),
);
