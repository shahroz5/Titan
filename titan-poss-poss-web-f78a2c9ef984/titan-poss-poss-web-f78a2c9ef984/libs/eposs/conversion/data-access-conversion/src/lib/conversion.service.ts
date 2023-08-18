import { Injectable } from '@angular/core';
import {
  ConversionInventoryItem,
  ConversionItem,
  ConversionLoadItemsPayload,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionRequestsResponse,
  ConversionResponse,
  ConversionSplitItemPayload,
  ConversionSplitReqPayload,
  ConvertedTransactionHistory,
  HistoryItemsPayload,
  PriceRequest,
  PriceRequestPayload,
  ProductPriceDetails,
  RequestSentHistory
} from '@poss-web/shared/models';
import {
  ConversionAdaptor,
  ConversionHelper
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getConversionItemsEndpointUrl,
  getConversionPriceDetailsEndPointUrl,
  getConversionReqCountEndpointUrl,
  getConversionRequestDataByIdEnpointUrl,
  getConversionRequestEndpointUrl,
  getConversionRequestsByIdEndPointUrl,
  getConversionRequestsBySrcDocNoUrl,
  getConversionRequestsEndpointUrl,
  getConversionSearchItemsEndpointUrl,
  getConversionSplitItemEndpointUrl,
  getConvertedTransactionHistoryItemsUrl,
  getConvertedTransactionHistoryUrl,
  getRequestSentHistoryItemsUrl,
  getRequestSentHistoryUrl,
  getRsoDetailsEndpointUrl,
  getSelectedConvertedTransactionHistoryUrl,
  getSelectedRequestSentHistoryUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Injectable()
export class ConversionService {
  constructor(private apiService: ApiService) {}

  getSearchedItems(
    itemCode: string,
    studdedproductGroups: string[] = []
  ): Observable<ConversionInventoryItem[]> {
    const url = getConversionSearchItemsEndpointUrl(itemCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.inventoryItemFromJson(data, studdedproductGroups)
        )
      );
  }
  getRequests(
    pageIndex: number,
    pageSize: number
  ): Observable<ConversionRequests[]> {
    const url = getConversionRequestsEndpointUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ConversionAdaptor.requestsFromJson(data)));
  }

  getConversionRequests(
    pageIndex: number,
    pageSize: number
  ): Observable<ConversionRequestsResponse> {
    const url = getConversionRequestsEndpointUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => ConversionAdaptor.conversionRequestsWithCount(data))
      );
  }

  getCount(): Observable<number> {
    const url = getConversionReqCountEndpointUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getRequest(srcDocNo: any): Observable<ConversionRequests[]> {
    const url = getConversionRequestsBySrcDocNoUrl(srcDocNo);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ConversionAdaptor.requestsFromJson(data)));
  }

  getSelectedRequestDetails(id: number): Observable<ConversionRequests> {
    const url = getConversionRequestsByIdEndPointUrl(id);
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) => ConversionAdaptor.getSelectedRequestDetails(data))
      );
  }

  getSelectedRequestItems(
    id: any,
    studdedproductGroups: string[] = []
  ): Observable<ConversionRequestItems[]> {
    const url = getConversionRequestDataByIdEnpointUrl(id);
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.SelectedRequestDataFromJson(
            data.results,
            studdedproductGroups
          )
        )
      );
  }
  getConversionItems(
    loadItemsPayload: ConversionLoadItemsPayload,
    studdedproductGroups: string[] = []
  ): Observable<ConversionItem> {
    const url = getConversionItemsEndpointUrl(loadItemsPayload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.ItemsFromJson(data, studdedproductGroups)
        )
      );
  }

  sendConversionsRequest(
    conversionRequest: ConversionSplitReqPayload
  ): Observable<ConversionRequestResponse> {
    const url = getConversionRequestEndpointUrl();
    return this.apiService
      .post(url.path, conversionRequest, url.params)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.conversionRequestResponseFromJson(data)
        )
      );
  }

  conversionrequestConfirm(
    spiltItemPayload: ConversionSplitItemPayload
  ): Observable<ConversionResponse> {
    const url = getConversionSplitItemEndpointUrl();
    return this.apiService
      .post(url, spiltItemPayload)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.conversionResponseFromJson(
            data.stockTransactionDetails
          )
        )
      );
  }

  getRsoDetails() {
    const url = getRsoDetailsEndpointUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ConversionAdaptor.rsoDetailsFromJson(data)));
  }
  getRequestSentHistory(
    data: RequestSentHistory,
    pageIndex: number,
    pageSize: number,
    requestType: string
  ) {
    const url = getRequestSentHistoryUrl(pageIndex, pageSize, requestType);
    return this.apiService
      .post(url.path, data, url.params)
      .pipe(
        map((historyItems: any) =>
          ConversionAdaptor.requestSentHistory(historyItems)
        )
      );
  }
  getConvertedTransactionHistory(
    data: ConvertedTransactionHistory,
    pageIndex: number,
    pageSize: number,
    transactionType: string
  ) {
    const url = getConvertedTransactionHistoryUrl(
      pageIndex,
      pageSize,
      transactionType
    );
    return this.apiService
      .post(url.path, data, url.params)
      .pipe(
        map((historyItems: any) =>
          ConversionAdaptor.requestSentHistory(historyItems)
        )
      );
  }
  getSelectedRequestHistory(reqDocNo: number, requestType: string) {
    let url;
    if (requestType === 'requestSent') {
      url = getSelectedRequestSentHistoryUrl(reqDocNo);
    } else {
      url = getSelectedConvertedTransactionHistoryUrl(reqDocNo);
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => ConversionAdaptor.selectedRequestSentHistory(data))
      );
  }
  getConvesionHistoryItems(
    payload: HistoryItemsPayload,
    id: number,
    pageIndex: number,
    pageSize: number,
    requestType: string,
    prevTransaction: number,
    childItems = [],
    studdedproductGroups: string[] = []
  ) {
    let url;
    if (requestType === 'requestSent') {
      url = getRequestSentHistoryItemsUrl(id, pageIndex, pageSize);
      return this.apiService
        .post(url.path, payload, url.params)
        .pipe(
          map((data: any) =>
            ConversionAdaptor.conversionRequestHistoryTransactionItems(
              childItems,
              data.results[0],
              studdedproductGroups
            )
          )
        );
    } else {
      return this.apiService
        .post(
          getConvertedTransactionHistoryItemsUrl(id, pageIndex, pageSize).path,
          payload,
          getConvertedTransactionHistoryItemsUrl(id, pageIndex, pageSize).params
        )
        .pipe(map((childItems: any) => childItems))
        .pipe(
          concatMap(childItems =>
            this.apiService
              .post(
                getConvertedTransactionHistoryItemsUrl(
                  prevTransaction,
                  pageIndex,
                  pageSize
                ).path,
                payload,
                getConvertedTransactionHistoryItemsUrl(
                  prevTransaction,
                  pageIndex,
                  pageSize
                ).params
              )
              .pipe(
                map((parentItem: any) =>
                  ConversionAdaptor.conversionHistoryTransactionItems(
                    childItems,
                    parentItem.results[0],
                    studdedproductGroups
                  )
                )
              )
          )
        );
    }
  }

  loadPriceDetails(
    payload: PriceRequestPayload
  ): Observable<ProductPriceDetails[]> {
    const priceDetailsUrl = getConversionPriceDetailsEndPointUrl(
      payload.locationCode
    );
    const mock = [
      {
        itemCode: '500553VKAR1A02',
        lotNumber: null,
        productGroupCode: '72',
        productGroupDesc: 'Gold Studded',
        binCode: null,
        inventoryId: null,
        productDesc: 'Gold Studded',
        itemQuantity: 1,
        priceGroup: null,
        complexityCode: 'PNA',
        currencyCode: 'INR',
        productCategoryCode: 'V',
        stdWeight: 11.27,
        priceDetails: {
          netWeight: 11.7224,
          isUcp: false,
          metalPriceDetails: {
            preDiscountValue: 53949.53,
            metalPrices: [
              {
                weightUnit: 'gms',
                netWeight: 11.7224,
                metalValue: 53949.53,
                type: 'Gold',
                ratePerUnit: 4602.26,
                karat: 18.0,
                purity: 75.0,
                metalTypeCode: 'J',
                offset: 0.81818
              }
            ]
          },
          stonePriceDetails: {
            preDiscountValue: 97511.04,
            weightUnit: 'carat',
            stoneWeight: 0.648,
            numberOfStones: 24,
            weightUnitForView: 'gms',
            stoneWeightForView: 0.1296
          },
          makingChargeDetails: {
            preDiscountValue: 29422.33,
            isDynamic: true,
            makingChargePercentage: 49.97,
            makingChargePgram: null,
            wastagePct: null,
            makingChargePct: null
          },
          materialDetails: {
            preDiscountValue: null,
            weightUnit: null,
            materialWeight: 0
          },
          itemHallmarkDetails: null,
          printGuranteeCard: true,
          itemTypeCode: 'J',
          discountRecovered: null
        },
        finalValue: 180882.9,
        isGoldPriceMandatory: true,
        isSilverPriceMandatory: false,
        isPlatinumPriceMandatory: false,
        isStonePriceMandatory: true,
        isMakingChargeMandatory: true,
        itemTypeCode: 'J',
        pricingType: 'STUDDED',
        priceFactor: 1.0,
        makingChargeMarkupFactor: 1.2,
        makingChargeMarginDetails: {
          marginDetails: [{ fromPrice: 0.0, toPrice: 20000000.0, margin: 11.2 }]
        },
        marketUcpMarkupFactor: null,
        ignoreUcpRecalculate: null,
        checkInventory: false,
        isCOMPrice: false
      },
      {
        itemCode: '500553VKARAA02',
        lotNumber: null,
        productGroupCode: '72',
        productGroupDesc: 'Gold Studded',
        binCode: null,
        inventoryId: null,
        productDesc: 'Gold Studded',
        itemQuantity: 1,
        priceGroup: null,
        complexityCode: 'PNA',
        currencyCode: 'INR',
        productCategoryCode: 'V',
        stdWeight: 11.31,
        priceDetails: {
          netWeight: 11.7634,
          isUcp: false,
          metalPriceDetails: {
            preDiscountValue: 54138.23,
            metalPrices: [
              {
                weightUnit: 'gms',
                netWeight: 11.7634,
                metalValue: 54138.23,
                type: 'Gold',
                ratePerUnit: 4602.26,
                karat: 18.0,
                purity: 75.0,
                metalTypeCode: 'J',
                offset: 0.81818
              }
            ]
          },
          stonePriceDetails: {
            preDiscountValue: 97511.04,
            weightUnit: 'carat',
            stoneWeight: 0.648,
            numberOfStones: 24,
            weightUnitForView: 'gms',
            stoneWeightForView: 0.1296
          },
          makingChargeDetails: {
            preDiscountValue: 29458.99,
            isDynamic: true,
            makingChargePercentage: 50.03,
            makingChargePgram: null,
            wastagePct: null,
            makingChargePct: null
          },
          materialDetails: {
            preDiscountValue: null,
            weightUnit: null,
            materialWeight: 0
          },
          itemHallmarkDetails: null,
          printGuranteeCard: true,
          itemTypeCode: 'J',
          discountRecovered: null
        },
        finalValue: 181108.26,
        isGoldPriceMandatory: true,
        isSilverPriceMandatory: false,
        isPlatinumPriceMandatory: false,
        isStonePriceMandatory: true,
        isMakingChargeMandatory: true,
        itemTypeCode: 'J',
        pricingType: 'STUDDED',
        priceFactor: 1.0,
        makingChargeMarkupFactor: 1.2,
        makingChargeMarginDetails: {
          marginDetails: [{ fromPrice: 0.0, toPrice: 20000000.0, margin: 11.2 }]
        },
        marketUcpMarkupFactor: null,
        ignoreUcpRecalculate: null,
        checkInventory: false,
        isCOMPrice: false
      }
    ];
    return this.apiService
      .post(priceDetailsUrl.path, payload, priceDetailsUrl.params)
      .pipe(map((data: any) => ConversionHelper.getPriceDetails(data)));
  }
}
