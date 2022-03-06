import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { IFormation } from '../../interfaces/models/formation.interface';
import * as FormationsActions from '../actions/formations.actions';

/**
 * Formations State
 */
export interface FormationsState extends EntityState<IFormation> {
  loaded: boolean;
}

/**
 * Formations Adapter
 */
export const adapter: EntityAdapter<IFormation> = createEntityAdapter<IFormation>();

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
