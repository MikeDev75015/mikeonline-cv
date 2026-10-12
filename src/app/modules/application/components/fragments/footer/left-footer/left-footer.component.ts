import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CvInfosV1 } from '../../../../../../core/interfaces/models/v1/cv-infos.interface';
import { ExperienceV1 } from '../../../../../../core/interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../../../../core/interfaces/models/v1/formation.interface';
import { InterestV1 } from '../../../../../../core/interfaces/models/v1/interest.interface';
import { ProjectV1 } from '../../../../../../core/interfaces/models/v1/project.interface';
import { selectCvInfos } from '../../../../../../core/ngrx/selectors/cv-infos.selectors';
import { selectAllExperiences } from '../../../../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../../../../core/ngrx/selectors/formations.selectors';
import { selectAllInterests } from '../../../../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects } from '../../../../../../core/ngrx/selectors/projects.selectors';
import { PdfCreatorService } from '../../../../../../core/services/pdf-creator/pdf-creator.service';
import { DataService, UtilsService } from '../../../../../../shared';
import { TemplatesService } from '../../../../../../shared/services/templates/templates.service';
import { ProjectItem } from '../../../../interfaces/project-item.interface';

@Component({
    selector: 'app-left-footer',
    templateUrl: './left-footer.component.html',
    styleUrls: ['./left-footer.component.scss'],
    standalone: false
})
export class LeftFooterComponent implements OnInit, OnDestroy {
  @Input() mobile = false;

  public isLoadingData: boolean | undefined;

  public downloading = false;

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
    private readonly pdfMakeService: PdfCreatorService,
    private readonly utilsService: UtilsService,
  ) {
  }

  public async downloadCV(): Promise<void> {
    this.downloading = true;
    const cvInfos = await this.dataService.getStoreData({
      selector: selectCvInfos,
      defaultValue: undefined,
    }) as CvInfosV1;

    let
      experiences: ExperienceV1[] = [],
      formations: FormationV1[] = [],
      projects: ProjectItem[] = [],
      interests: InterestV1[] = [];

    const allList = await Promise.all([
      { list: experiences, selector: selectAllExperiences },
      { list: formations, selector: selectAllFormations },
      { list: projects, selector: selectAllProjects },
      { list: interests, selector: selectAllInterests },
    ].map((v) => {
      return this.dataService.getStoreData<typeof v.list>({
        // @ts-ignore
        selector: v.selector, defaultValue: [],
      });
    }));

    experiences = TemplatesService.reorderItemListByEndDate<ExperienceV1>(allList[0] as ExperienceV1[]);
    formations = TemplatesService.reorderItemListByEndDate<FormationV1>(allList[1] as FormationV1[]);
    projects = UtilsService.sortObjectList<ProjectItem>((allList[2] as ProjectV1[]).map((project) => ({
      ...project,
      technoList: this.utilsService.initTechnoListWithTagList(project.tagList, true),
    }) as ProjectItem), 'asc', 'position', 'number');
    interests = UtilsService.sortObjectList<InterestV1>(allList[3] as InterestV1[], 'asc', 'position', 'number');

    const summary = await this.dataService.getSummary();

    const base64ImageUrl = cvInfos.logo ? await this.utilsService.convertImageToBase64(cvInfos.logo.src) : '';

    await this.pdfMakeService.createDownloadablePdf({
      ...cvInfos,
      logo: base64ImageUrl ? { ...cvInfos.logo, src: base64ImageUrl } : undefined,
      cvType: 'full-cv',
      data: {
        experienceList: experiences,
        formationList: formations,
        projectList: projects,
        interestList: interests,
        competenceList: summary,
      },
    }).then(() => this.downloading = false);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.isLoadingData = true;

    this.subscriptionList.push(
      this.dataService.isAllDataLoaded().subscribe((isLoaded) => {
        if (!isLoaded) {
          return;
        }

        this.isLoadingData = false;
      }),
    );
  }
}
