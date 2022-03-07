import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'oneLetterByLine'
})
export class OneLetterByLinePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? value.split('').join('<br>') : '';
  }

}
