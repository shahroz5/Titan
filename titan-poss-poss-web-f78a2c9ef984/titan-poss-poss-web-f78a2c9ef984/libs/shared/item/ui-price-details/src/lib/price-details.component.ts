import {
  PriceTypeEnum,
  MetalTypeEnum,
  PriceBreakup
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'poss-web-price-details',
  templateUrl: './price-details.component.html',
  styleUrls: ['./price-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceDetailsComponent implements OnInit {
  @Input() priceBreakup: PriceBreakup;
  @Input() currencyCode: string;
  @Input() weightUnit: string;

  priceList: {
    type: PriceTypeEnum;
    metalInfo?: {
      metalType: string;
      weight: number;
    };
    stoneInfo?: {
      weight: number;
    };
    makingChargeInfo?: {
      value: number;
      isPercentage: boolean;
      isDynamicPricing: boolean;
    };
    amount: number;
    weightInfo?: {
      weightUnit: string;
      weight: number;
    };
  }[] = [];

  priceTypeEnumRef = PriceTypeEnum;
  metalTypeEnumRef = MetalTypeEnum;
  columnDetails: string[] = ['description', 'amount'];

  ngOnInit() {
    console.log('price breakup', this.priceBreakup);
    // Add Metail Price list
    this.priceList = this.priceList.concat(
      this.priceBreakup.metalPrices.map(mp => ({
        type: PriceTypeEnum.METAL_PRICE,
        metalInfo: {
          metalType: mp.metalType,
          weight: mp.weight
        },
        amount: mp.amount
      }))
    );

    // Add Stone Price
    if (this.priceBreakup.hasStone) {
      this.priceList.push({
        type: PriceTypeEnum.STONE_CHARGE,

        stoneInfo: {
          weight: this.priceBreakup.stonePrice.weight
        },

        amount: this.priceBreakup.stonePrice.amount
      });
    }

    // Add Making Charge
    if (this.priceBreakup.hasMakingCharge) {
      this.priceList.push({
        type: PriceTypeEnum.MAKING_CHARGE,

        makingChargeInfo: {
          value: this.priceBreakup.makingCharges.value,
          isPercentage: this.priceBreakup.makingCharges.isPercentage,
          isDynamicPricing: this.priceBreakup.makingCharges.isDynamicPricing
        },

        amount: this.priceBreakup.makingCharges.amount
      });
    }

    // Add UCP Price
    if (this.priceBreakup.hasUcp) {
      this.priceList.push({
        type: PriceTypeEnum.UCP_PRICE,
        amount: this.priceBreakup.ucpPrice.amount,

        weightInfo: {
          weightUnit: this.priceBreakup.ucpPrice.weightUnit,
          weight: this.priceBreakup.ucpPrice.weight
        }
      });
    }
  }

  calculateHMGSTValue(value, percent) {
    return (value * percent) / 100;
  }
}
