import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCvInfo } from './core/ngrx/actions/cv-infos.actions';

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
    this.store.dispatch(loadCvInfo());
  }
}
