import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { tableWrapperComponentMock } from '../../../../../../../__mocks__/components/table-wrapper-component.mock';

import { AdminFormationsComponent } from './admin-formations.component';

describe('AdminFormationsComponent', () => {
  let component: AdminFormationsComponent;
  let fixture: ComponentFixture<AdminFormationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminFormationsComponent,
        MockComponent(tableWrapperComponentMock),
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
