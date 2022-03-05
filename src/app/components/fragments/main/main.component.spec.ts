import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainComponent} from './main.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MockComponent} from 'ng2-mock-component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {AddComponentsService} from '../../services/add-components.service';
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
        BrowserAnimationsModule
      ],
      declarations: [
        MainComponent,
        MockComponent({
          selector: 'app-header'
        }),
        MockComponent({
          selector: 'app-competences'
        }),
        MockComponent({
          selector: 'app-experiences'}),
        MockComponent({selector: 'app-formations'
        }),
        MockComponent({
          selector: 'app-portfolio'
        }),
        MockComponent({
          selector: 'app-interets'
        })
      ],
      providers: [
        AddComponentsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(AddComponentsService);
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
