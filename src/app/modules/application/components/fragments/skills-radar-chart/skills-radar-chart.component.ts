import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExperienceV1 } from '../../../../../core/interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../../../core/interfaces/models/v1/formation.interface';
import { ProjectV1 } from '../../../../../core/interfaces/models/v1/project.interface';
import { SkillV1 } from '../../../../../core/interfaces/models/v1/skill.interface';
import { selectAllExperiences } from '../../../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../../../core/ngrx/selectors/formations.selectors';
import { selectAllProjects } from '../../../../../core/ngrx/selectors/projects.selectors';
import { selectAllSkills } from '../../../../../core/ngrx/selectors/skills.selectors';
import { DataService, UtilsService } from '../../../../../shared';
import { dataColorList } from './constants/data-color-list.constant';
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
    private readonly configService: RadarConfigService,
    private readonly dataService: DataService,
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
    return dataColorList[index];
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.configService.onConfigChanges().subscribe((config) => {
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

    this.radarConfig = this.configService.getConfig();
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
      this.dataService.getStoreData<SkillV1[]>({ selector: selectAllSkills, defaultValue: [] }),
      this.dataService.getStoreData<ExperienceV1[]>({ selector: selectAllExperiences, defaultValue: [] }),
      this.dataService.getStoreData<FormationV1[]>({ selector: selectAllFormations, defaultValue: [] }),
      this.dataService.getStoreData<ProjectV1[]>({ selector: selectAllProjects, defaultValue: [] }),
    ]);

    let dataList = skills
      .filter((skill) => ['Angular', 'Nest.js', 'MongoDb'].includes(skill.name))
      .map((skill) => {
        let experiencesFound: ExperienceV1[] = [], formationsFound: FormationV1[] = [], projectsFound: ProjectV1[] = [];
        skill.tagList.forEach((tag) => {
            experiencesFound = experiencesFound.concat(experiences.filter((experience) => experience.tagList.find((t) => t.id === tag.id)));
            formationsFound = formationsFound.concat(formations.filter((formation) => formation.tagList.find((t) => t.id === tag.id)));
            projectsFound = projectsFound.concat(projects.filter((project) => project.tagList.find((t) => t.id === tag.id)));
          },
          [[] as ExperienceV1[], [] as FormationV1[], [] as ProjectV1[]],
        );
        const totalExperiences = experiencesFound.length;
        const totalFormations = formationsFound.length;
        const totalProjects = projectsFound.length;

        return {
          name: skill.name,
          weight: skill.expertiseLevel + skill.priority + totalExperiences + totalFormations + totalProjects,
          totalExperiences,
          totalFormations,
          totalProjects,
        };
      });

    dataList = UtilsService.sortObjectList([...dataList], 'asc', 'name');

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
