import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './core/ngrx';
import { CompetencesEffects } from './core/ngrx/effects/competences.effects';
import { CvInfosEffects } from './core/ngrx/effects/cv-infos.effects';
import { ExperiencesEffects } from './core/ngrx/effects/experiences.effects';
import { FormationsEffects } from './core/ngrx/effects/formations.effects';
import { InterestsEffects } from './core/ngrx/effects/interests.effects';
import { ProjectsEffects } from './core/ngrx/effects/projects.effects';
import { TagsEffects } from './core/ngrx/effects/tags.effects';
import { HttpClientService } from './core/services/http-client.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      CvInfosEffects,
      TagsEffects,
      CompetencesEffects,
      ExperiencesEffects,
      FormationsEffects,
      ProjectsEffects,
      InterestsEffects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    CoreModule.forRoot(),
  ],
  providers: [
    HttpClientService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
