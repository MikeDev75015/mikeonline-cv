import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { storeMock } from '../../../__mocks__/services/store.mock';
import { AlertModule } from '../../../core/core-index';

import {ContactComponent} from './contact.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockComponent} from 'ng2-mock-component';

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
