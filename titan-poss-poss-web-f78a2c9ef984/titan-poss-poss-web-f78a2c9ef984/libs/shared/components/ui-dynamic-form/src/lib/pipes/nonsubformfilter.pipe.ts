import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nonsubformfilter'
})
export class NonsubformfilterPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
    return value.filter(d => d.controlType !== 'subForm');
  }

}
