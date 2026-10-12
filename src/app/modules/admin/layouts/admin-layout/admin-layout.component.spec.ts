import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from '../../../../../test/ng2-mock-component-compat';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { storeMock } from '../../../../../../__mocks__/services/store.mock';
import { themingServiceMock } from '../../../../../../__mocks__/services/theming-service.mock';
import { ThemingService } from '../../../../core/services/theming/theming.service';

import { AdminLayoutComponent } from './admin-layout.component';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        ToastModule,
      ],
      declarations: [
        AdminLayoutComponent,
        MockComponent({
          selector: 'app-loading',
          template: '<div></div>',
        }),
      ],
      providers: [
        { provide: Store, useValue: storeMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      // ThemingService is provided at component level and reads the `#theme` <link> from the real DOM.
      .overrideComponent(AdminLayoutComponent, {
        set: { providers: [{ provide: ThemingService, useValue: themingServiceMock }, MessageService] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.themeList).toStrictEqual(themingServiceMock.getThemeList());
    expect(component.selectedTheme).toStrictEqual('saga-blue');
  });
});
