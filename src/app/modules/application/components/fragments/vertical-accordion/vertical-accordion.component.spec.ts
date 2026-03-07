import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { AlertModule } from '../../../../../core';
import { DataService } from '../../../../../shared';

import {VerticalAccordionComponent} from './vertical-accordion.component';
import {MockComponent} from '../../../../../../test/ng2-mock-component-compat';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('VerticalAccordionComponent', () => {
  let component: VerticalAccordionComponent;
  let fixture: ComponentFixture<VerticalAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlertModule,
      ],
      declarations: [
        VerticalAccordionComponent,
        MockComponent({
          selector: 'app-vertical-accordion-item',
          inputs: [
            'itemData',
            'itemClass',
            'expanded',
          ]
        }),
        MockComponent({
          selector: 'app-vertical-accordion-last-item',
          inputs: [
            'itemData',
            'itemClass',
            'expanded',
          ]
        })
      ],
      providers: [
        { provide: DataService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
