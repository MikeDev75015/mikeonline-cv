import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { tableWrapperComponentMock } from '../../../../../../../__mocks__/components/table-wrapper-component.mock';

import { AdminExperiencesComponent } from './admin-experiences.component';

describe('AdminEsperiencesComponent', () => {
  let component: AdminExperiencesComponent;
  let fixture: ComponentFixture<AdminExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminExperiencesComponent,
        MockComponent(tableWrapperComponentMock),
      ],
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
