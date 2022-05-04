import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng2-mock-component';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../../../shared';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['pageTitle', 'isLoadingData$', 'scrollSection'],
        }),
        MockComponent({
          selector: 'app-skills-radar-chart',
        }),
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
