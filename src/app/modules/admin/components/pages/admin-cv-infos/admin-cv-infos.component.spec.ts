import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCvInfosComponent } from './admin-cv-infos.component';

describe('AdminCvInfosComponent', () => {
  let component: AdminCvInfosComponent;
  let fixture: ComponentFixture<AdminCvInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCvInfosComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCvInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
