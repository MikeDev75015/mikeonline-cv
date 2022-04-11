import { ComponentFixture, TestBed } from '@angular/core/testing';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../shared/shared-index';

import { SkillsRadarChartComponent } from './skills-radar-chart.component';

describe('SkillsRadarChartComponent', () => {
  let component: SkillsRadarChartComponent;
  let fixture: ComponentFixture<SkillsRadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillsRadarChartComponent ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
