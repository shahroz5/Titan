import * as moment from 'moment';

import {
  MarketDetails,
  MaterialPriceList,
  LocationDetails,
  MarketListing,
  LocationDetailsList
} from '@poss-web/shared/models';

export class MarketMaterialPriceAdaptor {
  static getMarketDetailsBasedOnMarketCode(
    data: any,
    selectedStock?: any,
    isAllSelected?: boolean,
    basePrice?: number
  ): MarketListing {
    const marketCodes: MarketDetails[] = [];
    let marketListing: MarketListing;
    if (isAllSelected) {
      for (const marketDetail of data.results) {
        marketCodes.push({
          marketCode: marketDetail.marketCode,
          materialCode: marketDetail.metalTypeCode,
          isChecked: true,
          computedPrice: (
            basePrice * marketDetail.markupFactor +
            marketDetail.addAmount -
            marketDetail.deductAmount
          )?.toFixed(0),
          addAmount: marketDetail.addAmount,
          deductAmount: marketDetail.deductAmount,
          description: marketDetail.description,
          markupFactor: marketDetail.markupFactor
        });
      }
    } else {
      if (selectedStock.length) {
        for (const marketItem of data.results) {
          marketCodes.push({
            materialCode: marketItem.metalTypeCode,
            marketCode: marketItem.marketCode,
            description: marketItem.description,
            markupFactor: marketItem.markupFactor,
            addAmount: marketItem.addAmount,
            deductAmount: marketItem.deductAmount,
            computedPrice: marketItem?.computedPrice?.toFixed(0),
            isChecked: marketItem.isChecked
          });
        }

        for (const marketItem of data.results) {
          for (const selectedItem of selectedStock) {
            if (selectedItem.id === marketItem.marketCode) {
              const index = marketCodes.findIndex(
                marketItems => marketItems.marketCode === selectedItem.id
              );

              marketCodes[index] = {
                materialCode: marketItem.metalTypeCode,
                marketCode: marketItem.marketCode,
                description: marketItem.description,
                markupFactor: marketItem.markupFactor,
                addAmount: marketItem.addAmount,
                deductAmount: marketItem.deductAmount,
                computedPrice: selectedItem?.computedPrice,
                isChecked: selectedItem.isChecked
              };
            }
          }
        }
      } else {
        for (const marketItem of data.results) {
          marketCodes.push({
            materialCode: marketItem.metalTypeCode,
            marketCode: marketItem.marketCode,
            description: marketItem.description,
            markupFactor: marketItem.markupFactor,
            addAmount: marketItem.addAmount,
            deductAmount: marketItem.deductAmount,
            computedPrice: marketItem?.computedPrice?.toFixed(0),
            isChecked: marketItem.isChecked
          });
        }
      }
    }

    marketListing = {
      marketDetails: marketCodes,
      totalCount: data.totalElements
    };

    return marketListing;
  }

  static getMetalPriceDetailsData(data: any) {
    const materialPriceList: MaterialPriceList[] = [];
    for (const priceDetails of data.results) {
      materialPriceList.push({
        priceType: priceDetails.priceType,
        price: priceDetails.basePrice,
        time: moment(priceDetails.createdDate).format('HH:mm A'),
        remarks: priceDetails.remarks,
        id: priceDetails.id,
        createdDate: moment(priceDetails.createdDate).format('DD/MM/YYYY')
      });
    }

    const materialPriceListDetail = {
      materialPriceList: materialPriceList,
      totalCount: data.totalElements
    };
    return materialPriceListDetail;
  }

  static getSavedBasePrice(data: any) {
    const locationDetailsArray: LocationDetails[] = [];
    let locationDetailsList: LocationDetailsList;
    for (const locationDetails of data.results) {
      locationDetailsArray.push({
        locationCode: locationDetails.locationCode,
        locationDescription: locationDetails.locationDescription,
        marketCode: locationDetails.marketCode,
        marketDescription: locationDetails.marketDescription,
        time: moment(locationDetails.applicableDate).format('HH:mm A'),
        materialPrice: locationDetails.metalRate
      });
    }
    locationDetailsList = {
      locationDetails: locationDetailsArray,
      totalCount: data.totalElements
    };
    return locationDetailsList;
  }
}
