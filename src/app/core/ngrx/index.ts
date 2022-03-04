import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromCvInfos from './reducers/cv-infos.reducers';
import * as fromTags from './reducers/tags.reducers';
import * as fromCompetences from './reducers/competences.reducers';
import * as fromExperiences from './reducers/experiences.reducers';
import * as fromFormations from './reducers/formations.reducers';
import * as fromProjects from './reducers/projects.reducers';
import * as fromInterests from './reducers/interests.reducers';

/**
 * Model of the global state of the application which will contain all the sub-states
 */
export interface State {
  cvInfos: fromCvInfos.CvInfosState;
  tagList: fromTags.TagsState;
  competenceList: fromCompetences.CompetencesState;
  experienceList: fromExperiences.ExperiencesState;
  formationList: fromFormations.FormationsState;
  projectList: fromProjects.ProjectsState;
  interestList: fromInterests.InterestsState;
}

/**
 * Reference all the reducers of the application
 */
export const reducers: ActionReducerMap<State> = {
  cvInfos: fromCvInfos.reducer,
  tagList: fromTags.reducer,
  competenceList: fromCompetences.reducer,
  experienceList: fromExperiences.reducer,
  formationList: fromFormations.reducer,
  projectList: fromProjects.reducer,
  interestList: fromInterests.reducer,
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
