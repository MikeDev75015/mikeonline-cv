import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalAccordionItemComponent} from './vertical-accordion-item.component';
import {OneLetterByLinePipe} from '../pipes/one-letter-by-line.pipe';

describe('VerticalAccordionItemComponent', () => {
  let component: VerticalAccordionItemComponent;
  let fixture: ComponentFixture<VerticalAccordionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VerticalAccordionItemComponent,
        OneLetterByLinePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalAccordionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
