import { Component, Input } from '@angular/core';
import {
  CumulativeDiscountConfig,
  DiscountTypeEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cumulative-discounts-view',
  templateUrl: './cumulative-discounts-view.component.html'
})
export class CumulativeDiscountsViewComponent  {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: CumulativeDiscountConfig;

}
