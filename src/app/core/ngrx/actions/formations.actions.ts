import { createAction, props } from '@ngrx/store';
import { FormationV1 } from '../../interfaces/models/v1/formation.interface';

/**
 * Fetch Formations
 */
export const fetchFormations = createAction('[Formations] Fetch Formations');

/**
 * Fetch Formations Success
 */
export const fetchFormationsSuccess = createAction(
  '[Formations] Fetch Formations Success', props<{ formationList: FormationV1[] }>(),
);
