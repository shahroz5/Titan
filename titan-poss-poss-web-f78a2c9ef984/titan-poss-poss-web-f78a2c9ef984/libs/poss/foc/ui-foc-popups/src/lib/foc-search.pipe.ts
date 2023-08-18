import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'focSearch'
})
export class FocSearchPipe implements PipeTransform {
  transform(value: any, searchValue: any, searchField: any): any {
    if (!value) return [];
    if (!searchValue) return value;

    return value.filter(
      data => data[searchField].toString() === searchValue.toString()
    );
  }
}
