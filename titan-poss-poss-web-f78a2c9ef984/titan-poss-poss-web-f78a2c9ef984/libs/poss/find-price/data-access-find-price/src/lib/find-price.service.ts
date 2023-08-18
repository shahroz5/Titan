import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { 
  PriceRequest,
  ProductPriceDetails,
  CashMemoTaxDetails
} from '@poss-web/shared/models';
import {
  ApiService,
  getFindPriceEndPointUrl,
  getRegTaxDetailsEndPointUrl,
  getTaxDetailsEndPointUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import {
  CashMemoAdaptor,
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class FindPriceService {
  constructor(
    private apiService: ApiService
  ) { }

  getFindPrice(
    payload: PriceRequest
  ): Observable<ProductPriceDetails> {
    const priceDetailsUrl = getFindPriceEndPointUrl();
    return this.apiService
      .post(priceDetailsUrl, payload)
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.priceDetailsFromJson(data)
        )
      );
  }
  
  getTaxDetails(
    itemCode: string,
    txnType: string,
  ): Observable<CashMemoTaxDetails> {
    const getTaxDetailsUrl = getRegTaxDetailsEndPointUrl(
      itemCode,
      txnType
    );
    return this.apiService
      .get(getTaxDetailsUrl.path, getTaxDetailsUrl.params)
      .pipe(map((data: any) => CashMemoAdaptor.taxDetails(data)));
  }
}