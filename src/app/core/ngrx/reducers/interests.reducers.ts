import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { IInterest } from '../../interfaces/models/interest.interface';
import * as InterestsActions from '../actions/interests.actions';

/**
 * Interests State
 */
export interface InterestsState extends EntityState<IInterest> {
  selectedInterestId?: number;
}

/**
 * Interests Adapter
 */
export const adapter: EntityAdapter<IInterest> = createEntityAdapter<IInterest>();

/**
 * Interests Initial State
 */
export const initialState: InterestsState = adapter.getInitialState({
  selectedInterestId: undefined,
});

/**
 * Interests Reducer
 */
const interestsReducer = createReducer(
  initialState,
  on(InterestsActions.fetchInterestsSuccess, (state: InterestsState, { interestList }) => adapter.addMany(interestList, state)),
);

/**
 * Interests Reducer
 * @param state
 * @param action
 */
export function reducer(state: InterestsState | undefined, action: Action): InterestsState {
  return interestsReducer(state, action);
}
