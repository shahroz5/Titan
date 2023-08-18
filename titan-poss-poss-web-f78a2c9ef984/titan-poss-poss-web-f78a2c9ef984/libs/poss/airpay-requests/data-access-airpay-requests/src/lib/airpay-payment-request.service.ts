import { Injectable } from '@angular/core';
import {
  LoadPaymentRequestPayload,
  PaymentRequestDetails,
  SearchCustomerPayload,
  CustomerPayload,
  GenerateCnPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

import {
  ApiService,
  getAirpayRequestsUrl,
  validateAirpayPaymentRequestsEndpointUrl,
  getCustomerSearchUrl,
  airpayGenerateCnEndpointUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import {
  AirpayPaymentsHelper,
  AirpayPaymentAdaptor
} from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class AirpayPaymentRequestService {
  constructor(private apiService: ApiService) {}

  searchCustomer(payload: SearchCustomerPayload): Observable<CustomerPayload> {
    const url = getCustomerSearchUrl(
      payload.searchType,
      payload.searchFieldValue
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => AirpayPaymentAdaptor.fromJson(data)));
  }

  getPaymentDetails(
    payload: LoadPaymentRequestPayload
  ): Observable<{ payments: PaymentRequestDetails[]; count: number }> {
    const url = getAirpayRequestsUrl(
      payload.page,
      payload.paymentCode,
      payload.size,
      payload.sort
    );
    return this.apiService
      .post(url.path, payload.payload, url.params)
      .pipe(
        map((data: any) => AirpayPaymentsHelper.getAirpayPaymentsDetails(data))
      );
  }
  validatePayment(paymentID: string) {
    const api = validateAirpayPaymentRequestsEndpointUrl(paymentID);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => AirpayPaymentAdaptor.paymentDetails(data)));
  }
  generateCN(payload: GenerateCnPayload) {
    const api = airpayGenerateCnEndpointUrl(payload);
    // return of({
    //   amount: 12,
    //   approvedBy: null,
    //   approvedDate: null,
    //   approvedReason: null,
    //   customerId: 770,
    //   id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
    //   locationCode: 'URB',
    //   otherDetails: {
    //     type: 'AIRPAY',
    //     data: {
    //       customerName: 'Ramya',
    //       customerTitle: 'Mrs',
    //       customerMobileNumber: '7760652162',
    //       referenceId: '378531',
    //       ulpId: '700001731533',
    //       creditNoteId: null,
    //       creditNoteDocNo: 900,
    //       creditNoteFiscalYear: null
    //     }
    //   },
    //   paymentCode: 'AIRPAY',
    //   referenceId: 'URB520',
    //   requestedBy: 'rso.urb.2',
    //   requestedDate: null,
    //   requestedReason: null,
    //   status: 'IN_PROGRESS',
    //   utilizedAmount: null,
    //   customerName: 'TEST CUSTOMER',
    //   customerMobileNo: '9887766550',
    //   customerTitle: 'MR.',
    //   isVerifying: false
    // });
    // }
    return this.apiService
      .patch(api.path, api.params)
      .pipe(map((data: any) => AirpayPaymentAdaptor.paymentDetails(data)));
  }
}
