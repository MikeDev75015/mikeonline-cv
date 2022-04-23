import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng2-mock-component';
import { ToastModule } from 'primeng/toast';
import { storeMock } from '../../../../../../../__mocks__/services/store.mock';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SignInComponent,
        MockComponent({
          selector: 'app-input-wrapper',
          inputs: [
            'value', 'disabled', 'name', 'placeholder', 'checkboxOptions', 'inlineClass', 'inputType', 'numberOptions',
            'textareaOptions',
          ],
        }),
        MockComponent({
          selector: 'app-form-wrapper',
          inputs: ['formFields', 'formValues'],
        }),
      ],
      imports: [
        HttpClientTestingModule,
        ToastModule,
        MatIconModule,
      ],
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
