import {
    CustomErrors, ProductPriceDetails, CashMemoTaxDetails
  } from '@poss-web/shared/models';
  
export const findPriceFeatureKey = 'findPrice';

export class FindPriceState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  isViewPricing?: boolean;
  standardMetalPriceDetails: any;
  priceDetails: ProductPriceDetails;
  taxDetails: CashMemoTaxDetails;
  itemCode: string;
}