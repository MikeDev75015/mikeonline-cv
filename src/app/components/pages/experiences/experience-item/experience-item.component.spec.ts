import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { animationServiceMock } from '../../../../__mocks__/services/animation-service.mock';
import { utilsServiceMock } from '../../../../__mocks__/services/utils-service.mock';
import { AlertModule } from '../../../../core/core-index';
import { AnimationsService } from '../../../../core/services/animations/animations.service';
import { IncompressibleSpacePipe, UtilsService } from '../../../../shared/shared-index';

import { ExperienceItemComponent } from './experience-item.component';

describe('ExperienceItemComponent', () => {
  let component: ExperienceItemComponent;
  let fixture: ComponentFixture<ExperienceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExperienceItemComponent,
        IncompressibleSpacePipe,
        MockComponent({
          selector: 'app-experience-item-detail',
          inputs: ['detail'],
        }),
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        AlertModule,
      ],
      providers: [
        { provide: AnimationsService, useValue: animationServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
