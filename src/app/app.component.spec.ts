import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng2-mock-component';
import { animationServiceMock } from './__mocks__/services/animation-service.mock';
import { dataServiceMock } from './__mocks__/services/data-service.mock';
import { storeMock } from './__mocks__/services/store.mock';
import { AppComponent } from './app.component';
import { AnimationsService } from './core/services/animations/animations.service';
import { ContactOpenCloseService } from './core/services/contact-open-close/contact-open-close.service';
import { PwaService } from './core/services/pwa/pwa.service';
import { DataService, UtilsService } from './shared/shared-index';

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'app-header', inputs: [] }),
        MockComponent({ selector: 'app-main', inputs: [] }),
        MockComponent({ selector: 'app-footer', inputs: ['mobile', 'hideHeader'] }),
        MockComponent({ selector: 'app-contact', inputs: ['hidden', 'mobileView'] }),
      ],
      providers: [
        { provide: PwaService, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: ContactOpenCloseService, useValue: {} },
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
