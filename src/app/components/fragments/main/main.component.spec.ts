import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng2-mock-component';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../shared/shared-index';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        MatIconModule,
        MatMenuModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        MainComponent,
        MockComponent({
          selector: 'app-header',
        }),
        MockComponent({
          selector: 'app-home',
        }),
        MockComponent({
          selector: 'app-skills',
        }),
        MockComponent({
          selector: 'app-experiences',
        }),
        MockComponent({
          selector: 'app-formations',
        }),
        MockComponent({
          selector: 'app-portfolio',
        }),
        MockComponent({
          selector: 'app-interests',
        }),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
