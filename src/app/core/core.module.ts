import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './ngrx';
import { environment } from '../../environments/environment';
import { CvInfosEffects } from './ngrx/effects/cv-infos.effects';
import { HttpClientService } from './services/http-client.service';

const importList = [
  CommonModule,
  HttpClientModule,
  EffectsModule.forRoot([
    CvInfosEffects,
  ]),
  StoreModule.forRoot(reducers, { metaReducers }),
  StoreDevtoolsModule.instrument({
    maxAge: 25, // Retains last 25 states
    logOnly: environment.production, // Restrict extension to log-only mode
    autoPause: true, // Pauses recording actions and state changes when the extension window is not open
  }),
];

const serviceList = [
  HttpClientService,
];

const providerList: Provider[] = [
  serviceList,
];

@NgModule({
  declarations: [],
  imports: importList,
})
export class CoreModule {
  /**
   * Prevents the CoreModule to be imported twice
   *
   * @param parentModule CoreModule if it exists from the parent scope of Dependency Injection.
   * @throws an Error, if it resolves a CoreModule from the parent DI scope.
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('You are trying to import the CoreModule twice (already loaded)');
    }
  }

  /**
   * The root {@link AppModule} imports the {@link CoreModule} and adds the `providers` to the {@link AppModule}
   * providers. Recommended in the
   * [Angular 2 docs - CoreModule.forRoot](https://angular.io/docs/ts/latest/guide/ngmodule.html#core-for-root)
   */
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModule,
      providers: providerList,
    };
  }
}
