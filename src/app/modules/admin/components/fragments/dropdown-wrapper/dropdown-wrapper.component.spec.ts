import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CV_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';

import { DropdownWrapperComponent } from './dropdown-wrapper.component';

describe('DropdownWrapperComponent', () => {
  let component: DropdownWrapperComponent;
  let fixture: ComponentFixture<DropdownWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownWrapperComponent],
      imports: [
        DropdownModule,
        FormsModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownWrapperComponent);
    component = fixture.componentInstance;
    component.list = CV_TYPE_DROPDOWN_LIST;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
