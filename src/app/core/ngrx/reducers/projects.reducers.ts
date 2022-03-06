import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { IProject } from '../../interfaces/models/project.interface';
import * as ProjectsActions from '../actions/projects.actions';

/**
 * Projects State
 */
export interface ProjectsState extends EntityState<IProject> {
  loaded: boolean;
}

/**
 * Projects Adapter
 */
export const adapter: EntityAdapter<IProject> = createEntityAdapter<IProject>();

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
