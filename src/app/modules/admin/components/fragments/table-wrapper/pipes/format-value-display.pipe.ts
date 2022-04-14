import { Pipe, PipeTransform } from '@angular/core';
import { JOB_TYPE_DROPDOWN_LIST } from '../../../../../../core/constants/common.constant';
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
      case 'jobType':
        return JOB_TYPE_DROPDOWN_LIST.find((job) => job.value === value)?.label || 'Non valide';
      case 'link':
        return value.title + '\n' + value.url;
      default:
        return value;
    }
  }

}
