import { Pipe, PipeTransform } from '@angular/core';
import {
  EXPERTISE_LEVEL_DROPDOWN_LIST,
  JOB_TYPE_DROPDOWN_LIST,
  PRIORITY_DROPDOWN_LIST,
} from '../../../../../../core/constants/common.constant';
import { ITag } from '../../../../../../core/interfaces/models/tag.interface';
import { DayJsService } from '../../../../../../core/services/dayjs/dayjs.service';

@Pipe({
  name: 'formatValueDisplay',
})
export class FormatValueDisplayPipe implements PipeTransform {

  transform(value: any, field: string): string {
    if (value === undefined || value === '') {
      return '';
    }

    switch (field) {
      case 'tagList':
        return (value as ITag[]).map((tag) => tag.name).join(', ');
      case 'beginDate':
        return DayJsService.getDate(value, 'MM/YYYY');
      case 'startDate':
        return DayJsService.getDate(value, 'MM/YYYY');
      case 'endDate':
        return DayJsService.getDate(value, 'MM/YYYY');
      case 'expertiseLevel':
        return EXPERTISE_LEVEL_DROPDOWN_LIST.find((level) => level.value === value)?.label || 'Non valide';
      case 'priority':
        return PRIORITY_DROPDOWN_LIST.find((priority) => priority.value === value)?.label || 'Non valide';
      case 'jobType':
        return JOB_TYPE_DROPDOWN_LIST.find((job) => job.value === value)?.label || 'Non valide';
      case 'link':
        return value.title + '\n' + value.url;
      case 'actualJob':
        return value ? 'Oui' : 'Non';
      case 'certificate':
        return value ? 'Oui' : 'Non';

      default:
        return value;
    }
  }

}
