import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ClubbingDiscountsConfig,
  DiscountTypeEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-clubbing-discounts-view',
  templateUrl: './clubbing-discounts-view.component.html'
})
export class ClubbingDiscountsViewComponent implements OnInit {
  @Input() enableClubbingBillLevelDiscountOption: boolean;
  @Input() enableClubbingDiscountOption: boolean;
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: ClubbingDiscountsConfig;
  @Input() clubbingDiscountTypes;
  types = [
    {
      description: 'Type 1',
      value: 'TYPE1'
    },
    {
      description: 'Type 2',
      value: 'TYPE2'
    },
    {
      description: 'Type 3',
      value: 'TYPE3'
    }
  ];
  form: FormGroup;


  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(this.config.discountType),
      isClubbedOtherDiscounts: new FormControl(
        this.config.isClubbedOtherDiscounts
      ),
      isClubbedOtherBillLevelDiscounts: new FormControl(
        this.config.isClubbedOtherBillLevelDiscounts
      )
    });
  }
}
