import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';

import { AdminInterestsComponent } from './admin-interests.component';

describe('AdminInterestsComponent', () => {
  let component: AdminInterestsComponent;
  let fixture: ComponentFixture<AdminInterestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminInterestsComponent,
        MockComponent({
          selector: 'app-table-wrapper',
          inputs: ['columnList', 'crudEndPoint', 'exportCsvFileName', 'formFields', 'dataGenerator', 'rowsReorderable'],
        }),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
