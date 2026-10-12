import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'oneLetterByLine',
    standalone: false
})
export class OneLetterByLinePipe implements PipeTransform {
  transform(value: string, ..._args: any[]): string {
    return value ? value.split('').join('<br>') : '';
  }
}
