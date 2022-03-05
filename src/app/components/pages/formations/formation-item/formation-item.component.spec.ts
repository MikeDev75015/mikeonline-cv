import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormationItemComponent} from './formation-item.component';
import {MockComponent} from 'ng2-mock-component';
import {MomentModule} from 'angular2-moment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule, IncompressibleSpacePipe} from '../../../core';
import {FirstLetterUppercasePipe} from '../../../core/pipes/first-letter-uppercase.pipe';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FormationItemComponent', () => {
  let component: FormationItemComponent;
  let fixture: ComponentFixture<FormationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormationItemComponent,
        IncompressibleSpacePipe,
        FirstLetterUppercasePipe,
        MockComponent({
          selector: 'app-formation-item-detail',
          inputs: ['detail']
        })
      ],
      imports: [
        MomentModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        AlertModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
