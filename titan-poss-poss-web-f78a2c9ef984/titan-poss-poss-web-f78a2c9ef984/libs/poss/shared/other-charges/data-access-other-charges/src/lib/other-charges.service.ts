import { Injectable } from '@angular/core';
import { CashMemoDetailsResponse, CashMemoTaxDetails } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import {
  ApiService,
  getCashMemoEndPointUrl,
  getTaxDetailsEndPointUrl
} from '@poss-web/shared/util-api-service';
import { CashMemoAdaptor } from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OtherChargesService {
  constructor(private apiService: ApiService) {}
  partialUpdateCashMemo(
    id: string,
    requestDetails: string,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoDetailsResponse> {
    const partialUpdateCashMemoUrl = getCashMemoEndPointUrl(
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

  getTaxDetails(
    customerId: number,
    itemCode: string,
    txnType: string
  ): Observable<CashMemoTaxDetails> {
    const getTaxDetailsUrl = getTaxDetailsEndPointUrl(
      customerId,
      itemCode,
      txnType
    );
    return this.apiService
      .get(getTaxDetailsUrl.path, getTaxDetailsUrl.params)
      .pipe(map((data: any) => CashMemoAdaptor.taxDetails(data)));
  }
}
