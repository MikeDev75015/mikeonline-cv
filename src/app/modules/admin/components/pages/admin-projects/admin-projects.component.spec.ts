import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { tableWrapperComponentMock } from '../../../../../../../__mocks__/components/table-wrapper-component.mock';

import { AdminProjectsComponent } from './admin-projects.component';

describe('AdminProjectsComponent', () => {
  let component: AdminProjectsComponent;
  let fixture: ComponentFixture<AdminProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminProjectsComponent,
        MockComponent(tableWrapperComponentMock),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
