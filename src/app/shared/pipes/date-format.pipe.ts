import { Pipe, PipeTransform } from '@angular/core';
import { DayJsService } from '../../core/services/dayjs/dayjs.service';

@Pipe({
    name: 'dateFormat',
    standalone: false
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string, format: string): string {
    return value ? DayJsService.getDate(value, format) : '';
  }
}
