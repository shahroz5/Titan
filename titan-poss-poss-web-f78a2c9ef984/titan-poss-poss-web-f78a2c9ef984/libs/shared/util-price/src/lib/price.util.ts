import {
  PriceTypeEnum,
  PriceDetails,
  PriceBreakup,
  TaxData,
  MakingChargesDetails
} from '@poss-web/shared/models';

export function calculatePriceBreakup(
  priceDetails: PriceDetails,
  taxDetails: TaxData,
  isUcpData?: {
    isUcp: boolean;
    totalValue: number;
    weightUnit: string;
    weight: number;
  },
  totalDiscount: number = 0
): PriceBreakup {
  // Create Price Breakup Object and set units
  const priceDetailsObject = new PriceBreakup();

  if (isUcpData.isUcp) {
    priceDetailsObject.setUcpPrice(
      isUcpData.totalValue,
      isUcpData.weightUnit,
      isUcpData.weight
    );
  } else {
    // Add Metal Prices
    priceDetails.metalPriceDetails.metalPrices.forEach(metalPrice => {
      priceDetailsObject.addMetalPrice(
        metalPrice.metalTypeCode,
        metalPrice.netWeight,
        metalPrice.metalValue
      );
    });

    // Set Stone Price
    if (
      priceDetails?.stonePriceDetails?.preDiscountValue ||
      priceDetails?.stonePriceDetails?.stoneWeightForView
    ) {
      const stonePriceDetails = priceDetails.stonePriceDetails;
      priceDetailsObject.setStonePrice(
        stonePriceDetails.stoneWeightForView
          ? stonePriceDetails.stoneWeightForView
          : 0,
        stonePriceDetails.preDiscountValue
          ? stonePriceDetails.preDiscountValue
          : 0,
        stonePriceDetails.weightUnitForView
      );
    }

    // Set Making Charge
    //   if (
    //     priceDetails?.makingChargeDetails?.makingChargePercentage ||
    //     priceDetails?.makingChargeDetails?.preDiscountValue
    //   ) {
    //     {
    //       priceDetailsObject.setMakingCharge(
    //         priceDetails.makingChargeDetails.makingChargePercentage
    //           ? priceDetails.makingChargeDetails.makingChargePercentage
    //           : 0,
    //         true,
    //         priceDetails.makingChargeDetails.preDiscountValue
    //           ? priceDetails.makingChargeDetails.preDiscountValue
    //           : 0,
    //         !!priceDetails.makingChargeDetails.isDynamicPricing
    //       );
    //     }
    //   }
    // }

    if (
      priceDetails?.makingChargeDetails?.makingChargePercentage ||
      priceDetails?.makingChargeDetails?.preDiscountValue
    ) {
      let value: number;
      let percentage: boolean;
      let makingChargeDetails: MakingChargesDetails;
      makingChargeDetails = {
        makingChargePerGram:
          priceDetails?.makingChargeDetails?.makingChargePgram,
        wastagePct: priceDetails?.makingChargeDetails?.wastagePct,
        makingChargePct: priceDetails?.makingChargeDetails?.makingChargePct,
        makingChargePunit: priceDetails?.makingChargeDetails?.makingChargePunit,
        makingChargePercentage:
          priceDetails?.makingChargeDetails?.makingChargePercentage
      };
      if (
        priceDetails?.makingChargeDetails?.makingChargePct === 0 &&
        priceDetails?.makingChargeDetails?.wastagePct === 0
      ) {
        value = priceDetails?.makingChargeDetails?.makingChargePgram
          ? priceDetails?.makingChargeDetails?.makingChargePgram
          : 0;
        percentage = false;
      } else {
        value = priceDetails?.makingChargeDetails?.makingChargePercentage
          ? priceDetails?.makingChargeDetails?.makingChargePercentage
          : 0;
        percentage = true;
      }

      {
        priceDetailsObject.setMakingCharge(
          value,
          percentage,
          priceDetails.makingChargeDetails.preDiscountValue
            ? priceDetails.makingChargeDetails.preDiscountValue
            : 0,
          !!priceDetails.makingChargeDetails.isDynamicPricing,
          makingChargeDetails
        );
      }
    }
  }

  // Set Hallmarking Charges
  if (priceDetails?.itemHallmarkDetails) {
    const itemHallmarkDetails = priceDetails.itemHallmarkDetails;
    priceDetailsObject.setItemHallmarkDetails(
      itemHallmarkDetails.hallmarkGstPct
        ? itemHallmarkDetails.hallmarkGstPct
        : 0,
      itemHallmarkDetails.hallmarkingCharges,
      itemHallmarkDetails.hmQuantity ? itemHallmarkDetails.hmQuantity : 0,
      itemHallmarkDetails.isFOCForHallmarkingCharges,
      itemHallmarkDetails.isHallmarked
    );
  }

  // Add Tax
  for (const tax of Object.keys(taxDetails)) {
    priceDetailsObject.addTax(
      taxDetails[tax].taxCode,
      taxDetails[tax].taxPercentage
    );
  }

  priceDetailsObject.setTotalDiscount(totalDiscount);

  priceDetailsObject.calculate();

  return priceDetailsObject;
}
