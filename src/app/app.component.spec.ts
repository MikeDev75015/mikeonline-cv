import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng2-mock-component';
import { animationServiceMock } from './__mocks__/services/animation-service.mock';
import { dataServiceMock } from './__mocks__/services/data-service.mock';
import { storeMock } from './__mocks__/services/store.mock';
import { AppComponent } from './app.component';
import { AddComponentsService } from './core/services/add-components/add-components.service';
import { AnimationsService } from './core/services/animations/animations.service';
import { ContactOpenCloseService } from './core/services/contact-open-close/contact-open-close.service';
import { PwaService } from './core/services/pwa/pwa.service';
import { DataService, UtilsService } from './shared/shared-index';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
          inputs: ['mobile', 'hideHeader'],
        }),
        MockComponent({
          selector: 'app-contact',
          inputs: ['hidden', 'mobileView'],
        }),
      ],
      providers: [
        { provide: AddComponentsService, useValue: {} },
        { provide: PwaService, useValue: {} },
        { provide: Store, useValue: storeMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: UtilsService, useValue: {} },
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: ContactOpenCloseService, useValue: {} },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
