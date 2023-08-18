import { Component, Input } from '@angular/core';
import { AdditionalMaxValueOrPercentage } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-add-max-allowed-value-view',
  templateUrl: './add-max-allowed-value-view.component.html'
})
export class AddMaxAllowedValueViewComponent  {
  @Input() config: AdditionalMaxValueOrPercentage;
  @Input() currencyCode: string;

}
