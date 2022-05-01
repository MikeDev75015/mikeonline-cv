import { createAction, props } from '@ngrx/store';
import { SkillV1 } from '../../interfaces/models/v1/skill.interface';

/**
 * Fetch Skills
 */
export const fetchSkills = createAction('[Skills] Fetch Skills');

/**
 * Fetch Skills Success
 */
export const fetchSkillsSuccess = createAction(
  '[Skills] Fetch Skills Success', props<{ skillList: SkillV1[] }>(),
);
