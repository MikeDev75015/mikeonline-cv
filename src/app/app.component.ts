import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PwaService } from './core/services/pwa/pwa.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {
  constructor(
    private readonly translateService: TranslateService,
    private readonly pwaService: PwaService,
  ) {
    translateService.setDefaultLang('fr');
    translateService.use('fr');
  }

  public ngOnInit(): void {
    this.pwaService.initializeServiceWorker();
  }
}
