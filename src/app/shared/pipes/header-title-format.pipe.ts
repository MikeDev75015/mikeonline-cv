import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'headerTitleFormat',
    standalone: false
})
export class HeaderTitleFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    return value ? value.replace(/ /g, '&nbsp;') : '';
  }

}
