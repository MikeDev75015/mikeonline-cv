import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { pwaServiceMock } from './__mocks__/services/pwa-service.mock';
import { storeMock } from './__mocks__/services/store.mock';
import { AppComponent } from './app.component';
import * as ApplicationActions from './core/ngrx/actions/application.actions';
import { PwaService } from './core/services/pwa/pwa.service';

describe('AppComponent', () => {
  let
    component: AppComponent,
    fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      providers: [
        { provide: PwaService, useValue: pwaServiceMock },
        { provide: Store, useValue: storeMock },
      ],
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let dispatchSpy: any;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(storeMock, 'dispatch');
      fixture.detectChanges();
    });

    it('should dispatch ApplicationActions startAppLoading action', () => {
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(ApplicationActions.startAppLoading());
      expect(pwaServiceMock.initializeServiceWorker).toHaveBeenCalledTimes(1);
    });
  });
});
