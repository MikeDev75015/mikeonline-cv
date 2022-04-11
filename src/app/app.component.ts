import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as ApplicationActions from './core/ngrx/actions/application.actions';
import { PwaService } from './core/services/pwa/pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly translateService: TranslateService,
    private readonly pwaService: PwaService,
  ) {
    translateService.setDefaultLang('fr');
    translateService.use('fr');
  }

  public ngOnInit(): void {
    this.store.dispatch(ApplicationActions.startAppLoading());
    this.pwaService.initializeServiceWorker();
  }
}
