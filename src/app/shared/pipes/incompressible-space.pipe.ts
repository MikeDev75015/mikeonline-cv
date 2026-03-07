import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'incompressibleSpace',
    standalone: false
})
export class IncompressibleSpacePipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    return value ? value
      .replace(/ /g, '&nbsp;')
      .replace('&nbsp;/', ' /') : '';
  }

}
