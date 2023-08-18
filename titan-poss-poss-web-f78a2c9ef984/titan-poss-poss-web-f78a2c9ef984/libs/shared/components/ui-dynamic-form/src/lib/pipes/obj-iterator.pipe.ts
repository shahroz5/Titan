import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objIterator'
})
export class ObjIteratorPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    return Object.keys(value);
  }
}
