import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExperiencesComponent} from './experiences.component';
import {MockDataService} from '../../services/mock-data.service';
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
        MockDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(MockDataService);
    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
