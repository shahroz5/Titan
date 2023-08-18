import { Component, Input } from '@angular/core';

@Component({
  selector: 'poss-web-lot-bin-age-config-view',
  templateUrl: './lot-bin-age-config-view.component.html'
})
export class LotBinAgeConfigViewComponent  {
  @Input() config: {
    isSameDiscountApplicable: boolean;
    fromLotAge: number;
    toLotAge: number;
    fromBinAge: number;
    toBinAge: number;
  };
  @Input() type;

}
