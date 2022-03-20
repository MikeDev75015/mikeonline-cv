import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { LoadingDirective } from '../../../core/directives/loading.directive';
import { DataService } from '../../../shared/services/data/data.service';

import { ExperiencesComponent } from './experiences.component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExperiencesComponent,
        MockComponent({
          selector: 'app-experience-item',
          inputs: ['exp', 'index'],
        }),
        MockComponent({
          selector: 'app-loading',
        }),
        LoadingDirective,
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
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
