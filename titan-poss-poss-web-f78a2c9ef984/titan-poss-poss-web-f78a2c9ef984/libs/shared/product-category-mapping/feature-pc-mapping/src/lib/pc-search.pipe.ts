import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productCategorySearch'
})
export class ProductCategorySearchPipe implements PipeTransform {
  transform(value: any, searchValue: any, searchField: any): any {
    if (!value) return [];
    if (!searchValue) return value;

    return value.filter(pc =>
      pc[searchField].toLowerCase().includes(searchValue.toLowerCase())
    );
  }
}
