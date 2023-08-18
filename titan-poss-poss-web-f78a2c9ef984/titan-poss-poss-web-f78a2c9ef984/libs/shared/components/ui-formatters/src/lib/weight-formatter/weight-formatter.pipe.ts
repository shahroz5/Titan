import { Pipe, PipeTransform } from '@angular/core';
import { WeightFormatterService } from './weight-formatter.service';

@Pipe({
  name: 'weightFormatter'
})
export class WeightFormatterPipe implements PipeTransform {
  constructor(private weightFormatter: WeightFormatterService) {}

  transform(value: any): string {
    return this.weightFormatter.format(value);
  }
}
