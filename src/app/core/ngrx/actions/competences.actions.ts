import { createAction, props } from '@ngrx/store';
import { SkillV1 } from '../../interfaces/models/v1/skill.interface';

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
  '[Competences] Fetch Competences Success', props<{ competenceList: SkillV1[] }>(),
);
