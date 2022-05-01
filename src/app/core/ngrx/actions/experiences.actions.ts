import { createAction, props } from '@ngrx/store';
import { ExperienceV1 } from '../../interfaces/models/v1/experience.interface';

/**
 * Fetch Experiences
 */
export const fetchExperiences = createAction('[Experiences] Fetch Experiences');

/**
 * Fetch Experiences Success
 */
export const fetchExperiencesSuccess = createAction(
  '[Experiences] Fetch Experiences Success', props<{ experienceList: ExperienceV1[] }>(),
);
