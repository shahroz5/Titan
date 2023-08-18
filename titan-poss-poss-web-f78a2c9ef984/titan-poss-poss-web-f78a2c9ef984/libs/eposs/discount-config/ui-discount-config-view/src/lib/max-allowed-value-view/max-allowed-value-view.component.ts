import { Component, Input } from '@angular/core';
import { MaxValueOrPercentage } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-max-allowed-value-view',
  templateUrl: './max-allowed-value-view.component.html'
})
export class MaxAllowedValueViewComponent {
  @Input() config: MaxValueOrPercentage;
  @Input() currencyCode: string;
  @Input() type;

}
