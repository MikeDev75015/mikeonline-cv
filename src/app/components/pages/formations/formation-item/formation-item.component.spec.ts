import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'angular2-moment';
import { MockComponent } from 'ng2-mock-component';
import { animationServiceMock } from '../../../../__mocks__/services/animation-service.mock';
import { utilsServiceMock } from '../../../../__mocks__/services/utils-service.mock';
import { AlertModule } from '../../../../core/core-index';
import { AnimationsService } from '../../../../core/services/animations/animations.service';
import { FirstLetterUppercasePipe, IncompressibleSpacePipe, UtilsService } from '../../../../shared/shared-index';

import { FormationItemComponent } from './formation-item.component';

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
          inputs: ['detail'],
        }),
      ],
      imports: [
        MomentModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        AlertModule,
      ],
      providers: [
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();
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
