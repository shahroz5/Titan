import { Component, Input } from '@angular/core';
import { AbCoConfig, DiscountTypeEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ab-co-config-view',
  templateUrl: './ab-co-config-view.component.html'
})
export class AbCoConfigViewComponent  {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: AbCoConfig;
  @Input() isABOfferApplicable = true;
  @Input() isCOOfferApplicable = true;

}
