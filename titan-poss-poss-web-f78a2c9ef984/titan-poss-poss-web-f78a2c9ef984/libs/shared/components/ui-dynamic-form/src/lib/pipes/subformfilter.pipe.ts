import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subformfilter'
})
export class SubformfilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.filter(d => d.controlType === 'subForm');
  }

}
