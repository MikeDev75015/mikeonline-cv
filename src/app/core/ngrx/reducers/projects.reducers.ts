import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ProjectV1 } from '../../interfaces/models/v1/project.interface';
import * as ProjectsActions from '../actions/projects.actions';

/**
 * Projects State
 */
export interface ProjectsState extends EntityState<ProjectV1> {
  loaded: boolean;
}

/**
 * Projects Adapter
 */
export const adapter: EntityAdapter<ProjectV1> = createEntityAdapter<ProjectV1>();

/**
 * Projects Initial State
 */
export const initialState: ProjectsState = adapter.getInitialState({
  loaded: false,
});

/**
 * Projects Reducer
 */
const projectsReducer = createReducer(
  initialState,
  on(ProjectsActions.fetchProjectsSuccess, (state: ProjectsState, { projectList }) => ({
    ...adapter.addMany(projectList, state),
    loaded: true,
  })),
);

/**
 * Projects Reducer
 * @param state
 * @param action
 */
export function reducer(state: ProjectsState | undefined, action: Action): ProjectsState {
  return projectsReducer(state, action);
}
