import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MockComponent } from 'ng2-mock-component';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AlertModule } from './core/core-index';
import { AddComponentsService } from './core/services/add-components/add-components.service';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        AlertModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      ],
      declarations: [
        AppComponent,
        MockComponent({
          selector: 'app-header',
          inputs: [],
        }),
        MockComponent({
          selector: 'app-main',
          inputs: [],
        }),
        MockComponent({
          selector: 'app-footer',
          inputs: [],
        }),
      ],
      providers: [
        AddComponentsService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    TestBed.get(AddComponentsService);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
