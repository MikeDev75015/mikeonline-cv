import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { InputTextareaComponent } from './input-textarea.component';

describe('InputTextareaComponent', () => {
  let component: InputTextareaComponent;
  let fixture: ComponentFixture<InputTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputTextareaComponent],
      imports: [
        FormsModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
