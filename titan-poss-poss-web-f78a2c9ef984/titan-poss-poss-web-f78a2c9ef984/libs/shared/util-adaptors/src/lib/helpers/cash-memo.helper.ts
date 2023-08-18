import { CashMemoAdaptor } from '../cash-memo/cash-memo.adaptor';
import {
  SearchProductList,
  CashMemoItemDetailsResponse,
  MetalRates,
  CoinDetails,
  AdvanceBookingDetailsResponse,
  ABSearchResponse,
  ABRequestStatusList,
  CashMemoItemDetails,
  RefundStatus,
  RefundStatusCount,
  CNDetailsResponsePayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class CashMemoHelper {
  static getSearchedProductList(data: any): SearchProductList[] {
    if (!data) {
      return null;
    }
    const searchProductList: SearchProductList[] = [];
    for (const product of data.results) {
      searchProductList.push(CashMemoAdaptor.searchProductFromJson(product));
    }
    return searchProductList;
  }

  static getTEPSearchedProductList(data: any): SearchProductList[] {
    if (!data) {
      return null;
    }
    const searchProductList: SearchProductList[] = [];
    for (const product of data.results) {
      searchProductList.push(CashMemoAdaptor.searchTEPProductFromJson(product));
    }
    return searchProductList;
  }

  static getCashMemoItemDetails(
    data: any,
    availableLotNumbers: any,
    productDetails?: any
  ): CashMemoItemDetailsResponse[] {
    if (!data) {
      return null;
    }
    const itemDetails: CashMemoItemDetailsResponse[] = [];
    for (const itemDetail of data) {
      itemDetails.push(
        CashMemoAdaptor.cashMemoItemDetailsResponseFromJson(
          itemDetail,
          availableLotNumbers,
          productDetails
        )
      );
    }

    return itemDetails;
  }

  static getViewCashMemoItemDetails(
    itemData: any,
    headerData: any,
    productDetails: any
  ): CashMemoItemDetailsResponse[] {
    if (!itemData) {
      return null;
    }
    const itemDetails: CashMemoItemDetailsResponse[] = [];
    for (const itemDetail of itemData) {
      itemDetails.push(
        CashMemoAdaptor.getCashMemoItemDetailsResponseFromJson(
          itemDetail,
          headerData,
          productDetails
        )
      );
    }

    return itemDetails;
  }

  static loadRequest(data: any): ABRequestStatusList {
    if (!data) {
      return null;
    }
    const details: ABRequestStatusList = {
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      response: data.resposne,
      results: data.results.map(item => ({
        ...item,
        requestedDate: moment(item.headerData.data.requestedDate)
      })),
      totalElements: data.totalElements,
      totalPages: data.totalPages
    };

    return details;
  }

  static loadRefundDeatils(data: any): RefundStatusCount {
    if (!data) {
      return null;
    }

    const refundList: RefundStatus[] = [];
    for (const refund of data.results) {
      const refundData: RefundStatus = {
        approvedData: refund.approvedData,
        headerData: refund.headerData,
        id: refund.id,
        docNo: refund.docNo,

        locationCode: refund.locationCode,
        refTxnId: refund.refTxnId,
        refundType: refund.refundType,
        status: refund.status
      };
      refundList.push(refundData);
    }

    return { refundList: refundList, totalElements: data.totalElements };
  }

  static getMetalRatesHistory(data: any): MetalRates[] {
    if (!data) {
      return null;
    }
    const metalRates: MetalRates[] = [];
    for (const metalRate of data) {
      metalRates.push(CashMemoAdaptor.getMetalRates(metalRate));
    }

    return metalRates;
  }

  static getCoinDetails(data: any): CoinDetails[] {
    if (!data) {
      return null;
    }
    const coinDetails: CoinDetails[] = [];
    for (const coinDetail of data.results) {
      coinDetails.push(CashMemoAdaptor.coinDetailsFromJson(coinDetail));
    }

    return coinDetails;
  }
  static getABDetails(dataList: any): ABSearchResponse {
    if (!dataList) {
      return null;
    }
    const ABDetails: AdvanceBookingDetailsResponse[] = [];

    for (const data of dataList.results) {
      ABDetails.push(CashMemoAdaptor.cashMemoDetailsResponseFromJson(data));
    }

    return { ABList: ABDetails, totalElements: dataList.totalElements };
  }

  static getCMItemDetails(data: any): CashMemoItemDetails[] {
    if (!data) {
      return null;
    }
    const itemDetails: CashMemoItemDetails[] = [];
    for (const itemDetail of data) {
      itemDetails.push(CashMemoAdaptor.cashMemoItemDetailsFromJson(itemDetail));
    }

    return itemDetails;
  }

  static getCnDetailsByCnTypeResponse(
    data: any
  ): CNDetailsResponsePayload[] {
    const cnDetailsResponse: CNDetailsResponsePayload[] = [];
    if (!data) {
      return null;
    }
    data.results?.forEach(response => {
      cnDetailsResponse.push(CashMemoAdaptor.getCnDetailResponse(response))
    });

    return cnDetailsResponse;
  }
}
