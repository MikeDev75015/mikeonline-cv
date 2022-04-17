import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FormationV1 } from '../../interfaces/models/v1/formation.interface';
import * as FormationsActions from '../actions/formations.actions';

/**
 * Formations State
 */
export interface FormationsState extends EntityState<FormationV1> {
  loaded: boolean;
}

/**
 * Formations Adapter
 */
export const adapter: EntityAdapter<FormationV1> = createEntityAdapter<FormationV1>();

/**
 * Formations Initial State
 */
export const initialState: FormationsState = adapter.getInitialState({
  loaded: false,
});

/**
 * Formations Reducer
 */
const formationsReducer = createReducer(
  initialState,
  on(FormationsActions.fetchFormationsSuccess, (state: FormationsState, { formationList }) => ({
    ...adapter.addMany(formationList, state),
    loaded: true,
  })),
);

/**
 * Formations Reducer
 * @param state
 * @param action
 */
export function reducer(state: FormationsState | undefined, action: Action): FormationsState {
  return formationsReducer(state, action);
}
