import { Injectable } from '@angular/core';
import { ExperienceV1 } from '../../../core/interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../core/interfaces/models/v1/formation.interface';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  public static showOpenCloseButtons(element: ExperienceV1 | FormationV1 | undefined): boolean {
    if (!element || !element.detailList || !element.detailList.length) {
      return false;
    }

    const totalDetailListLines = element.detailList.reduce((totalLine: number, detail: any) => {
      let lines = 0;
      if (detail.title) {
        lines++;
      }
      if (detail.lineList) {
        lines += detail.lineList.length;
      }
      totalLine += lines;
      return totalLine;
    }, 0);

    return totalDetailListLines > 4;
  }

  public static setLineBodyPaddingLeft(): string {
    if (!window || !window.innerWidth) {
      return '0';
    }
    return window.innerWidth > 840 ? '50px' : '30px';
  }
}
