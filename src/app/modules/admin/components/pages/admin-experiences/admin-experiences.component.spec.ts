import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExperiencesComponent } from './admin-experiences.component';

describe('AdminEsperiencesComponent', () => {
  let component: AdminExperiencesComponent;
  let fixture: ComponentFixture<AdminExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminExperiencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
