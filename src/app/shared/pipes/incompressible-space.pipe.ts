import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'incompressibleSpace'
})
export class IncompressibleSpacePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? value
      .replace(/ /g, '&nbsp;')
      .replace('&nbsp;/', ' /') : '';
  }

}
