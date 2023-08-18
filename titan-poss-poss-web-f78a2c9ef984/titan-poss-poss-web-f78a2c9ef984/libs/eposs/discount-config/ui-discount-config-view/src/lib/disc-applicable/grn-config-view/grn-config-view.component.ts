import { Component, Input } from '@angular/core';
import { DiscountTypeEnum, GRNConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-grn-config-view',
  templateUrl: './grn-config-view.component.html'
})
export class GrnConfigViewComponent  {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: GRNConfig;

  @Input() enableDaysOptionOfGRN: boolean;
  @Input() enableDaysOptionOfInvoice: boolean;
  @Input() enableAllowedForGRNBeforeOfferPeriodOption: boolean;
  @Input() enableGRNSameCFAEligibleOption: boolean;
  @Input() enableIsGRNApplicable: boolean;

}
