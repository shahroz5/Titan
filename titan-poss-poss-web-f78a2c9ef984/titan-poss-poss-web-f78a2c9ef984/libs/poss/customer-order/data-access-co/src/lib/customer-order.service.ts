import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getAdvanceBookingPriceUpdateEndPointUrl,
  getCustomerOrderEndPointUrl,
  getCustomerOrderPriceUpdateEndPointUrl
} from '@poss-web/shared/util-api-service';
import { CustomerOrderHelper } from '@poss-web/shared/util-adaptors';
import {
  CODetailsResponse,
  COMOrders,
  CreateCOResponse
} from '@poss-web/shared/models';
import { COAdaptor } from 'libs/shared/util-adaptors/src/lib/customer-order/co.adaptor';

@Injectable()
export class CustomerOrderService {
  constructor(private apiService: ApiService) {}

  fetchCO(locationCode: string, requestType: string): Observable<COMOrders[]> {
    const fetchCOUrl = getCustomerOrderEndPointUrl(
      null,
      null,
      null,
      null,
      locationCode,
      requestType
    );
    return this.apiService
      .get(fetchCOUrl.path, fetchCOUrl.params)
      .pipe(map((data: any) => CustomerOrderHelper.getCOMOrdersList(data)));
  }

  createCO(
    txnType: string,
    subTxnType: string,
    requestDetails: any
  ): Observable<CreateCOResponse> {
    const createCOUrl = getCustomerOrderEndPointUrl(txnType, subTxnType);
    return this.apiService
      .post(createCOUrl.path, requestDetails, createCOUrl.params)
      .pipe(map((data: any) => COAdaptor.createCOResponseFromJson(data)));
  }

  viewCO(
    txnType: string,
    subTxnType: string,
    id: string
  ): Observable<CODetailsResponse> {
    const viewCOUrl = getCustomerOrderEndPointUrl(txnType, subTxnType, id);
    return this.apiService
      .get(viewCOUrl.path, viewCOUrl.params)
      .pipe(map((data: any) => COAdaptor.CODetailsResponseFromJson(data)));
  }

  updateCO(
    txnType: string,
    subTxnType: string,
    id: string,
    status: string,
    requestDetails: any
  ): Observable<CODetailsResponse> {
    const updateCOUrl = getCustomerOrderEndPointUrl(
      txnType,
      subTxnType,
      id,
      status
    );
    return this.apiService
      .put(updateCOUrl.path, requestDetails, updateCOUrl.params)
      .pipe(map((data: any) => COAdaptor.CODetailsResponseFromJson(data)));
  }

  partialUpdateCO(
    txnType: string,
    subTxnType: string,
    id: string,
    requestDetails: any
  ): Observable<CODetailsResponse> {
    const partialUpdateCOUrl = getCustomerOrderEndPointUrl(
      txnType,
      subTxnType,
      id
    );
    return this.apiService
      .patch(partialUpdateCOUrl.path, requestDetails, partialUpdateCOUrl.params)
      .pipe(map((data: any) => COAdaptor.CODetailsResponseFromJson(data)));
  }

  deleteCO(txnType: string, subTxnType: string, id: string): Observable<any> {
    const deleteCOUrl = getCustomerOrderEndPointUrl(txnType, subTxnType, id);
    return this.apiService
      .delete(deleteCOUrl.path, deleteCOUrl.params)
      .pipe(map((data: any) => data));
  }

  updatePriceDetails(
    id: string,
    txnType: string,
    subTxnType: string,
    action?: string
  ): Observable<CODetailsResponse> {
    const updatePriceDetailsUrl = getCustomerOrderPriceUpdateEndPointUrl(
      id,
      txnType,
      subTxnType,
      action
    );
    return this.apiService
      .patch(updatePriceDetailsUrl.path, {}, updatePriceDetailsUrl.params)
      .pipe(map((data: any) => COAdaptor.CODetailsResponseFromJson(data)));
  }
}
