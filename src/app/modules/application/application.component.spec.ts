import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng2-mock-component';
import { of } from 'rxjs';
import { animationServiceMock } from '../../../../__mocks__/services/animation-service.mock';
import { contactOpenCloseServiceMock } from '../../../../__mocks__/services/contact-open-close-service.mock';
import { dataServiceMock } from '../../../../__mocks__/services/data-service.mock';
import { storeMock } from '../../../../__mocks__/services/store.mock';
import { utilsServiceMock } from '../../../../__mocks__/services/utils-service.mock';
import * as ApplicationActions from '../../core/ngrx/actions/application.actions';
import { ContactOpenCloseService } from '../../core/services/contact-open-close/contact-open-close.service';
import { DataService, UtilsService } from '../../shared';
import { AnimationsService } from '../../shared/services/animations/animations.service';

import { ApplicationComponent } from './application.component';

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ApplicationComponent,
        MockComponent({ selector: 'app-header', inputs: [] }),
        MockComponent({ selector: 'app-main', inputs: [] }),
        MockComponent({ selector: 'app-footer', inputs: ['mobile', 'hideHeader'] }),
        MockComponent({ selector: 'app-contact', inputs: ['hidden', 'mobileView'] }),
      ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: ContactOpenCloseService, useValue: contactOpenCloseServiceMock },
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: Store, useValue: storeMock },
      ],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ getPropertyValue: jest.fn() }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let dispatchSpy: any;

    beforeEach(() => {
      jest.spyOn(dataServiceMock, 'isAllDataLoaded').mockImplementationOnce(() => of(true));
      dispatchSpy = jest.spyOn(storeMock, 'dispatch');
      fixture.detectChanges();
    });

    it('should dispatch ApplicationActions.appLoadingSuccess and ApplicationActions.startAppLoading if all data is loaded', () => {
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, ApplicationActions.appLoadingSuccess());
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, ApplicationActions.startAppLoading());
    });
  });

  describe('showHeader', () => {
    it('should set isHeaderHidden to false', () => {
      fixture.detectChanges();
      component.showHeader();
      expect(component.isHeaderHidden).toBeFalsy();
    });
  });

  describe('hideHeader', () => {
    it('should set isHeaderHidden to true', () => {
      fixture.detectChanges();
      component.hideHeader();
      setTimeout(() => {
        expect(component.isHeaderHidden).toBeTruthy();
      }, component['timeOutTimeToHide']);
    });
  });
});
