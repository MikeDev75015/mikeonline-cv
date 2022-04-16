import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExperience } from '../../../../../core/interfaces/models/experience.interface';
import { IFormation } from '../../../../../core/interfaces/models/formation.interface';
import { IProject } from '../../../../../core/interfaces/models/project.interface';
import { ISkill } from '../../../../../core/interfaces/models/skill.interface';
import { selectAllCompetences } from '../../../../../core/ngrx/selectors/competences.selectors';
import { selectAllExperiences } from '../../../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../../../core/ngrx/selectors/formations.selectors';
import { selectAllProjects } from '../../../../../core/ngrx/selectors/projects.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { UtilsService } from '../../../../../shared/shared-index';
import { RadarConfig } from './models/radar-config.interface';
import { DataSets, RadarData } from './models/radar-data.interface';
import { RadarConfigService } from './services/radar-config/radar-config.service';

@Component({
  selector: 'app-skills-radar-chart',
  templateUrl: './skills-radar-chart.component.html',
})
export class SkillsRadarChartComponent implements OnInit, OnDestroy {
  public radarData: RadarData | undefined;

  public chartOptions: any;

  public radarConfig: RadarConfig | undefined;

  public radarWidth = '500px';

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private configService: RadarConfigService,
    private dataService: DataService,
  ) {
  }

  private static getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        r: {
          pointLabels: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
          angleLines: {
            color: '#ebedef',
          },
        },
      },
    };
  }

  private static getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
      scales: {
        r: {
          pointLabels: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
          angleLines: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
      },
    };
  }

  private static getDataColor(index: number): any {
    const dataColorList = [
      {
        backgroundColor: 'rgba(2, 72, 115, 0.1)',
        borderColor: 'rgba(2, 72, 115, 0.5)',
        pointBackgroundColor: '#024873',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#000',
      },
      {
        backgroundColor: 'rgba(85,85,85,0.1)',
        borderColor: 'rgba(85,85,85,0.5)',
        pointBackgroundColor: '#555555',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#000',
      },
      {
        backgroundColor: 'rgba(187,41,41,0.1)',
        borderColor: 'rgba(187,41,41,0.5)',
        pointBackgroundColor: '#bb2929',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#000',
      },
      {
        backgroundColor: 'rgba(75,159,15,0.1)',
        borderColor: 'rgba(75,159,15,0.5)',
        pointBackgroundColor: '#4b9f0f',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#000',
      },
      {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderColor: 'rgba(0,0,0,0.5)',
        pointBackgroundColor: '#000000',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#000',
      },
    ];
    return dataColorList[index];
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.configService.configUpdate$.subscribe((config) => {
        this.radarConfig = config;
        this.updateChartOptions();
      }),
    );

    this.subscriptionList.push(
      this.dataService.isAllDataLoaded().subscribe(async (isAllDataLoaded) => {
        if (!isAllDataLoaded) {
          return;
        }

        await this.initializeRadarData();
      }),
    );

    this.radarWidth = `${window.innerWidth - 20}px`;

    this.radarConfig = this.configService.config;
    this.updateChartOptions();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  /**
   *
   */
  public getWidth(): string {
    return `${window.innerWidth - 60}px`;
  }

  private async initializeRadarData(): Promise<void> {
    const [skills, experiences, formations, projects] = await Promise.all([
      this.dataService.getStoreData<ISkill[]>({ selector: selectAllCompetences, defaultValue: [] }),
      this.dataService.getStoreData<IExperience[]>({ selector: selectAllExperiences, defaultValue: [] }),
      this.dataService.getStoreData<IFormation[]>({ selector: selectAllFormations, defaultValue: [] }),
      this.dataService.getStoreData<IProject[]>({ selector: selectAllProjects, defaultValue: [] }),
    ]);

    let dataList = skills
      .filter((skill) => ['Angular', 'Nest.js', 'Node.js', 'MongoDb'].includes(skill.name))
      .map((skill) => {
        const totalExperiences = experiences.filter((experience) => experience.tagIdList.includes(skill.tagIdList[0])).length;
        const totalFormations = formations.filter((formation) => formation.tagIdList.includes(skill.tagIdList[0])).length;
        const totalProjects = projects.filter((project) => project.tagIdList.includes(skill.tagIdList[0])).length;

        return {
          name: skill.name,
          weight: skill.expertiseLevel + skill.priority + totalExperiences + totalFormations + totalProjects,
          totalExperiences,
          totalFormations,
          totalProjects,
        };
      });

    dataList = UtilsService.sortObjectList([...dataList], 'desc', 'weight', 'number');

    this.radarData = {
      labels: ['Projets', 'Formations', 'Expériences'],
      datasets: dataList.map((data, i) => ({
        label: data.name,
        data: [data.totalProjects, data.totalFormations, data.totalExperiences],
        ...SkillsRadarChartComponent.getDataColor(i),
      }) as DataSets),
    };
  }

  private updateChartOptions() {
    this.chartOptions = this.radarConfig && this.radarConfig.dark ? SkillsRadarChartComponent.getDarkTheme() : SkillsRadarChartComponent.getLightTheme();
  }
}
