import { Pipe, PipeTransform } from '@angular/core';
import { WeightFormatterService } from './weight-formatter.service';

@Pipe({
  name: 'weightInCarat'
})
export class WeightInCaratPipe implements PipeTransform {
  constructor(private weightFormatterService: WeightFormatterService) {}
  transform(value: any): any {
    return isNaN(value) ? value : this.weightFormatterService.format(value * 5);
  }
}
