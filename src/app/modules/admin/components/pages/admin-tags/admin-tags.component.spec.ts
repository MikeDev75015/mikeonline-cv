import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { tableWrapperComponentMock } from '../../../../../../../__mocks__/components/table-wrapper-component.mock';

import { AdminTagsComponent } from './admin-tags.component';

describe('AdminTagsComponent', () => {
  let component: AdminTagsComponent;
  let fixture: ComponentFixture<AdminTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminTagsComponent,
        MockComponent(tableWrapperComponentMock),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
