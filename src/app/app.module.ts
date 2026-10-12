import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertModule, LoggerModule } from './core';
import { CoreModule } from './core/core.module';
import { backendHttpInterceptor, httpInterceptorProviders } from './core/interceptors';
import {
  ApplicationEffects,
  AuthEffects,
  CvInfosEffects,
  ExperiencesEffects,
  FormationsEffects,
  InterestsEffects,
  metaReducers,
  ProjectsEffects,
  reducers,
  SkillsEffects,
  TagsEffects,
} from './core/ngrx/ngrx-index';
import { HttpClientService } from './core/services/http-client/http-client.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule.forRoot(),
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([
            ApplicationEffects,
            CvInfosEffects,
            TagsEffects,
            SkillsEffects,
            ExperiencesEffects,
            FormationsEffects,
            ProjectsEffects,
            InterestsEffects,
            AuthEffects,
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
            },
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        LoggerModule,
        AlertModule], providers: [
        environment.interceptBackendRequest
            ? [
                ...httpInterceptorProviders,
                ...backendHttpInterceptor,
            ]
            : httpInterceptorProviders,
        HttpClientService,
        MessageService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {
}
