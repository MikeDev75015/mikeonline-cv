import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'headerTitleFormat'
})
export class HeaderTitleFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.replace('TS CV', 'TS<br>CV').replace(/ /g, '&nbsp;');
  }

}
