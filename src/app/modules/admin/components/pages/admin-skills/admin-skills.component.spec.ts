import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';

import { AdminSkillsComponent } from './admin-skills.component';

describe('AdminSkillsComponent', () => {
  let component: AdminSkillsComponent;
  let fixture: ComponentFixture<AdminSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSkillsComponent,
        MockComponent({
          selector: 'app-table-wrapper',
          inputs: ['columnList', 'crudEndPoint', 'exportCsvFileName', 'formFields', 'dataGenerator', 'rowsReorderable'],
        })],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
