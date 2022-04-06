import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KnobModule } from 'primeng/knob';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  BtnMobileContactComponent,
} from './components/fragments/contact/btn-mobile-contact/btn-mobile-contact.component';
import { ContactComponent } from './components/fragments/contact/contact.component';
import { BottomFooterComponent } from './components/fragments/footer/bottom-footer/bottom-footer.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { LeftFooterComponent } from './components/fragments/footer/left-footer/left-footer.component';
import { HeaderComponent } from './components/fragments/header/header.component';
import { MainComponent } from './components/fragments/main/main.component';
import { OneLetterByLinePipe } from './components/fragments/vertical-accordion/pipes/one-letter-by-line.pipe';
import {
  VerticalAccordionItemComponent,
} from './components/fragments/vertical-accordion/vertical-accordion-item/vertical-accordion-item.component';
import { VerticalAccordionComponent } from './components/fragments/vertical-accordion/vertical-accordion.component';
import {
  ExperienceItemDetailComponent,
} from './components/pages/experiences/experience-item-detail/experience-item-detail.component';
import { ItemComponent } from './components/fragments/item/item.component';
import { ExperiencesComponent } from './components/pages/experiences/experiences.component';
import {
  FormationItemDetailComponent,
} from './components/pages/formations/formation-item-detail/formation-item-detail.component';
import { FormationsComponent } from './components/pages/formations/formations.component';
import { InterestsComponent } from './components/pages/interests/interests.component';
import { ProjectItemComponent } from './components/pages/portfolio/portfolio-item/project-item.component';
import { PortfolioComponent } from './components/pages/portfolio/portfolio.component';
import { SkillsComponent } from './components/pages/skills/skills.component';
import { CoreModule } from './core/core.module';
import { AlertModule } from './core/modules/alert/alert.module';
import { LoggerModule } from './core/modules/logger/logger.module';
import { ApplicationEffects } from './core/ngrx/effects/application.effects';
import { CompetencesEffects } from './core/ngrx/effects/competences.effects';
import { CvInfosEffects } from './core/ngrx/effects/cv-infos.effects';
import { ExperiencesEffects } from './core/ngrx/effects/experiences.effects';
import { FormationsEffects } from './core/ngrx/effects/formations.effects';
import { InterestsEffects } from './core/ngrx/effects/interests.effects';
import { ProjectsEffects } from './core/ngrx/effects/projects.effects';
import { TagsEffects } from './core/ngrx/effects/tags.effects';
import { metaReducers, reducers } from './core/ngrx/ngrx-index';
import { HttpClientService } from './core/services/http-client/http-client.service';
import { PdfCreatorService } from './core/services/pdf-creator/pdf-creator.service';
import { FirstLetterUppercasePipe, HeaderTitleFormatPipe, IncompressibleSpacePipe } from './shared/shared-index';
import { DynamicComponentLoaderDirective } from './components/fragments/main/directives/dynamic-component-loader.directive';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { ItemTagListComponent } from './components/fragments/item-elements/item-tag-list/item-tag-list.component';
import { ItemOpenCloseButtonsComponent } from './components/fragments/item-elements/item-open-close-buttons/item-open-close-buttons.component';
import { ItemDatesComponent } from './components/fragments/item-elements/item-dates/item-dates.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    SkillsComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent,
    ContactComponent,
    ItemComponent,
    ExperienceItemDetailComponent,
    FormationItemDetailComponent,
    ProjectItemComponent,
    BottomFooterComponent,
    LeftFooterComponent,
    VerticalAccordionComponent,
    VerticalAccordionItemComponent,
    BtnMobileContactComponent,
    OneLetterByLinePipe,
    HeaderTitleFormatPipe,
    IncompressibleSpacePipe,
    FirstLetterUppercasePipe,
    DynamicComponentLoaderDirective,
    DateFormatPipe,
    ItemTagListComponent,
    ItemOpenCloseButtonsComponent,
    ItemDatesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      ApplicationEffects,
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
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatTreeModule,
    MatExpansionModule,
    MatBadgeModule,
    FontAwesomeModule,
    LoggerModule,
    AlertModule,
    KnobModule,
    FormsModule,
  ],
  providers: [
    HttpClientService,
    PdfCreatorService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SkillsComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
