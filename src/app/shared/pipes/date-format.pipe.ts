import { Pipe, PipeTransform } from '@angular/core';
import { DayJsService } from '../../core/services/dayjs/dayjs.service';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    console.log('DateFormatPipe: ', value)
    console.log('args:', args.join(' / '))
    return value ? DayJsService.getDate(value, args[0]) : '';
  }

}
