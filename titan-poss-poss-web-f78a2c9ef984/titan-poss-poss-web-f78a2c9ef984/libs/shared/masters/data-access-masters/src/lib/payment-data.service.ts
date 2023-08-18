import { Injectable } from '@angular/core';
import {
  getCreditNoteListUrl,
  getMasterListOfPaymentMode,
  getMasterListOfPaymentTransactionTypes
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
import { map } from 'rxjs/operators';
import { PaymentCodeList, TransactionTypes } from '@poss-web/shared/models';
@Injectable({
  providedIn: 'root'
})
export class PaymentDataService {
  constructor(private apiService: CacheableApiService) {}

  getPaymentModes(
    paymentCode?: string,
    isPageable?: boolean
  ): Observable<PaymentCodeList[]> {
    const url = getMasterListOfPaymentMode(
      paymentCode,

      isPageable
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.results));
  }

  getPaymentTransactionTypes(
    transactionType?: string,
    isPageable?: boolean,
    isTrue?: boolean,
    searchType?: string
  ): Observable<TransactionTypes[]> {
    const url = getMasterListOfPaymentTransactionTypes(
      transactionType,
      isPageable,
      isTrue,
      searchType
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.results));
  }

  getCreditNoteList(): Observable<any> {
    const url = getCreditNoteListUrl();
    return this.apiService.get(url).pipe(map((data: any) => data));
  }
}
