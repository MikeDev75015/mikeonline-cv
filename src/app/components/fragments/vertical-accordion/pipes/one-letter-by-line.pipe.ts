import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'oneLetterByLine',
})
export class OneLetterByLinePipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return value ? value.split('').join('<br>') : '';
  }
}
