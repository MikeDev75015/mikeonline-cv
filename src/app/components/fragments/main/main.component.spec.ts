import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../shared/shared-index';

import {MainComponent} from './main.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MockComponent} from 'ng2-mock-component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
          selector: 'app-header'
        }),
        MockComponent({
          selector: 'app-skills'
        }),
        MockComponent({
          selector: 'app-experiences'
        }),
        MockComponent({
          selector: 'app-formations'
        }),
        MockComponent({
          selector: 'app-portfolio'
        }),
        MockComponent({
          selector: 'app-interests'
        })
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
