import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactComponent} from './contact.component';
import {AlertModule} from '../../core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockComponent} from 'ng2-mock-component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlertModule
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
