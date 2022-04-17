import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { utilsServiceMock } from '../../../../../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../../../../../shared';

import { FormationItemDetailComponent } from './formation-item-detail.component';

describe('FormationItemDetailComponent', () => {
  let component: FormationItemDetailComponent;
  let fixture: ComponentFixture<FormationItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormationItemDetailComponent ],
      imports: [],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
