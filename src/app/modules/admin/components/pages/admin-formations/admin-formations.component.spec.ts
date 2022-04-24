import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';

import { AdminFormationsComponent } from './admin-formations.component';

describe('AdminFormationsComponent', () => {
  let component: AdminFormationsComponent;
  let fixture: ComponentFixture<AdminFormationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminFormationsComponent,
        MockComponent({
          selector: 'app-table-wrapper',
          inputs: ['columnList', 'crudEndPoint', 'exportCsvFileName', 'formFields', 'dataGeneratorList'],
        }),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
