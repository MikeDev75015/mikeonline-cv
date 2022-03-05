import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormationsComponent} from './formations.component';
import {MockDataService} from '../../services/mock-data.service';
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
        MockDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(MockDataService);
    fixture = TestBed.createComponent(FormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
