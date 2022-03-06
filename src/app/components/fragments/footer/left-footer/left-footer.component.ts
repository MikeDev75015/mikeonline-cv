import {Component, Input} from '@angular/core';
import { ICvInfos, IExperience, IFormation, IInterest, IProject, ITag } from '../../../../core';
import { PdfCreatorService } from '../../../../core/services/pdf-creator/pdf-creator.service';
import { DataService } from '../../../../shared/services/data/data.service';
import { UtilsService } from '../../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-left-footer',
  templateUrl: './left-footer.component.html',
  styleUrls: ['./left-footer.component.scss']
})
export class LeftFooterComponent {
  @Input() mobile = false;
  downloading = false;

  constructor(
    private readonly dataService: DataService,
    private readonly pdfMakeService: PdfCreatorService,
    private readonly utilsService: UtilsService,
  ) {}

  async downloadCV(): Promise<void> {
    this.downloading = true;
    const cvInfos = await this.dataService.getCvInfos<ICvInfos>();
    const experiences = await this.dataService.getExperiences<IExperience[]>();
    const formations = await this.dataService.getFormations<IFormation[]>();
    const projects = await this.dataService.getProjects<IProject[]>();
    const interests = await this.dataService.getInterests<IInterest[]>();
    const summary = await this.dataService.getSummary();

    console.log('downloading Cv:', { cvInfos, experiences, formations, projects, interests, summary });

    const loadedImage = await this.utilsService.convertImageToBase64(cvInfos.logo!.src);

    await this.pdfMakeService.createDownloadablePdf({
      ...cvInfos,
      logo: {...cvInfos.logo, src: loadedImage},
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
      }
    }).then(() => this.downloading = false);
  }

}
