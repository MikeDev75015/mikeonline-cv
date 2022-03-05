import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalAccordionComponent} from './vertical-accordion.component';
import {MockComponent} from 'ng2-mock-component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AlertModule} from '../../core';

describe('VerticalAccordionComponent', () => {
  let component: VerticalAccordionComponent;
  let fixture: ComponentFixture<VerticalAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlertModule
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
