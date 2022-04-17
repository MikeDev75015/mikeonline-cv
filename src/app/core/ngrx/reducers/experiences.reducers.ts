import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ExperienceV1 } from '../../interfaces/models/v1/experience.interface';
import * as ExperiencesActions from '../actions/experiences.actions';

/**
 * Experiences State
 */
export interface ExperiencesState extends EntityState<ExperienceV1> {
  loaded: boolean;
}

/**
 * Experiences Adapter
 */
export const adapter: EntityAdapter<ExperienceV1> = createEntityAdapter<ExperienceV1>();

/**
 * Experiences Initial State
 */
export const initialState: ExperiencesState = adapter.getInitialState({
  loaded: false,
});

/**
 * Experiences Reducer
 */
const experiencesReducer = createReducer(
  initialState,
  on(ExperiencesActions.fetchExperiencesSuccess, (state: ExperiencesState, { experienceList }) => ({
    ...adapter.addMany(experienceList, state),
    loaded: true,
  })),
);

/**
 * Experiences Reducer
 * @param state
 * @param action
 */
export function reducer(state: ExperiencesState | undefined, action: Action): ExperiencesState {
  return experiencesReducer(state, action);
}
