import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICvInfos, IExperience, IFormation, IInterest, IProject, ITag } from '../../../../core/core-index';
import { selectCvInfos } from '../../../../core/ngrx/selectors/cv-infos.selectors';
import { selectAllExperiences } from '../../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../../core/ngrx/selectors/formations.selectors';
import { selectAllInterests } from '../../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects } from '../../../../core/ngrx/selectors/projects.selectors';
import { PdfCreatorService } from '../../../../core/services/pdf-creator/pdf-creator.service';
import { DataService, UtilsService } from '../../../../shared/shared-index';

@Component({
  selector: 'app-left-footer',
  templateUrl: './left-footer.component.html',
  styleUrls: ['./left-footer.component.scss'],
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
    }) as ICvInfos;

    let
      experiences: IExperience[] = [],
      formations: IFormation[] = [],
      projects: IProject[] = [],
      interests: IInterest[] = [];

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

    experiences = allList[0] as IExperience[];
    formations = allList[1] as IFormation[];
    projects = UtilsService.sortObjectList<IProject>(allList[2] as IProject[], 'asc', 'position', 'number');
    interests = allList[3] as IInterest[];

    const summary = await this.dataService.getSummary();

    const loadedImage = cvInfos.logo ? await this.utilsService.convertImageToBase64(cvInfos.logo.src) : '';

    await this.pdfMakeService.createDownloadablePdf({
      ...cvInfos,
      logo: loadedImage ? { ...cvInfos.logo, src: loadedImage } : undefined,
      cvType: 'full-cv',
      data: {
        experienceList: experiences,
        formationList: formations,
        projectList: projects.map(
          proj => ({
            ...proj,
            technoList: this.utilsService.initTechnoListWithTagList(proj.tagList as ITag[], true),
          }),
        ),
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
      })
    );
  }
}
