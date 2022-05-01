import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { tableWrapperComponentMock } from '../../../../../../../__mocks__/components/table-wrapper-component.mock';

import { AdminInterestsComponent } from './admin-interests.component';

describe('AdminInterestsComponent', () => {
  let component: AdminInterestsComponent;
  let fixture: ComponentFixture<AdminInterestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminInterestsComponent,
        MockComponent(tableWrapperComponentMock),
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
