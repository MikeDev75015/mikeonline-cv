import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromApplication from './reducers/application.reducers';
import * as fromAuth from './reducers/auth.reducers';
import * as fromCvInfos from './reducers/cv-infos.reducers';
import * as fromExperiences from './reducers/experiences.reducers';
import * as fromFormations from './reducers/formations.reducers';
import * as fromInterests from './reducers/interests.reducers';
import * as fromProjects from './reducers/projects.reducers';
import * as fromSkills from './reducers/skills.reducers';
import * as fromTags from './reducers/tags.reducers';

/**
 * Model of the global state of the application which will contain all the sub-states
 */
export interface State {
  application: fromApplication.ApplicationState;

  cvInfos: fromCvInfos.CvInfosState;

  tags: fromTags.TagsState;

  skills: fromSkills.SkillsState;

  experiences: fromExperiences.ExperiencesState;

  formations: fromFormations.FormationsState;

  projects: fromProjects.ProjectsState;

  interests: fromInterests.InterestsState;

  auth: fromAuth.AuthState;
}

/**
 * Reference all the reducers of the application
 */
export const reducers: ActionReducerMap<State> = {
  application: fromApplication.reducer,
  cvInfos: fromCvInfos.reducer,
  tags: fromTags.reducer,
  skills: fromSkills.reducer,
  experiences: fromExperiences.reducer,
  formations: fromFormations.reducer,
  projects: fromProjects.reducer,
  interests: fromInterests.reducer,
  auth: fromAuth.reducer,
};

/**
 * Allows to log all the dispatched actions
 * @param reducer
 */
export function debug(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action): State => reducer(state, action);
}

/**
 * Contains a list of meta-reducer. Meta-reducers allow developers to pre-process actions before normal reducers are invoked.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [debug]
  : [];

/* Actions */
export * as ApplicationActions from './actions/application.actions';
export * as CvInfosActions from './actions/cv-infos.actions';
export * as TagsActions from './actions/tags.actions';
export * as SkillsActions from './actions/skills.actions';
export * as ExperiencesActions from './actions/experiences.actions';
export * as FormationsActions from './actions/formations.actions';
export * as ProjectsActions from './actions/projects.actions';
export * as InterestsActions from './actions/interests.actions';
export * as AuthActions from './actions/auth.actions';

/* Effects */
export { ApplicationEffects } from './effects/application.effects';
export { CvInfosEffects } from './effects/cv-infos.effects';
export { TagsEffects } from './effects/tags.effects';
export { SkillsEffects } from './effects/skills.effects';
export { ExperiencesEffects } from './effects/experiences.effects';
export { FormationsEffects } from './effects/formations.effects';
export { ProjectsEffects } from './effects/projects.effects';
export { InterestsEffects } from './effects/interests.effects';
export { AuthEffects } from './effects/auth.effects';

/* Selectors */
export * as ApplicationSelectors from'./selectors/application.selectors';
export * as CvInfosSelectors from './selectors/cv-infos.selectors';
export * as TagsSelectors from './selectors/tags.selectors';
export * as SkillsSelectors from './selectors/skills.selectors';
export * as ExperiencesSelectors from './selectors/experiences.selectors';
export * as FormationsSelectors from './selectors/formations.selectors';
export * as ProjectsSelectors from './selectors/projects.selectors';
export * as InterestsSelectors from './selectors/interests.selectors';
export * as AuthSelectors from './selectors/auth.selectors';
