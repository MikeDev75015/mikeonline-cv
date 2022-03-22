import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { partialIsoDatePattern } from '../../../core/constants/patterns.constant';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { IShareData } from '../../../core/interfaces/share-data.interface';
import { AlertService } from '../../../core/modules/alert/services/alert.service';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';
import { ClipboardService } from '../clipboard/clipboard.service';

declare global {
  interface window {
    navigator: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private openingUrl = false;

  constructor(
    private readonly alertService: AlertService,
    private readonly http: HttpClient,
  ) {
  }

  /**
   * Sort the array by property in different modes
   * @param list
   * @param way
   * @param key
   * @param mode
   */
  public static sortObjectList<t>(
    list: t[], way: 'asc' | 'desc', key: string, mode: 'string' | 'number' | 'date' = 'string',
  ): t[] {
    return list.sort((a: { [key: string]: any }, b: { [key: string]: any }) => {
      if (a[key] === undefined || b[key] === undefined) {
        throw new Error('One of values to compare is undefined, cannot sort object list!');
      }

      if (mode === 'number') {
        return way === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key];
      }

      if (mode === 'date') {
        const date1: string = a[key].match(partialIsoDatePattern) ? `${a[key]}-01` : a[key];
        const date2: string = b[key].match(partialIsoDatePattern) ? `${b[key]}-01` : b[key];

        return way === 'asc'
          ? new Date(date1).getTime() - new Date(date2).getTime()
          : new Date(date2).getTime() - new Date(date1).getTime();
      }

      return way === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
    });
  }

  /**
   * Merges two array
   * @param firstList
   * @param secondList
   * @param type
   */
  public static mergeTwoListWithoutDuplications<T>(firstList: T[], secondList: T[], type = 'string'): T[] {
    if (type !== 'string') {
      throw new Error('Not Implemented');
    }

    secondList.forEach((s) => {
      if (!firstList.includes(s)) {
        firstList.push(s);
      }
    });
    return firstList;
  }

  public static addMissingEndDate<T>(list: T[]): T[] {
    return list.map((element: any) => {
      if (!element.endDate) {
        return {
          ...element,
          endDate: DayJsService.getDate(undefined, 'YYYY-MM'),
        };
      }

      return element;
    });
  }

  public static uppercaseFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.substring(1);

  public getElementId(element: any): string {
    return element?.id
      ? element.id
      : UtilsService.getParentElementId(element?.parentElement);
  }

  public pluralize = (length: number): string => !length || length <= 1 ? '' : 's';

  public convertDateToKnobYearsValue(value: string): number {
    const num = value.match(/\d+/g);

    if (num && value.includes('mois')) {
      return Math.ceil(+num[0] * 100 / 12) / 100;
    }

    return num ? +num[0] : 1;
  }

  public getComputedProperty = (element: Element, property: string): string => window.getComputedStyle(element).getPropertyValue(property);

  public convertPixelsToNumber = (pixels: string, round = false): number => round
    ? Math.round(+pixels.replace('px', ''))
    : +pixels.replace('px', '');

  public initTechnoListWithTagList(tagList: ITag[], full = false): string[] {
    let technoList = tagList.map((tag) => tag.name);

    if (technoList.length > 6 && !full) {
      const diff = technoList.length - 6;
      technoList = technoList.filter((t, i) => i < 6);
      technoList.push(`et ${diff} autre${this.pluralize(diff)}...`);
    } else if (technoList.length < 7) {
      for (let i = technoList.length; i < 7; i++) {
        technoList.push(' ');
      }
    }
    return technoList;
  }

  public formatPhoneNumber(phoneNumber: string): string {
    let phoneToWork = phoneNumber.includes('+33')
      ? phoneNumber.replace('+33', '').replace(/ /g, '')
      : phoneNumber.replace(/ /g, '');

    if (phoneToWork.length === 10 && phoneToWork.charAt(0) === '0') {
      phoneToWork = phoneToWork.substring(1);
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

  public uppercaseFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.substring(1);

  public openURL(url: string): void {
    if (!this.openingUrl) {
      this.openingUrl = true;

      this.alertService.displayConfirmDialog({
        title: 'attention, ouverture d\'une page externe...',
        msg: 'ouvrir dans ?',
        closeBtnLabel: 'annuler',
        actionsList: [
          { action: '_blank', name: 'nouvel onglet' },
          { action: '_self', name: 'onglet actuel' },
        ],
      }).then(action => {
        if (!action) {
          return;
        }

        setTimeout(() => {
          window.open(url, action);
        }, 500);

      }).finally(() => {
        this.openingUrl = false;
      });
    }
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

  public async share(shareData: IShareData): Promise<void> {
    try {
      await window.navigator.share(shareData);
    } catch (shareErr) {
      if (shareErr !== 'Share canceled') {
        const warnMessage: { title: string; msg: string; } = {
          title: 'Oups !',
          msg: `Le contenu n'a pas été partagé correctement.`
        };

        // ios
        if (shareErr === 'window.navigator.share is not a function') {
          warnMessage.msg = 'Fonction indisponible sur cet appareil.';

          try {
            await ClipboardService.onClipboardCopy(shareData.url);

            warnMessage.title = 'Info !';
            warnMessage.msg = 'Lien copié dans le presse-papier.';
          } catch (clipboardErr) {
            const clipboardError = clipboardErr as { message: string };
            console.warn(clipboardError);
          }
        }

        this.alertService.displayAlertDialog({
          ...warnMessage,
          closeBtnLabel: 'fermer',
        });
      }
    }
  }

  private static getParentElementId(parentElement: any, depth = 1): string {
    if (!parentElement || depth > 4) {
      return '';
    }
    depth++;

    return parentElement.id
      ? parentElement.id
      : UtilsService.getParentElementId(parentElement.parentElement, depth);
  }
}
