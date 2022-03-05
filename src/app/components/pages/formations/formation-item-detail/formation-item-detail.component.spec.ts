import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormationItemDetailComponent} from './formation-item-detail.component';
import {MomentModule} from 'angular2-moment';

describe('FormationItemDetailComponent', () => {
  let component: FormationItemDetailComponent;
  let fixture: ComponentFixture<FormationItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormationItemDetailComponent ],
      imports: [MomentModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
