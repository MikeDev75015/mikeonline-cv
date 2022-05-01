import { createAction, props } from '@ngrx/store';
import { ProjectV1 } from '../../interfaces/models/v1/project.interface';

/**
 * Fetch Projects
 */
export const fetchProjects = createAction('[Projects] Fetch Projects');

/**
 * Fetch Projects Success
 */
export const fetchProjectsSuccess = createAction(
  '[Projects] Fetch Projects Success', props<{ projectList: ProjectV1[] }>(),
);
