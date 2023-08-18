import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productGroupSearch'
})
export class ProductGroupSearchPipe implements PipeTransform {
    transform(value: any, searchValue: any, searchField: any): any {
        if (!value) return [];
        if (!searchValue) return value;

        return value.filter(location =>
            location[searchField].toLowerCase().includes(searchValue.toLowerCase())
        );
    }
}
