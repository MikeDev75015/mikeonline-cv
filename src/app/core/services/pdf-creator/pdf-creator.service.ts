import {Injectable} from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { PdfDefinition } from '../../classes/pdf-definition.class';
import { PDF_CV_CREDITS, PDF_DEFAULT_FOOTER, PDF_DEFAULT_HEADER } from '../../constants/pdf.constant';
import { ICvInfos } from '../../interfaces/models/cv-infos.interface';
import { IExperience } from '../../interfaces/models/experience.interface';
import { IFormation } from '../../interfaces/models/formation.interface';
import { IInterest } from '../../interfaces/models/interest.interface';
import { IProject } from '../../interfaces/models/project.interface';
import { DayJsService } from '../dayjs/dayjs.service';

export interface IPdfColumn {
  width: string | number; // '*', 'auto', '%' or numeric value
  text: string;
  fontSize?: number;
  style?: string;
}

export interface IPdfColumnBundle {
  columns: IPdfColumn[];
  style?: string;
  alignment?: string;
  columnGap?: number; // optional space between columns
}

export interface IPdfTableBundle {
  table: {
    body: any[][];
    widths?: (string | number)[];
    heights?: number[] | number;
    headerRows?: number;
    dontBreakRows?: boolean;
    keepWithHeaderRows?: number;
  };
  style?: string;
  color?: string;
  layout?: any;
  margin?: number[] | number;
}

export interface IPdfImageOptions {
  width?: number;
  height?: number;
  fit?: number[];
  opacity?: number;
  pageBreak?: 'after' | 'before' | '';
}

@Injectable({
  providedIn: 'root',
})
export class PdfCreatorService {

  private pdfDocument = PdfCreatorService.initPdf();
  private readonly updatePdfContent = {
    addText: (
      text: string,
      style = 'defaultStyle',
      link = ''
      // @ts-ignore
    ) => this.pdfDocument.content.push(link ? {text, style, link} : {text, style}),

    addImage: (
      image: string,
      options: IPdfImageOptions
      // @ts-ignore
    ) => this.pdfDocument.content.push(options ? {image, ...options} : {image}),

    // @ts-ignore
    addColumns: (columns: IPdfColumnBundle) => this.pdfDocument.content.push(columns),
    // @ts-ignore
    addTable: (table: IPdfTableBundle) => this.pdfDocument.content.push(table),
    setHeader: (header: any = PDF_DEFAULT_HEADER) => this.pdfDocument.header = header,
    setFooter: (footer: any = PDF_DEFAULT_FOOTER) => this.pdfDocument.footer = footer,
    addSectionTitle: (
      title: string,
      style = 'defaultStyle',
      background = '#CCCCCC',
      pageBreak = ''
    ) => {
      this.pdfDocument.content.push({
        // @ts-ignore
        layout: 'noBorders',
        // @ts-ignore
        margin: [0, 20, 0, 0],
        table: {
          // @ts-ignore
          widths: ['*'],
          body: [
            [
              // @ts-ignore
              {text: title, style, fillColor: background, pageBreak: pageBreak ? pageBreak : ''},
            ]
          ]
        }
      });
    }
  };

  constructor(
    private readonly utilsService: UtilsService,
  ) {}

  private static getDefaultStyle() {
    return {
      font: 'Roboto',
      fontSize: 12,
      lineHeight: 1,
      color: '#024873',
      alignment: 'left'
    };
  }

  private static getStyles() {
    return {
      right: {
        alignment: 'right'
      },
      center: {
        alignment: 'center'
      },
      bold: {
        bold: true
      },
      header: {
        fontSize: 8,
        color: '#555555',
        alignment: 'center'
      },
      footer: {
        fontSize: 8,
        alignment: 'center'
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
        alignment: 'right'
      },
      subtitle: {
        fontSize: 18,
        bold: true,
        alignment: 'right'
      },
      sectionTitle: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        color: '#FFFFFF'
      },
      lineDetail: {
        fontSize: 11,
        lineHeight: 0.9
      },
      chip: {
        fontSize: 11,
        color: '#555555'
      }
    };
  }

  private static initPdf(): PdfDefinition {
    const newPdf = new PdfDefinition();
    newPdf.info = PDF_CV_CREDITS;
    newPdf.pageSize = 'A4';
    newPdf.pageOrientation = 'portrait';
    newPdf.pageMargins = [20, 20, 20, 20];
    newPdf.defaultStyle = PdfCreatorService.getDefaultStyle();
    newPdf.styles = PdfCreatorService.getStyles();
    newPdf.content = [];
    return newPdf;
  }

  private static addTitle(body: any[], exp: IExperience | IFormation, date: string): void {
    body.push([
      {
        layout: 'noBorders',
        margin: [0, 20, 0, 0],
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: exp.title + (exp.society ? ' - ' + exp.society : ''), style: 'bold' },
              { text: date, style: 'right', bold: true, color: '#555555' },
            ],
          ],
        },
      },
    ]);
  }

  private static addPlace(expBody: any[], exp: IExperience | IFormation): void {
    if (exp.place) {
      expBody.push([{ text: exp.place, italics: true, color: '#555555' }]);
    }
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

  private static checkLineBreakMode(currentNode: { headlineLevel: number; }, followingNodesOnPage: any[]): string {
    if (currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0) {
      return 'before';
    }
    return '';
  }

  public async createDownloadablePdf(pdfInfos: ICvInfos): Promise<void> {
    return new Promise(async resolve => {

      const {fileName, contact, title, technoList, logo, cvType} = pdfInfos;

      this.updatePdfContent.setHeader();
      this.updatePdfContent.setFooter();

      const headerTable: IPdfTableBundle = {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [
              // @ts-ignore
              {image: logo.src, width: logo.width, height: logo.height},
              {text: 'Le ' + DayJsService.getDate(undefined, 'DD MMMM YYYY'), style: 'right'},
            ],
            [
              {text: '\n' + contact.fullName, style: 'contact'},
              {text: title, style: 'title'},
            ],
            [
              {
                text: 'Tel : ' + this.utilsService.formatPhoneNumber(contact.phoneNumberPartList.parts.join(contact.phoneNumberPartList.joiner)) +
                  '\nMail : ' + contact.emailPartList.parts.join(contact.emailPartList.joiner),
                style: 'defaultStyle'
              },
              {text: technoList.join(', '), style: 'subtitle'},
            ]
          ]
        }
      };
      this.updatePdfContent.addTable(headerTable);

      contact.webLinkList.forEach(wl => {
        this.updatePdfContent.addText(
          wl.name + ' : ' + wl.url,
          'link',
          wl.url
        );
      });

      await this.addAdditionalFields(cvType, pdfInfos.data);

      // @ts-ignore
      pdfMake.fonts = {
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
      };

      // @ts-ignore
      pdfMake.createPdf(this.pdfDocument).download(fileName);
      this.pdfDocument = PdfCreatorService.initPdf();
      resolve();
    });
  }

  private async addAdditionalFields(type: string, data: {
    experienceList?: IExperience[]; formationList?: IFormation[]; projectList?: IProject[]; interestList?: IInterest[];
  }): Promise<void> {
    if (type !== 'full-cv') {
      return;
    }

    if (data.experienceList) {
      this.buildPdfExperiences(UtilsService.sortObjectList(data.experienceList, 'desc', 'beginDate', 'date'));
    }
    if (data.formationList) {
      this.buildPdfFormations(UtilsService.sortObjectList(data.formationList.map((f) => {
        if (!f.endDate) {
          return {
            ...f,
            endDate: DayJsService.getDate(undefined, 'YYYY-MM'),
          };
        }

        return f;
      }), 'desc', 'endDate', 'date'));
    }
    if (data.projectList) {
      await this.buildPdfProjects(UtilsService.sortObjectList(data.projectList, 'asc', 'position', 'number'));
    }
    if (data.interestList) {
      this.buildPdfInterests(data.interestList);
    }
  }

  private buildPdfExperiences(experienceList: IExperience[]): void {
    this.updatePdfContent.addSectionTitle('Mes expériences', 'sectionTitle', '#024873');
    const expBody: any[] = [];

    experienceList.forEach((exp) => {
      const expDate = PdfCreatorService.getDateToPrint(exp.beginDate, exp.endDate);
      PdfCreatorService.addTitle(expBody, exp, expDate);
      PdfCreatorService.addPlace(expBody, exp);

      if (exp.detailList && exp.detailList.length) {
        exp.detailList.forEach(detail => {
          if (detail.title) {
            expBody.push([{ text: detail.title.toUpperCase(), bold: true, margin: [0, 8, 0, -2], fontSize: 10 }]);
          }
          if (detail.lineList && detail.lineList.length) {
            detail.lineList.forEach(line => {
              expBody.push(line.charAt(0) !== '*'
                ? [{ text: ' - ' + line, style: 'lineDetail', margin: [5, 0, 10, 0] }]
                : [{ text: line, style: 'lineDetail' }],
              );
            });
          }
        });
      }
    });

    const expTable: IPdfTableBundle = {
      margin: [0, 10],
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: expBody
      }
    };
    this.updatePdfContent.addTable(expTable);
  }

  private buildPdfFormations(formationList: IFormation[]): void {
    this.updatePdfContent.addSectionTitle('Mes formations', 'sectionTitle', '#024873', 'before');
    const formBody: any[] = [];

    formationList.forEach((form) => {
      const formDate = PdfCreatorService.getDateToPrint(form.beginDate, form.endDate);
      PdfCreatorService.addTitle(formBody, form, formDate);
      PdfCreatorService.addPlace(formBody, form);

      if (form.detailList && form.detailList.length) {
        form.detailList.forEach(detail => {
          if (detail.title && !detail.title.includes('Voir le certificat')) {
            const title: string = detail.title.includes('Stage ')
              ? 'Stage (' + detail.title.split('(')[1]
              : detail.title;

            formBody.push([{
              text: title
                .replace('Détail du cours (', 'Durée du cours : ')
                .replace('Cours (', 'Durée des cours : ')
                .replace('Stage (', 'Durée du stage : ')
                .replace('heures) :', 'heures')
                .replace('mois)', 'mois')
                .replace('semaines)', 'semaines')
                .toUpperCase(),
              link: detail.url ? detail.url : '',
              bold: true, margin: [0, 4, 0, -2], fontSize: 10
            }]);
          }
        });
      }
    });

    const formTable: IPdfTableBundle = {
      margin: [0, 10],
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: formBody
      }
    };
    this.updatePdfContent.addTable(formTable);
  }

  private async buildPdfProjects(projectList: IProject[]): Promise<void> {
    this.updatePdfContent.addSectionTitle('Mes projets',
      'sectionTitle', '#024873', 'before');
    const projBody = [];
    let index = 0;
    const displayPerPage = 4;
    let newLimit = displayPerPage;

    for (const [i, p] of projectList.entries()) {
      projBody.push([
        {
          layout: 'noBorders',
          margin: [0, 30, 0, 0],
          table: {
            widths: ['auto', '*'],
            body: [
              [
                {
                  image: await this.utilsService.convertImageToBase64(p.pictureList[0].src), margin: [0, 0, 20, 10],
                  // @ts-ignore
                  pageBreak: (currentNode, followingNodesOnPage) => PdfCreatorService.checkLineBreakMode(currentNode, followingNodesOnPage),
                },
                {
                  layout: 'noBorders',
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          text: p.title, link: p.link && p.link.url ? p.link.url : null, bold: true,
                          // @ts-ignore
                          pageBreak: (currentNode, followingNodesOnPage) => PdfCreatorService.checkLineBreakMode(currentNode, followingNodesOnPage),
                        }
                      ]
                    ]
                  }
                }
              ]
            ]
          }
        }
      ]);

      if (p.subTitle) {
        // @ts-ignore
        projBody[index][0].table.body[0][1].table.body.push([{text: p.subTitle}]);
      }

      if (p.technoList && p.technoList.length) {
        // @ts-ignore
        projBody[index][0].table.body[0][1].table.body.push([
          // @ts-ignore
          {text: 'Technos utilisées : ' + p.technoList.join('  '), style: 'chip'}
          // chipTable
        ]);
      }

      if ((i + 1) === newLimit) {
        newLimit += displayPerPage;
        projBody.push([{text: '', pageBreak: 'before'}]);
        index += 1;
      }

      index += 1;
    }

    const projTable: IPdfTableBundle = {
      margin: [0, 10],
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: projBody
      }
    };
    this.updatePdfContent.addTable(projTable);
  }

  private buildPdfInterests(interestList: IInterest[]): void {
    this.updatePdfContent.addSectionTitle(
      'Mes centres d\'intérêts', 'sectionTitle',
      '#024873'/*, 'before'*/);
    const intBody: any[] = [];

    interestList.forEach(int => {
      intBody.push([{text: int.title.toUpperCase(), bold: true, margin: [20, 20, 20, 0]}]);
      intBody.push([{text: int.description, link: int.link && int.link.url ? int.link.url : null, margin: [30, 0, 30, 0]}]);
    });

    const intTable: IPdfTableBundle = {
      margin: [0, 10],
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: intBody
      }
    };
    this.updatePdfContent.addTable(intTable);
  }
}

/*
Style properties

font: string: name of the font
fontSize: number: size of the font in pt
fontFeatures: string[]: array of advanced typographic features supported in TTF fonts (supported features depend on font file)
lineHeight: number: the line height (default: 1)
bold: boolean: whether to use bold text (default: false)
italics: boolean: whether to use italic text (default: false)
alignment: string: (‘left’ or ‘center’ or ‘right’) the alignment of the text
characterSpacing: number: size of the letter spacing in pt
color: string: the color of the text (color name e.g., ‘blue’ or hexadecimal color e.g., ‘#ff5500’)
background: string the background color of the text
markerColor: string: the color of the bullets in a buletted list
decoration: string: the text decoration to apply (‘underline’ or ‘lineThrough’ or ‘overline’)
decorationStyle: string: the style of the text decoration (‘dashed’ or ‘dotted’ or ‘double’ or ‘wavy’)
decorationColor: string: the color of the text decoration, see color

 */
