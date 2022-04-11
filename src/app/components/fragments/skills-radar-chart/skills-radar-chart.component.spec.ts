import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsRadarChartComponent } from './skills-radar-chart.component';

describe('SkillsRadarChartComponent', () => {
  let component: SkillsRadarChartComponent;
  let fixture: ComponentFixture<SkillsRadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillsRadarChartComponent ]
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
