import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { utilsServiceMock } from '../../../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../../../../../shared/shared-index';

import {ProjectItemComponent} from './project-item.component';

describe('ProjectItemComponent', () => {
  let component: ProjectItemComponent;
  let fixture: ComponentFixture<ProjectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectItemComponent ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
