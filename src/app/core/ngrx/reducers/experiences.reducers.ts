import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { IExperience } from '../../interfaces/models/experience.interface';
import * as ExperiencesActions from '../actions/experiences.actions';

/**
 * Experiences State
 */
export interface ExperiencesState extends EntityState<IExperience> {
  selectedExperienceId?: number;
}

/**
 * Experiences Adapter
 */
export const adapter: EntityAdapter<IExperience> = createEntityAdapter<IExperience>();

/**
 * Experiences Initial State
 */
export const initialState: ExperiencesState = adapter.getInitialState({
  selectedExperienceId: undefined,
});

/**
 * Experiences Reducer
 */
const experiencesReducer = createReducer(
  initialState,
  on(ExperiencesActions.fetchExperiencesSuccess, (state: ExperiencesState, { experienceList }) => adapter.addMany(experienceList, state)),
);

/**
 * Experiences Reducer
 * @param state
 * @param action
 */
export function reducer(state: ExperiencesState | undefined, action: Action): ExperiencesState {
  return experiencesReducer(state, action);
}
