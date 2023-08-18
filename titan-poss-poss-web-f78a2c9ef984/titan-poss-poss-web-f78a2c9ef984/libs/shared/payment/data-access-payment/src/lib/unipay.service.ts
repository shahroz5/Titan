import {
  OtherDetailsForUnipay,
  PaymentDetails,
  UniPayRequest,
  UpdateUnipayPaylaod
} from '@poss-web/shared/models';
import { Injectable } from '@angular/core';
import {
  ApiService,
  ExternalApiService,
  getEditPaymentEndpointUrl,
  getUnipayEndpointUrl,
  getVoidUnipayEndpointUrl,
  verifyHostNameEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentHelper, PaymentAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class UnipayService {
  constructor(
    private apiService: ApiService,
    private externalApiService: ExternalApiService
  ) {}

  startUnipayPayment(
    request: UniPayRequest
  ): Observable<OtherDetailsForUnipay> {
    const api = getUnipayEndpointUrl(request);

    // const testdata = {
    //   Request_Input: '0,0,100,123',
    //   ResponseCode: 0,
    //   ResponseMessage: 'payment Successfull',

    //   ApprovalCode: '005644',
    //   RRN_No: '156517182400',
    //   Amount: '123',
    //   Card_Num: '428090xxxxxx1087',
    //   Card_Type: 'VISA PIN@POS',
    //   CardHolder_Name: 'SUNIL KUMAR              /',
    //   Acquirer_Bank: 'SBI',
    //   Txn_Date: '2022-11-21T12:00:00.0Z',
    //   Txn_Type: 'SALE',
    //   BankInvoice_Num: '000003',
    //   Batch_Number: '000002',
    //   Terminal_Id: '22114455',
    //   Merchant_Id: '445566GHJKL3258',
    //   utid: 'V0003709',
    //   errorMsg: null,
    //   errorCode: null
    // };

    return this.externalApiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentAdaptor.getUnipayResponse(data)));

    // return of(PaymentAdaptor.getUnipayResponse(testdata));
  }

  updateUniPayment(payload: UpdateUnipayPaylaod): Observable<PaymentDetails> {
    const api = getEditPaymentEndpointUrl(
      payload.transactionType,
      payload.subTransactionType,
      payload.transactionId,
      payload.status
    );
    return this.apiService
      .patch(api.path, payload.updateUnipayPlayload, api.params)
      .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
  }

  getUnipayConfiguration(): Observable<string[]> {
    const api = verifyHostNameEndpointUrl();
    return this.apiService.get(api).pipe(map((data: any) => data.results));
    // PaymentAdaptor.getHostConfiguration(data)));
  }

  voidUnipayPayment(request: UniPayRequest): Observable<OtherDetailsForUnipay> {
    const api = getVoidUnipayEndpointUrl(request);

    // const testdata = {
    //   Request_Input: '0,0,100,123',
    //   ResponseCode: 0,
    //   ResponseMessage: 'payment Successfull',

    //   ApprovalCode: '005644',
    //   RRN_No: '156517182400',
    //   Amount: '123',
    //   Card_Num: '428090xxxxxx1087',
    //   Card_Type: 'VISA PIN@POS',
    //   CardHolder_Name: 'SUNIL KUMAR              /',
    //   Acquirer_Bank: 'SBI',
    //   Txn_Date: '2019-08-07T15:27:03.0Z',
    //   Txn_Type: 'SALE',
    //   BankInvoice_Num: '000003',
    //   Batch_Number: '000002',
    //   Terminal_Id: '22114455',
    //   Merchant_Id: '445566GHJKL3258',
    //   errorMsg: null,
    //   errorCode: null
    // };

    return this.externalApiService
      .get(api.path, api.params)
      .pipe(
        map((data: any) =>
          PaymentAdaptor.getUnipayResponse(data, request.txnId)
        )
      );

    // return of(PaymentAdaptor.getUnipayResponse(testdata));
  }
}
