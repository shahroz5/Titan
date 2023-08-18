import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemCodeSearch'
})
export class ItemCodeSearchPipe implements PipeTransform {
  transform(value: any, searchValue: any, searchField: any): any {
    if (!value) return [];
    if (!searchValue) return value;
    return value.filter(focItemCodes =>
      focItemCodes[searchField]
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }
}
