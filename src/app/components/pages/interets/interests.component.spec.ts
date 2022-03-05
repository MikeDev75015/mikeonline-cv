import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InterestsComponent} from './interests.component';
import {MockComponent} from 'ng2-mock-component';
import {MockDataService} from '../../services/mock-data.service';
import {MatExpansionModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('InteretsComponent', () => {
  let component: InterestsComponent;
  let fixture: ComponentFixture<InterestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InterestsComponent,
        MockComponent({
          selector: 'app-vertical-accordion',
          inputs: [
            'verticalAccordionContainerClass',
            'verticalAccordionItemClass',
            'itemList',
            'options'
          ]
        })
      ],
      providers: [
        MockDataService
      ],
      imports: [
        BrowserAnimationsModule,
        MatExpansionModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(MockDataService);
    fixture = TestBed.createComponent(InterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
