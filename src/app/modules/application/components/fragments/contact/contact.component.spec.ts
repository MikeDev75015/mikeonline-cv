import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { storeMock } from '../../../../../../../__mocks__/services/store.mock';
import { AlertModule } from '../../../../../core';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlertModule,
      ],
      declarations: [
        ContactComponent,
        MockComponent({
          selector: 'app-btn-mobile-contact',
          inputs: [
            'btnClass',
            'btnIcon',
            'btnImage',
            'btnText',
          ]
        }),
      ],
      providers: [
        { provide: Store, useValue: storeMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
