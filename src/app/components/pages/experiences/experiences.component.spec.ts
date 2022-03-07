import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DataService } from '../../../shared/services/data/data.service';

import {ExperiencesComponent} from './experiences.component';
import {MockComponent} from 'ng2-mock-component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExperiencesComponent,
        MockComponent({
          selector: 'app-experience-item',
          inputs: ['exp', 'index']
        })
      ],
      providers: [
        { provide: DataService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
