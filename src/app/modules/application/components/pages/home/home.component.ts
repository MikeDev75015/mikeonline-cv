import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../../../../shared';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: false
})
export class HomeComponent implements OnInit {
  /**
   * An observable allowing to initialize the page when data are loaded.
   */
  public isLoadingData$: Observable<boolean> = of(true);

  /**
   * @ignore
   * @param dataService
   */
  constructor(
    private readonly dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.isLoadingData$ = this.dataService.isAllDataLoaded().pipe(
      map((isAllDataLoaded) => !isAllDataLoaded),
    );
  }
}
