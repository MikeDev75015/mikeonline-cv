import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DataService } from '../../../shared/services/data/data.service';

import {FormationsComponent} from './formations.component';
import {MockComponent} from 'ng2-mock-component';

describe('FormationsComponent', () => {
  let component: FormationsComponent;
  let fixture: ComponentFixture<FormationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormationsComponent,
        MockComponent({
          selector: 'app-formation-item',
          inputs: ['form', 'index']
        })
      ],
      providers: [
        { provide: DataService, useValue: {} },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
