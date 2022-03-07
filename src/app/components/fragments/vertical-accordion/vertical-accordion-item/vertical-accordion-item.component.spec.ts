import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {VerticalAccordionItemComponent} from './vertical-accordion-item.component';
import {OneLetterByLinePipe} from '../pipes/one-letter-by-line.pipe';

describe('VerticalAccordionItemComponent', () => {
  let component: VerticalAccordionItemComponent;
  let fixture: ComponentFixture<VerticalAccordionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
      ],
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
