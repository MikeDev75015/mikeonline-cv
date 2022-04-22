import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickListModule } from 'primeng/picklist';

import { PickListWrapperComponent } from './pick-list-wrapper.component';

describe('PickListWrapperComponent', () => {
  let component: PickListWrapperComponent;
  let fixture: ComponentFixture<PickListWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickListWrapperComponent],
      imports: [
        PickListModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickListWrapperComponent);
    component = fixture.componentInstance;
    component.sourceList = ['1'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
