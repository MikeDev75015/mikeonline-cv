import { Pipe, PipeTransform } from '@angular/core';
import {
  EXPERTISE_LEVEL_DROPDOWN_LIST,
  JOB_TYPE_DROPDOWN_LIST,
  PRIORITY_DROPDOWN_LIST,
} from '../../../../../../core/constants/common.constant';
import { TagV1 } from '../../../../../../core/interfaces/models/v1/tag.interface';
import { DayJsService } from '../../../../../../core/services/dayjs/dayjs.service';
import { DropdownOption } from '../../dropdown-wrapper/interfaces/dropdown-option.interface';

@Pipe({
  name: 'formatValueDisplay',
})
export class FormatValueDisplayPipe implements PipeTransform {

  transform(value: any, field: string, html = true): string {
    if (value === undefined || value === '') {
      return '';
    }
    const lineEnding = html ? '<br>' : '';
    const incompressibleSpace = html ? '&nbsp;' : ' ';

    switch (field) {
      case 'cvType':
        return value === 'full-cv' ? 'Complet' : 'Partiel';
      case 'technoList':
        return value.join(', ');
      case 'contact':
        return FormatValueDisplayPipe.displayContactInLine(value, lineEnding, incompressibleSpace);
      case 'tagList':
        return (value as TagV1[]).map((tag) => tag.name).join(', ');
      case 'beginDate':
        return DayJsService.getDate(value, 'MM/YYYY');
      case 'startDate':
        return DayJsService.getDate(value, 'MM/YYYY');
      case 'endDate':
        return DayJsService.getDate(value, 'MM/YYYY');
      case 'expertiseLevel':
        return FormatValueDisplayPipe.getDropdownLabel(EXPERTISE_LEVEL_DROPDOWN_LIST, value);
      case 'priority':
        return FormatValueDisplayPipe.getDropdownLabel(PRIORITY_DROPDOWN_LIST, value);
      case 'jobType':
        return FormatValueDisplayPipe.getDropdownLabel(JOB_TYPE_DROPDOWN_LIST, value);
      case 'link':
        return `${value.title}\n${value.url}`;
      case 'actualJob':
        return value ? 'Oui' : 'Non';
      case 'certificate':
        return value ? 'Oui' : 'Non';
      case 'position':
        return value + 1;

      default:
        return value;
    }
  }

  private static getDropdownLabel(list: DropdownOption[], value: any): string {
    return list.find((option) => option.value === value)?.label || 'Non valide';
  }

  private static displayContactInLine(value: any, lineEnding: string, incompressibleSpace: string): string {
    return `${value.fullName}${lineEnding}
${value.phoneNumberPartList.parts.join(value.phoneNumberPartList.joiner)}${lineEnding}
${value.emailPartList.parts.join(value.emailPartList.joiner)}${lineEnding}
${value.location}${lineEnding}
${value.personalSituation.familyStatus},${lineEnding}
${DayJsService.getTimeToNow(value.personalSituation.birthDate, true)},${incompressibleSpace} ${value.personalSituation.drivingLicense}`;
  }
}
