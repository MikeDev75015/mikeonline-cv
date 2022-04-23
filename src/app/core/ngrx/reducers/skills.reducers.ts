import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { SkillV1 } from '../../interfaces/models/v1/skill.interface';
import * as CompetencesActions from '../actions/skills.actions';

/**
 * Competences State
 */
export interface SkillsState extends EntityState<SkillV1> {
  loaded: boolean;
}

/**
 * Competences Adapter
 */
export const adapter: EntityAdapter<SkillV1> = createEntityAdapter<SkillV1>();

/**
 * Competences Initial State
 */
export const initialState: SkillsState = adapter.getInitialState({
  loaded: false,
});

/**
 * Competences Reducer
 */
const competencesReducer = createReducer(
  initialState,
  on(CompetencesActions.fetchSkillsSuccess, (state: SkillsState, { skillList }) => ({
    ...adapter.addMany(skillList, state),
    loaded: true,
  })),
);

/**
 * Competences Reducer
 * @param state
 * @param action
 */
export function reducer(state: SkillsState | undefined, action: Action): SkillsState {
  return competencesReducer(state, action);
}
