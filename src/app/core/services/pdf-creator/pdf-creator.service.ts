import { Injectable } from '@angular/core';

import { ProjectItem } from '../../../modules/application/interfaces/project-item.interface';
import { UtilsService } from '../../../shared';
import { PDF_CV_CREDITS, PDF_DEFAULT_FOOTER, PDF_DEFAULT_HEADER } from '../../constants/pdf.constant';
import { ExperienceV1 } from '../../interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../interfaces/models/v1/formation.interface';
import { InterestV1 } from '../../interfaces/models/v1/interest.interface';
import { DayJsService } from '../dayjs/dayjs.service';
import {
  ContentImage,
  ContentTable,
  ContentText,
  PdfDocumentDefinition,
} from './interfaces/pdf-document-definition.interface';
import { PdfInfosData } from './interfaces/pdf-infos-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PdfCreatorService {
  private pdfDocument: PdfDocumentDefinition = PdfCreatorService.initPdf();
  private pdfMake: any;

  constructor(
    private readonly utilsService: UtilsService,
  ) {
    const pdfMakeModule = require('pdfmake/build/pdfmake');
    const pdfFontsModule = require('pdfmake/build/vfs_fonts');

    this.pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;

    if (this.pdfMake && pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
      this.pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }
  }

  private readonly updatePdfContent = {
    addText: (pdfText: ContentText): void => {
      this.pdfDocument.content.push(pdfText);
    },
    addImage: (pdfImage: ContentImage): void => {
      this.pdfDocument.content.push(pdfImage);
    },
    addTable: (pdfTable: ContentTable): void => {
      this.pdfDocument.content.push(pdfTable);
    },
    setHeader: (header: any = PDF_DEFAULT_HEADER): void => {
      this.pdfDocument.header = header;
    },
    setFooter: (footer: any = PDF_DEFAULT_FOOTER): void => {
      this.pdfDocument.footer = footer;
    },
    addSectionTitle: (
      title: string, style = 'defaultStyle', background = '#CCCCCC', pageBreak?: string,
    ): void => {
      this.pdfDocument.content.push({
        layout: 'noBorders',
        margin: [0, 20, 0, 0],
        table: {
          widths: ['*'],
          body: [
            [{ text: title, style, fillColor: background, pageBreak: pageBreak || '' }],
          ],
        },
      });
    },
    addItemHeader: (
      item: ExperienceV1 | FormationV1, date: string,
    ): void => {
      this.pdfDocument.content.push({
        layout: 'noBorders',
        margin: [0, 10, 0, 0],
        table: {
          dontBreakRows: true,
          widths: ['*', 'auto'],
          body: [
            [
              { text: item.title, style: 'bold' },
              { text: date, style: 'right', bold: true, color: '#555555' },
            ],
            [{ text: `${item.society} - ${item.place}`, italics: true, color: '#555555' }, { text: '' }],
          ],
        },
      });
    },
    addItemContent: (contentBody: any[]): void => {
      this.pdfDocument.content.push({
        layout: 'noBorders',
        margin: [0, 5, 0, 0],
        table: {
          dontBreakRows: true,
          widths: ['*'],
          body: contentBody,
        },
      });
    },
  };

  private static getDefaultStyle(): PdfDocumentDefinition['defaultStyle'] {
    return {
      font: 'Roboto',
      fontSize: 12,
      lineHeight: 1,
      color: '#024873',
      alignment: 'left',
    };
  }

  private static getStyles(): PdfDocumentDefinition['styles'] {
    return {
      right: {
        alignment: 'right',
      },
      center: {
        alignment: 'center',
      },
      bold: {
        bold: true,
      },
      header: {
        fontSize: 8,
        color: '#555555',
        alignment: 'center',
      },
      footer: {
        fontSize: 8,
        alignment: 'center',
      },
      contact: {
        fontSize: 12,
        bold: true,
        color: '#024873',
      },
      link: {
        fontSize: 10,
        color: '#555555',
      },
      title: {
        fontSize: 24,
        bold: true,
        alignment: 'right',
      },
      subtitle: {
        fontSize: 18,
        bold: true,
        alignment: 'right',
      },
      sectionTitle: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        color: '#FFFFFF',
      },
      lineDetail: {
        fontSize: 11,
        lineHeight: 0.9,
      },
      chip: {
        fontSize: 11,
        color: '#555555',
      },
    };
  }

  private static initPdf(): PdfDocumentDefinition {
    return {
      info: PDF_CV_CREDITS,
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 20, 20, 20],
      defaultStyle: PdfCreatorService.getDefaultStyle(),
      styles: PdfCreatorService.getStyles(),
      content: [],
    };
  }

  private static getDateToPrint(beginDate: string, endDate?: string): string {
    if (!beginDate && endDate) {
      return UtilsService.uppercaseFirstLetter(DayJsService.getDate(endDate, 'MMMM YYYY'));
    }

    if (!endDate && beginDate) {
      return `Depuis ${DayJsService.getDate(beginDate, 'MMMM YYYY')}`;
    }

    return `De ${DayJsService.getDate(beginDate, 'MMMM YYYY')} à ${DayJsService.getDate(endDate, 'MMMM YYYY')}`;
  }

  /**
   * create Downloadable Pdf
   * @param pdfInfos
   */
  public async createDownloadablePdf(pdfInfos: PdfInfosData): Promise<void> {
    return new Promise(async resolve => {
      const { fileName, contact, title, technoList, logo } = pdfInfos;
      const defaultPdfLogo: ContentImage = {
        image: await this.utilsService.convertImageToBase64('assets/img/pdf-web.png'), width: 86, height: 30,
      };

      this.updatePdfContent.setHeader();
      this.updatePdfContent.setFooter();

      const headerTable: ContentTable = {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [

              logo ? { image: logo.src, width: logo.width, height: logo.height } : defaultPdfLogo,
              { text: 'Le ' + DayJsService.getDate(undefined, 'DD MMMM YYYY'), style: 'right' },
            ],
            [
              { text: '\n' + contact.fullName, style: 'contact' },
              { text: title, style: 'title' },
            ],
            [
              {
                text: `Tel : ${
                  this.utilsService.formatPhoneNumber(contact.phoneNumberPartList.parts.join(contact.phoneNumberPartList.joiner))
                }\nMail : ${contact.emailPartList.parts.join(contact.emailPartList.joiner)}`,
                style: 'defaultStyle',
              },
              { text: technoList.join(', '), style: 'subtitle' },
            ],
          ],
        },
      };
      this.updatePdfContent.addTable(headerTable);

      contact.webLinkList.forEach((webLink) => {
        this.updatePdfContent.addText({
          text: `${webLink.name} : ${webLink.url}`,
          style: 'defaultStyle',
          link: webLink.url,
        });
      });

      await this.addPdfContents(pdfInfos.data);

      this.pdfMake.createPdf(this.pdfDocument as any).download(fileName);
      this.pdfDocument = PdfCreatorService.initPdf();
      resolve();
    });
  }

  private async addPdfContents(data: {
    experienceList?: ExperienceV1[]; formationList?: FormationV1[]; projectList?: ProjectItem[]; interestList?: InterestV1[];
  }): Promise<void> {
    if (data.experienceList && data.experienceList.length) {
      this.buildPdfExperiences(data.experienceList);
    }
    if (data.formationList && data.formationList.length) {
      this.buildPdfFormations(data.formationList);
    }
    if (data.projectList && data.projectList.length) {
      await this.buildPdfProjects(data.projectList);
    }
    if (data.interestList && data.interestList.length) {
      this.buildPdfInterests(data.interestList);
    }
  }

  private buildPdfExperiences(experienceList: ExperienceV1[]): void {
    this.updatePdfContent.addSectionTitle('Mes expériences', 'sectionTitle', '#024873');

    experienceList.forEach((exp) => {
      const expDate = PdfCreatorService.getDateToPrint(exp.beginDate, exp.endDate);
      this.updatePdfContent.addItemHeader(exp, expDate);

      if (exp.detailList && exp.detailList.length) {
        exp.detailList.forEach((detail) => {
          const eachDetailBody: any[] = [];
          if (detail.title) {
            eachDetailBody.push([{
              text: detail.title.toUpperCase(),
              bold: true,
              margin: [0, 8, 0, -2],
              fontSize: 10,
            }]);
          }

          if (detail.lineList && detail.lineList.length) {
            detail.lineList.forEach((line) => {
              eachDetailBody.push(line.charAt(0) !== '*'
                ? [{ text: ' - ' + line, style: 'lineDetail', margin: [5, 0, 10, 0] }]
                : [{ text: line, style: 'lineDetail' }],
              );
            });
          }

          this.updatePdfContent.addItemContent(eachDetailBody);
        });
      }
    });
  }

  private buildPdfFormations(formationList: FormationV1[]): void {
    this.updatePdfContent.addSectionTitle('Mes formations', 'sectionTitle', '#024873');

    formationList.forEach((form) => {
      const formDate = PdfCreatorService.getDateToPrint(form.beginDate, form.endDate);
      this.updatePdfContent.addItemHeader(form, formDate);

      if (form.detailList && form.detailList.length) {
        form.detailList.forEach((detail) => {
          if (detail.title && !detail.title.includes('Voir le certificat')) {
            const eachDetailBody: any[] = [];

            const title: string = detail.title.includes('Stage ')
              ? 'Stage (' + detail.title.split('(')[1]
              : detail.title;

            eachDetailBody.push([{
              text: title
                .replace('Détail du cours (', 'Durée du cours : ')
                .replace('Cours (', 'Durée des cours : ')
                .replace('Stage (', 'Durée du stage : ')
                .replace('heures) :', 'heures')
                .replace('mois)', 'mois')
                .replace('semaines)', 'semaines')
                .toUpperCase(),
              link: detail.url ? detail.url : '',
              bold: true, margin: [0, 4, 0, -2], fontSize: 10,
            }]);

            this.updatePdfContent.addItemContent(eachDetailBody);
          }
        });
      }
    });
  }

  private async buildPdfProjects(projectList: ProjectItem[]): Promise<void> {
    this.updatePdfContent.addSectionTitle('Mes projets', 'sectionTitle', '#024873', 'before');

    for (const project of projectList) {
      const image = await this.utilsService.convertImageToBase64(project.pictureList[0].src);

      const projTable: ContentTable = {
        layout: 'noBorders',
        margin: [0, 15, 0, 0],
        table: {
          dontBreakRows: true,
          widths: [190, '*'],
          body: [
            [
              { image, width: 175, height: 130 },
              {
                layout: 'noBorders',
                table: {
                  widths: ['*'],
                  body: [
                    [{ text: project.title, link: project?.link?.url || null, bold: true }],
                    [{ text: project.subTitle }],
                    [{ text: 'Technos utilisées : ' + project.technoList.join('  '), style: 'chip' }],
                  ],
                },
              },
            ],
          ],
        },
      };

      this.updatePdfContent.addTable(projTable);
    }
  }

  private buildPdfInterests(interestList: InterestV1[]): void {
    this.updatePdfContent.addSectionTitle('Mes centres d\'intérêts', 'sectionTitle', '#024873');
    const intBody: any[] = [];

    interestList.forEach(int => {
      intBody.push([{ text: int.title.toUpperCase(), bold: true, margin: [20, 20, 20, 0] }]);
      intBody.push([{
        text: int.description,
        link: int.link && int.link.url ? int.link.url : null,
        margin: [30, 0, 30, 0],
      }]);
    });

    const intTable: ContentTable = {
      margin: [0, 10],
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: intBody,
      },
    };
    this.updatePdfContent.addTable(intTable);
  }
}

