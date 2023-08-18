import { Component, Input } from '@angular/core';
import { NewDiscountApplicableConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discount-tss-config-view',
  templateUrl: './discount-tss-config-view.component.html'
})
export class DiscountTssConfigViewComponent{
  @Input() config: NewDiscountApplicableConfig;

}
