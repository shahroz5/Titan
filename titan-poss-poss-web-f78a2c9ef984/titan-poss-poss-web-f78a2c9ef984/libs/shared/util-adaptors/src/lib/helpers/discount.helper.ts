import {
  CashMemoItemDetailsResponse,
  DiscountConfigDetailsResponse,
  DiscountsResponse,
  DiscountTransactionLevelResponse
} from '@poss-web/shared/models';
import { DiscountAdaptor } from '../discount/discount.adaptor';

export class DiscountHelper {
  static getBillLevelDiscounts(data: any): DiscountTransactionLevelResponse[] {
    if (!data) {
      return null;
    }
    const discountDetails = [];
    for (const details of data) {
      discountDetails.push(DiscountAdaptor.getBillLevelDiscount(details));
    }
    return discountDetails;
  }

  static getDiscountsResponses(data: any): DiscountsResponse[] {
    if (!data) {
      return null;
    }
    console.log('data123', data);
    const appliedDiscounts = [];
    for (const discount of data.discountDetails) {
      appliedDiscounts.push(DiscountAdaptor.getDiscountsResponse(discount));
    }
    return appliedDiscounts;
  }

  static getDiscountConfigDetailsResponses(
    data: any,
    clubbingId?: any,
    payload?: any,
    cummulativeDiscountWithExcludeDetails?: any
  ): {
    discountConfigDetails: DiscountConfigDetailsResponse[];
    clubbingId: string;
    data?: CashMemoItemDetailsResponse;
    cummulativeDiscountWithExcludeDetails?: any;
  } {
    if (!data) {
      return null;
    }

    const discountConfigDetails = [];
    for (let d = 0; d < data.length; d++) {
      discountConfigDetails.push(
        DiscountAdaptor.getDiscountConfigDetailsResponse(
          data[d],
          payload?.existingDiscounts && payload?.existingDiscounts.length
            ? payload?.existingDiscounts[d]
            : null,
          payload?.id && payload?.id.length ? payload?.id[d] : null
        )
      );
    }
    return {
      discountConfigDetails: discountConfigDetails,
      clubbingId: clubbingId,
      data: payload?.data ? payload?.data : null,
      cummulativeDiscountWithExcludeDetails: cummulativeDiscountWithExcludeDetails
    };
  }
}
