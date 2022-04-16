import { createAction, props } from '@ngrx/store';
import { ISkill } from '../../interfaces/models/skill.interface';

/**
 * Fetch Competences
 */
export const fetchCompetences = createAction('[Competences] Fetch Competences');

/**
 * Fetch Competences Failure
 */
export const fetchCompetencesFailure = createAction('[Competences] Fetch Competences Failure');

/**
 * Fetch Competences Success
 */
export const fetchCompetencesSuccess = createAction(
  '[Competences] Fetch Competences Success', props<{ competenceList: ISkill[] }>(),
);
