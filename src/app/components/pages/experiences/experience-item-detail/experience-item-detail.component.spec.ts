import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExperienceItemDetailComponent} from './experience-item-detail.component';

describe('ExperienceItemDetailComponent', () => {
  let component: ExperienceItemDetailComponent;
  let fixture: ComponentFixture<ExperienceItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
