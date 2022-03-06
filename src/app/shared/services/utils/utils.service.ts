import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { IShareData } from '../../../core/interfaces/share-data.interface';
import { AlertService } from '../../../core/modules/alert/alert.service';
import { DataService } from '../data/data.service';

declare global {
  interface window {
    navigator: any;
  }
}

moment.locale('fr');

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  openingUrl = false;

  constructor(
    private readonly dataService: DataService,
    private readonly alertService: AlertService,
    private readonly http: HttpClient
  ) {
  }

  public pluralize = (length: number) => !length || length <= 1 ? '' : 's';

  public dateConverter(dateToConvert: string, method: string, labelMethod: string | undefined = undefined, format = 'format', labelFormat?: boolean): string {
    // @ts-ignore
    const convertedDate = moment(dateToConvert)[method](labelMethod)[format](labelFormat);
    return convertedDate !== 'un an' ? convertedDate : '1 an';
  }

  public convertDateToNumber(value: string): number {
    const num = value.match(/\d+/g);

    if (num && value.includes('mois')) {
      return Math.ceil(+num[0] * 100 / 12) / 100;
    }

    return num ? +num[0] : 1;
  }

  public getComputedProperty = (element: Element, property: string) => window.getComputedStyle(element).getPropertyValue(property);

  public convertPixelsToNumber = (pixels: string, round = false) => round
    ? Math.round(+pixels.replace('px', ''))
    : +pixels.replace('px', '');

  public initTechnoListWithTagList(tagList: ITag[], full = false): string[] {
    let technoList = tagList.map((tag) => tag.name);

    if (technoList.length > 6 && !full) {
      const diff = technoList.length - 6;
      technoList = technoList.filter((t, i) => i < 6);
      technoList.push('et ' + diff + ' autre' + this.pluralize(diff) + '...');
    } else if (technoList.length < 7) {
      for (let i = technoList.length; i < 7; i++) {
        technoList.push(' ');
      }
    }
    return technoList;
  }

  public async convertImageToBase64(url: string): Promise<string> {
    const loadedFile = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(loadedFile);
    });
  }

  public formatPhoneNumber(phoneNumber: string): string {
    let phoneToWork = (phoneNumber.includes('+33')
      ? phoneNumber.replace('+33', '')
      : phoneNumber).trim();

    if (phoneToWork.length === 10 && phoneToWork.charAt(0) === '0') {
      phoneToWork = phoneToWork.substr(1);
    }

    if (phoneToWork.length === 9) {
      return '+33 ' + phoneToWork
        .split('')
        .map((n, i) => {
          if (i % 2 === 0) {
            return n;
          } else {
            return ' ' + n;
          }
        })
        .join('');
    }

    return phoneNumber;
  }

  public uppercaseFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.substr(1);

  public openURL(url: string): void {
    if (!this.openingUrl) {
      this.alertService.displayConfirmDialog({
        title: 'attention, ouverture d\'une page externe...',
        msg: 'ouvrir dans ?',
        closeBtnLabel: 'annuler',
        actionsList: [
          {action: '_blank', name: 'nouvel onglet'},
          {action: '_self', name: 'onglet actuel'}
        ]
      })
        .then(
          action => {
            if (!action) {
              return;
            }

            setTimeout(() => {
              window.open(url, action);
              this.openingUrl = false;
            }, 500);
          }
        );
    }
  }

  public async share(shareData: IShareData): Promise<void> {
    try {
      // @ts-ignore
      await navigator.share(shareData);
    } catch (err) {
      // @ts-ignore
      if (err.message === 'Share canceled') {
        return;
      }

      this.alertService.displayAlertDialog({
        title: 'oups !',
        // @ts-ignore
        msg: 'Le contenu n\'a pas été partagé correctement :' + '\n' + err.message
      });
    }
  }


}
