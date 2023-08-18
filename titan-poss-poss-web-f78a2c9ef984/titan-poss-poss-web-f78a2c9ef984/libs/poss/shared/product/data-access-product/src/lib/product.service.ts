import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';

import {
  ApiService,
  getSearchProductEndPointUrl,
  getProductDetailsEndPointUrl,
  getPriceDetailsEndPointUrl,
  getValidateProductDetailsEndPointUrl,
  getTaxDetailsEndPointUrl,
  getCashMemoItemEndPointUrl,
  getCoinDetailsEndPointUrl,
  getAdvanceBoookingItemEndPointUrl,
  getTEPSearchProductEndPointUrl,
  getAdvanceBoookingCMItemEndPointUrl,
  getItemLevelDiscountsEndPointUrl,
  getCashMemoEndPointUrl,
  getAdvanceBookingEndPointUrl,
  getCnRequestListByCnTypeUrl,
  getReserveBinPriceDetailsEndPointUrl,
  getCashMemoRsoEndPointUrl,
  getCustomerOrderItemEndPointUrl,
  getCustomerOrderEndPointUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import {
  CashMemoHelper,
  CashMemoAdaptor,
  DiscountHelper,
  CustomerOrderHelper
} from '@poss-web/shared/util-adaptors';
import {
  SearchProductList,
  ProductDetails,
  CashMemoItemDetailsRequest,
  AvailableLotNumber,
  OrderPriceRequest,
  ProductPriceDetails,
  CashMemoTaxDetails,
  CashMemoDetailsResponse,
  CashMemoItemDetailsResponse,
  CoinDetails,
  TransactionTypeEnum,
  CNDetailsRequestPayload,
  CNDetailsResponsePayload,
  COItemDetailsResponse,
  COItemDetailsRequest,
  CODetailsResponse
} from '@poss-web/shared/models';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';

const reserveBinCode = 'RESERVEBIN';
@Injectable()
export class ProductService {
  constructor(
    private apiService: ApiService,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string
  ) {}

  getSearchProductList(
    searchValue: string,
    transactionType?: string
  ): Observable<SearchProductList[]> {
    if (transactionType === 'TEP') {
      const tepSearchProductUrl = getTEPSearchProductEndPointUrl();
      return this.apiService
        .post(
          tepSearchProductUrl.path,
          { itemCode: searchValue },
          tepSearchProductUrl.params
        )
        .pipe(
          map((data: any) => CashMemoHelper.getTEPSearchedProductList(data))
        );
    } else {
      const searchProductUrl = getSearchProductEndPointUrl(searchValue);
      return this.apiService
        .get(searchProductUrl.path, searchProductUrl.params)
        .pipe(map((data: any) => CashMemoHelper.getSearchedProductList(data)));
    }
  }

  getProductDetails(
    itemCode: string,
    lotNumber: string
  ): Observable<ProductDetails[]> {
    const productDetailsUrl = getProductDetailsEndPointUrl(itemCode, lotNumber);
    return this.apiService
      .get(productDetailsUrl.path, productDetailsUrl.params)
      .pipe(map((data: any) => CashMemoAdaptor.getProductDetails(data)));
  }

  validateProductAndPriceDetails(
    inventoryId: string,
    orderPriceRequest: OrderPriceRequest,
    productDetails: ProductDetails,
    availableLotNumbers: AvailableLotNumber[],
    txnDetails: {
      id: string;
      txnType: string;
      subTxnType: string;
    },
    isABInvoked: boolean
  ): Observable<ProductPriceDetails> {
    const validateProductUrl = getValidateProductDetailsEndPointUrl(
      inventoryId,
      null
    );
    return this.apiService
      .get(validateProductUrl.path, validateProductUrl.params)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(validate => {
          if (
            validate.binGroupCode === reserveBinCode &&
            txnDetails.txnType === TransactionTypeEnum.CM &&
            isABInvoked
          ) {
            return this.apiService
              .post(
                getReserveBinPriceDetailsEndPointUrl(txnDetails).path,
                orderPriceRequest,
                getReserveBinPriceDetailsEndPointUrl(txnDetails).params
              )
              .pipe(
                map((data: ProductPriceDetails) =>
                  CashMemoAdaptor.priceDetailsFromJson(
                    data,
                    productDetails,
                    availableLotNumbers
                  )
                )
              );
          } else {
            return this.apiService
              .post(getPriceDetailsEndPointUrl(), orderPriceRequest)
              .pipe(
                map((data: ProductPriceDetails) =>
                  CashMemoAdaptor.priceDetailsFromJson(
                    data,
                    productDetails,
                    availableLotNumbers
                  )
                )
              );
          }
        })
      );
  }

  getTaxDetails(
    customerId: number,
    itemCode: string,
    txnType: string,
    isIGST?: boolean
  ): Observable<CashMemoTaxDetails> {
    const getTaxDetailsUrl = getTaxDetailsEndPointUrl(
      customerId,
      itemCode,
      txnType,
      null,
      null,
      isIGST
    );
    return this.apiService
      .get(getTaxDetailsUrl.path, getTaxDetailsUrl.params)
      .pipe(map((data: any) => CashMemoAdaptor.taxDetails(data)));
  }

  addItemToCashMemo(
    id: string,
    itemDetails: CashMemoItemDetailsRequest,
    availableLotNumbers: AvailableLotNumber[],
    productDetails: ProductDetails,
    txnType: string,
    subTxnType: string,
    isIGST?: boolean
  ): Observable<CashMemoItemDetailsResponse[]> {
    const addItemToCashMemoUrl =
      txnType === TransactionTypeEnum.AB
        ? getAdvanceBoookingItemEndPointUrl(id, txnType, subTxnType)
        : getCashMemoItemEndPointUrl(
            id,
            txnType,
            subTxnType,
            null,
            null,
            isIGST
          );
    return this.apiService
      .post(addItemToCashMemoUrl.path, itemDetails, addItemToCashMemoUrl.params)
      .pipe(
        map((data: any) =>
          CashMemoHelper.getCashMemoItemDetails(
            [data],
            availableLotNumbers,
            productDetails
          )
        )
      );
  }

  getItemFromCashMemo(
    id: string,
    itemId: string,
    headerData: CashMemoDetailsResponse,
    txnType: string,
    subTxnType: string,
    loadHeaderInfo?: boolean
  ): Observable<any> {
    const getItemFromCashMemoUrl =
      txnType === TransactionTypeEnum.AB
        ? getAdvanceBoookingItemEndPointUrl(id, txnType, subTxnType, itemId)
        : getCashMemoItemEndPointUrl(id, txnType, subTxnType, itemId);
    const viewCashMemoUrl =
      txnType === TransactionTypeEnum.AB
        ? getAdvanceBookingEndPointUrl(txnType, subTxnType, id)
        : getCashMemoEndPointUrl(txnType, subTxnType, id);

    const a = this.apiService
      .get(getItemFromCashMemoUrl.path, getItemFromCashMemoUrl.params)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(itemData => {
          if (loadHeaderInfo) {
            return this.apiService
              .get(viewCashMemoUrl.path, viewCashMemoUrl.params)
              .pipe(map((headerDataResponse: any) => headerDataResponse))
              .pipe(
                concatMap(totalData =>
                  this.getItemDetails(
                    itemData,
                    CashMemoAdaptor.cashMemoDetailsResponseFromJson(totalData)
                  )
                )
              );
          } else {
            return this.getItemDetails(itemData, headerData);
          }
        })
      );

    const url = getItemLevelDiscountsEndPointUrl(
      txnType,
      subTxnType,
      id,
      itemId
    );
    const b = this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));

    return combineLatest([
      a.pipe(map(data => data)),
      b.pipe(map(data => data))
    ]).pipe(
      map(([data1, data2]) => CashMemoAdaptor.getDiscDetails(data1, data2))
    );
  }

  getItemDetails(itemData, headerDataResponse) {
    if (itemData.productGroupCode === this.coinCode) {
      return this.apiService
        .get(getCoinDetailsEndPointUrl(itemData.itemCode, true))
        .pipe(
          map((data: any) =>
            CashMemoHelper.getViewCashMemoItemDetails(
              [itemData],
              headerDataResponse,
              data
            )
          )
        );
    } else {
      return this.apiService
        .get(getProductDetailsEndPointUrl(itemData.itemCode).path)
        .pipe(
          map((data: any) =>
            CashMemoHelper.getViewCashMemoItemDetails(
              [itemData],
              headerDataResponse,
              data
            )
          )
        );
    }
  }

  partialUpdateItemInCashMemo(
    id: string,
    itemDetails: CashMemoItemDetailsRequest,
    itemId: string,
    availableLotNumbers: AvailableLotNumber[],
    productDetails: ProductDetails,
    txnType: string,
    subTxnType: string,
    isIGST?: boolean
  ): Observable<CashMemoItemDetailsResponse[]> {
    const partialUpdateItemInCashMemoUrl =
      txnType === TransactionTypeEnum.AB
        ? getAdvanceBoookingItemEndPointUrl(id, txnType, subTxnType, itemId)
        : getCashMemoItemEndPointUrl(
            id,
            txnType,
            subTxnType,
            itemId,
            null,
            isIGST
          );
    const a = this.apiService
      .patch(
        partialUpdateItemInCashMemoUrl.path,
        itemDetails,
        partialUpdateItemInCashMemoUrl.params
      )
      .pipe(
        map((data: any) =>
          CashMemoHelper.getCashMemoItemDetails(
            [data],
            availableLotNumbers,
            productDetails
          )
        )
      );

    const url = getItemLevelDiscountsEndPointUrl(
      txnType,
      subTxnType,
      id,
      itemId
    );
    const b = this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));

    return combineLatest([
      a.pipe(map(data => data)),
      b.pipe(map(data => data))
    ]).pipe(
      map(([data1, data2]) => CashMemoAdaptor.getDiscDetails(data1, data2))
    );
  }

  updateItemInCashMemo(
    id: string,
    itemDetails: CashMemoItemDetailsRequest,
    itemId: string,
    availableLotNumbers: AvailableLotNumber[],
    productDetails: ProductDetails,
    txnType: string,
    subTxnType: string,
    removeFromOrder?: boolean,
    isIGST?: boolean
  ): Observable<CashMemoItemDetailsResponse[]> {
    const updateItemInCashMemoUrl =
      txnType === TransactionTypeEnum.AB
        ? getAdvanceBoookingItemEndPointUrl(id, txnType, subTxnType, itemId)
        : getCashMemoItemEndPointUrl(
            id,
            txnType,
            subTxnType,
            itemId,
            removeFromOrder,
            isIGST
          );

    const a = this.apiService
      .put(
        updateItemInCashMemoUrl.path,
        itemDetails,
        updateItemInCashMemoUrl.params
      )
      .pipe(
        map((data: any) =>
          CashMemoHelper.getCashMemoItemDetails(
            [data],
            availableLotNumbers,
            productDetails
          )
        )
      );

    const url = getItemLevelDiscountsEndPointUrl(
      txnType,
      subTxnType,
      id,
      itemId
    );
    const b = this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));

    return combineLatest([
      a.pipe(map(data => data)),
      b.pipe(map(data => data))
    ]).pipe(
      map(([data1, data2]) => CashMemoAdaptor.getDiscDetails(data1, data2))
    );
  }

  deleteItemFromCashMemo(
    id: string,
    itemId: string,
    txnType: string,
    subTxnType: string,
    removeFromOrder?: any
  ): Observable<CashMemoItemDetailsResponse> {
    let deleteItemFromCashMemoUrl;
    if (txnType === TransactionTypeEnum.AB) {
      deleteItemFromCashMemoUrl = getAdvanceBoookingItemEndPointUrl(
        id,
        txnType,
        subTxnType,
        itemId
      );
    } else {
      deleteItemFromCashMemoUrl = getCashMemoItemEndPointUrl(
        id,
        txnType,
        subTxnType,
        itemId,
        removeFromOrder
      );
    }
    return this.apiService
      .delete(deleteItemFromCashMemoUrl.path, deleteItemFromCashMemoUrl.params)
      .pipe(map((data: any) => data));
  }

  deleteItemDetails(
    id: string,
    itemId: string,
    txnType: string,
    subTxnType: string,
    cashMemoId: string
  ): Observable<CashMemoItemDetailsResponse> {
    const deleteItemFromCashMemoUrl = getAdvanceBoookingCMItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId,
      cashMemoId
    );

    return this.apiService
      .delete(deleteItemFromCashMemoUrl.path, deleteItemFromCashMemoUrl.params)
      .pipe(map((data: any) => data));
  }

  getCoinDetails(
    itemCode: string,
    withSaleableCheck: boolean
  ): Observable<CoinDetails[]> {
    const coinDetailsUrl = getCoinDetailsEndPointUrl(
      itemCode,
      withSaleableCheck
    );
    return this.apiService
      .get(coinDetailsUrl)
      .pipe(map((data: any) => CashMemoHelper.getCoinDetails(data)));
  }

  getPriceDetails(priceData): Observable<ProductPriceDetails> {
    const priceDetailsUrl = getPriceDetailsEndPointUrl();
    const validateProductUrl = getValidateProductDetailsEndPointUrl(
      null,
      priceData.orderPriceRequest.itemCode
    );
    return this.apiService
      .get(validateProductUrl.path, validateProductUrl.params)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(validate =>
          this.apiService
            .post(priceDetailsUrl, priceData.orderPriceRequest)
            .pipe(
              map((data: any) =>
                CashMemoAdaptor.priceDetailsFromJson(
                  data,
                  priceData.productDetails
                )
              )
            )
        )
      );
  }

  getCndetailsByCnType(
    payload: CNDetailsRequestPayload
  ): Observable<CNDetailsResponsePayload[]> {
    const cnDetailsUrl = getCnRequestListByCnTypeUrl(
      payload.customerId,
      payload.cnType,
      payload.isFrozenRateCnRequired,
      payload.isPageable
    );
    return this.apiService
      .get(cnDetailsUrl.path, cnDetailsUrl.params)
      .pipe(
        map((data: any) => CashMemoHelper.getCnDetailsByCnTypeResponse(data))
      );
  }

  partialUpdateCashMemo(
    id: string,
    requestDetails: string,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoDetailsResponse> {
    const partialUpdateCashMemoUrl = getCashMemoRsoEndPointUrl(
      txnType,
      subTxnType,
      id
    );
    return this.apiService
      .patch(
        partialUpdateCashMemoUrl.path,
        requestDetails,
        partialUpdateCashMemoUrl.params
      )
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  // CO

  addItemToCO(
    id: string,
    txnType: string,
    subTxnType: string,
    itemDetails: COItemDetailsRequest
  ): Observable<COItemDetailsResponse[]> {
    const addItemToCustomerOrderUrl = getCustomerOrderItemEndPointUrl(
      id,
      txnType,
      subTxnType
    );
    return this.apiService
      .post(
        addItemToCustomerOrderUrl.path,
        itemDetails,
        addItemToCustomerOrderUrl.params
      )
      .pipe(map((data: any) => CustomerOrderHelper.getCOItemDetails([data])));
  }

  getItemFromCO(
    id: string,
    txnType: string,
    subTxnType: string,
    itemId: string,
    headerData: CODetailsResponse,
    loadHeaderInfo?: boolean
  ): Observable<COItemDetailsResponse[]> {
    const getItemFromCustomerOrderUrl = getCustomerOrderItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId
    );
    const viewCustomerOrderUrl = getCustomerOrderEndPointUrl(
      txnType,
      subTxnType,
      id
    );
    let a;
    if (loadHeaderInfo) {
      a = this.apiService
        .get(
          getItemFromCustomerOrderUrl.path,
          getItemFromCustomerOrderUrl.params
        )
        .pipe(map((data: any) => data))
        .pipe(
          concatMap(itemData => {
            return this.apiService
              .get(viewCustomerOrderUrl.path, viewCustomerOrderUrl.params)
              .pipe(
                map((headerDataResponse: any) =>
                  CustomerOrderHelper.getViewCOItemDetails(
                    [itemData],
                    headerDataResponse
                  )
                )
              );
          })
        );
    } else {
      a = this.apiService
        .get(
          getItemFromCustomerOrderUrl.path,
          getItemFromCustomerOrderUrl.params
        )
        .pipe(
          map((data: any) =>
            CustomerOrderHelper.getViewCOItemDetails([data], headerData)
          )
        );
    }

    const url = getItemLevelDiscountsEndPointUrl(
      txnType,
      subTxnType,
      id,
      itemId
    );
    const b = this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));

    console.log('a', a);
    return combineLatest([
      a.pipe(map(data => data)),
      b.pipe(map(data => data))
    ]).pipe(
      map(([data1, data2]) => CashMemoAdaptor.getDiscDetails(data1, data2))
    );
  }

  partialUpdateItemInCO(
    id: string,
    txnType: string,
    subTxnType: string,
    itemId: string,
    itemDetails: COItemDetailsRequest
  ): Observable<COItemDetailsResponse[]> {
    const partialUpdateItemInCustomerOrderUrl = getCustomerOrderItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId
    );
    const item = this.apiService
      .patch(
        partialUpdateItemInCustomerOrderUrl.path,
        itemDetails,
        partialUpdateItemInCustomerOrderUrl.params
      )
      .pipe(map((data: any) => CustomerOrderHelper.getCOItemDetails([data])));

    const url = getItemLevelDiscountsEndPointUrl(
      txnType,
      subTxnType,
      id,
      itemId
    );
    const disc = this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));

    return combineLatest([
      item.pipe(map(data => data)),
      disc.pipe(map(data => data))
    ]).pipe(
      map(([data1, data2]) => CashMemoAdaptor.getDiscDetails(data1, data2))
    );
  }

  updateItemInCO(
    id: string,
    txnType: string,
    subTxnType: string,
    itemId: string,
    itemDetails: COItemDetailsRequest
  ): Observable<COItemDetailsResponse[]> {
    const updateItemInCustomerOrderUrl = getCustomerOrderItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId
    );

    const item = this.apiService
      .put(
        updateItemInCustomerOrderUrl.path,
        itemDetails,
        updateItemInCustomerOrderUrl.params
      )
      .pipe(map((data: any) => CustomerOrderHelper.getCOItemDetails([data])));

    const url = getItemLevelDiscountsEndPointUrl(
      txnType,
      subTxnType,
      id,
      itemId
    );
    const disc = this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));

    return combineLatest([
      item.pipe(map(data => data)),
      disc.pipe(map(data => data))
    ]).pipe(
      map(([data1, data2]) => CashMemoAdaptor.getDiscDetails(data1, data2))
    );
  }

  deleteItemFromCO(
    id: string,
    txnType: string,
    subTxnType: string,
    itemId: string
  ): Observable<COItemDetailsResponse> {
    const deleteItemFromCustomerOrderUrl = getCustomerOrderItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId
    );
    return this.apiService
      .delete(
        deleteItemFromCustomerOrderUrl.path,
        deleteItemFromCustomerOrderUrl.params
      )
      .pipe(map((data: any) => data));
  }
}
