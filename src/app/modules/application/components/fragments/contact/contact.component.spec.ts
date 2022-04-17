import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng2-mock-component';
import { storeMock } from '../../../../../../../__mocks__/services/store.mock';
import { AlertModule } from '../../../../../core';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
