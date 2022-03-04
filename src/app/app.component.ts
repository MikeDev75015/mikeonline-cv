import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CvInfosActions from './core/ngrx/actions/cv-infos.actions';
import * as TagsActions from './core/ngrx/actions/tags.actions';
import * as CompetencesActions from './core/ngrx/actions/competences.actions';
import * as ExperiencesActions from './core/ngrx/actions/experiences.actions';
import * as FormationsActions from './core/ngrx/actions/formations.actions';
import * as ProjectsActions from './core/ngrx/actions/projects.actions';
import * as InterestsActions from './core/ngrx/actions/interests.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ocv-front';

  constructor(
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(CvInfosActions.loadCvInfos());
    this.store.dispatch(TagsActions.fetchTags());
    this.store.dispatch(CompetencesActions.fetchCompetences());
    this.store.dispatch(ExperiencesActions.fetchExperiences());
    this.store.dispatch(FormationsActions.fetchFormations());
    this.store.dispatch(ProjectsActions.fetchProjects());
    this.store.dispatch(InterestsActions.fetchInterests());
  }
}
