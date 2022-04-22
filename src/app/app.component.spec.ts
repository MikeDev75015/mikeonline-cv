import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { pwaServiceMock } from '../../__mocks__/services/pwa-service.mock';
import { AppComponent } from './app.component';
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
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should dispatch ApplicationActions startAppLoading action', () => {
      expect(pwaServiceMock.initializeServiceWorker).toHaveBeenCalledTimes(1);
    });
  });
});
