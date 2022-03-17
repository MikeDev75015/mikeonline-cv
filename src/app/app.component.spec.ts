import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng2-mock-component';
import { animationServiceMock } from './__mocks__/services/animation-service.mock';
import { contactOpenCloseServiceMock } from './__mocks__/services/contact-open-close-service.mock';
import { dataServiceMock } from './__mocks__/services/data-service.mock';
import { pwaServiceMock } from './__mocks__/services/pwa-service.mock';
import { storeMock } from './__mocks__/services/store.mock';
import { utilsServiceMock } from './__mocks__/services/utils-service.mock';
import { AppComponent } from './app.component';
import { AnimationsService } from './core/services/animations/animations.service';
import { ContactOpenCloseService } from './core/services/contact-open-close/contact-open-close.service';
import { PwaService } from './core/services/pwa/pwa.service';
import { DataService, UtilsService } from './shared/shared-index';

describe('AppComponent', () => {
  let component: AppComponent;

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
        { provide: PwaService, useValue: pwaServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: ContactOpenCloseService, useValue: contactOpenCloseServiceMock },
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: Store, useValue: storeMock },
      ],
      imports: [
        NoopAnimationsModule,
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ getPropertyValue: jest.fn() }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
    expect(animationServiceMock.onPhase).toHaveBeenCalledTimes(2);
  });

  describe('showHeader', () => {
    it('should set isHeaderHidden to false', () => {
      component.showHeader();
      expect(component.isHeaderHidden).toBeFalsy();
    });
  });

  describe('hideHeader', () => {
    it('should set isHeaderHidden to true', () => {
      component.hideHeader();
      setTimeout(() => {
        expect(component.isHeaderHidden).toBeTruthy();
      }, component['timeOutTimeToHide']);
    });
  });
});
