import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fillRows' })
export class FillRowsPipe implements PipeTransform {
  // to create number of rows in shortcut help popup
  transform(value, size: number) {
    if (!value || !size) {
      size = 10;
    }
    const missing = size - (value ? value.length : 0);
    if (missing < 0) {
      return null;
    }
    const newArray = new Array(missing).fill({
      description: null,
      shortcutKeys: null
    });
    return value.concat(newArray);
  }
}
