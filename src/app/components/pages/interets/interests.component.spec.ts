import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { DataService } from '../../../shared/shared-index';

import {InterestsComponent} from './interests.component';
import {MockComponent} from 'ng2-mock-component';
import {MatExpansionModule} from '@angular/material/expansion';
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
        { provide: DataService, useValue: {} },
      ],
      imports: [
        BrowserAnimationsModule,
        MatExpansionModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
