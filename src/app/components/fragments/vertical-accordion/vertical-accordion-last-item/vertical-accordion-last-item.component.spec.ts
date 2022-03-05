import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalAccordionLastItemComponent} from './vertical-accordion-last-item.component';
import {OneLetterByLinePipe} from '../pipes/one-letter-by-line.pipe';

describe('VerticalAccordionLastItemComponent', () => {
  let component: VerticalAccordionLastItemComponent;
  let fixture: ComponentFixture<VerticalAccordionLastItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VerticalAccordionLastItemComponent,
        OneLetterByLinePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalAccordionLastItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
