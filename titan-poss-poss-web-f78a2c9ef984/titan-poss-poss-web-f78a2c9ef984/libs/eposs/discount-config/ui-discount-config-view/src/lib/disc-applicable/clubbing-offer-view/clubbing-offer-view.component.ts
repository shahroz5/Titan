import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ClubbingOffersConfig,
  DiscountTypeEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-clubbing-offer-view',
  templateUrl: './clubbing-offer-view.component.html'
})
export class ClubbingOfferViewComponent implements OnInit {
  @Input() isSystemDiscount: boolean;
  @Input() enableClubbingBillLevelDiscountOption: boolean;
  @Input() isEmpowermentDiscount: boolean;
  @Input() isCoinOfferDiscount: boolean;
  @Input() isRiva: boolean;
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: ClubbingOffersConfig;
  options: {
    translationKey: string;
    formControlName: string;
  }[] = [];
  form: FormGroup;

  optionSet = new Set<string>();

  ngOnInit(): void {
    this.form = new FormGroup({
      isExchangeOffer: new FormControl(this.config.isExchangeOffer),
      isFOCOffer: new FormControl(this.config.isFOCOffer),
      isGHS: new FormControl(this.config.isGHS),
      isRiva: new FormControl(this.config.isRiva),
      isDV: new FormControl(this.config.isDV),
      isCoin: new FormControl(this.config.isCoin),
      isBillLevelDiscount: new FormControl(
        this.config.isBillLevelDiscount
      )
    });
  }
  ngOnChanges() {
    this.options = this.getOfferOptions();
    this.options.forEach(data => this.optionSet.add(data.formControlName));
  }
  getOfferOptions(): {
    translationKey: string;
    formControlName: string;
  }[] {
    this.optionSet = new Set<string>();
    if (this.isSystemDiscount) {
      const discounts = [];
      if (!this.isRiva) {
        discounts.push({
          formControlName: 'isRiva',
          translationKey: 'pw.discountApplicable.isClubbedRivaLabel'
        });
      }
      return discounts;
    } else {
      const discounts = [
        {
          formControlName: 'isExchangeOffer',
          translationKey: 'pw.discountApplicable.isClubbedExchangeOfferLabel'
        },
        {
          formControlName: 'isFOCOffer',
          translationKey: 'pw.discountApplicable.isClubbedFOCLabel'
        },
        {
          formControlName: 'isGHS',
          translationKey: 'pw.discountApplicable.isClubbedGHSLabel'
        },

        {
          formControlName: 'isDV',
          translationKey: 'pw.discountApplicable.isClubbedDVLabel'
        }
      ];

      if (!this.isRiva) {
        discounts.push({
          formControlName: 'isRiva',
          translationKey: 'pw.discountApplicable.isClubbedRivaLabel'
        });
      }

      if (this.enableClubbingBillLevelDiscountOption) {
        discounts.push({
          formControlName: 'isBillLevelDiscount',
          translationKey: 'pw.discountApplicable.isClubbinedBillDiscountsLabel'
        });
      }
      if (
        this.selectedDiscount !==
        (DiscountTypeEnum.SYSTEM_DISCOUNT &&
          DiscountTypeEnum.COIN_OFFER_DISCOUNT)
      ) {
        discounts.push({
          formControlName: 'isCoin',
          translationKey: 'pw.discountApplicable.isClubbeddCoinLabel'
        });
      }

      return discounts;
    }
  }
}
