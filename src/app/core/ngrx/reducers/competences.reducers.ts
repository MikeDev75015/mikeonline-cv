import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ISkill } from '../../interfaces/models/v0/skill.interface';
import * as CompetencesActions from '../actions/competences.actions';

/**
 * Competences State
 */
export interface CompetencesState extends EntityState<ISkill> {
  loaded: boolean;
}

/**
 * Competences Adapter
 */
export const adapter: EntityAdapter<ISkill> = createEntityAdapter<ISkill>();

/**
 * Competences Initial State
 */
export const initialState: CompetencesState = adapter.getInitialState({
  loaded: false,
});

/**
 * Competences Reducer
 */
const competencesReducer = createReducer(
  initialState,
  on(CompetencesActions.fetchCompetencesSuccess, (state: CompetencesState, { competenceList }) =>({
    ...adapter.addMany(competenceList, state),
    loaded: true,
  })),
);

/**
 * Competences Reducer
 * @param state
 * @param action
 */
export function reducer(state: CompetencesState | undefined, action: Action): CompetencesState {
  return competencesReducer(state, action);
}
