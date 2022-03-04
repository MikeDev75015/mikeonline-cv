import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ICompetence } from '../../interfaces/models/competence.interface';
import * as CompetencesActions from '../actions/competences.actions';

/**
 * Competences State
 */
export interface CompetencesState extends EntityState<ICompetence> {
  selectedCompetenceId?: number;
}

/**
 * Competences Adapter
 */
export const adapter: EntityAdapter<ICompetence> = createEntityAdapter<ICompetence>();

/**
 * Competences Initial State
 */
export const initialState: CompetencesState = adapter.getInitialState({
  selectedCompetenceId: undefined,
});

/**
 * Competences Reducer
 */
const competencesReducer = createReducer(
  initialState,
  on(CompetencesActions.fetchCompetencesSuccess, (state: CompetencesState, { competenceList }) => adapter.addMany(competenceList, state)),
);

/**
 * Competences Reducer
 * @param state
 * @param action
 */
export function reducer(state: CompetencesState | undefined, action: Action): CompetencesState {
  return competencesReducer(state, action);
}
