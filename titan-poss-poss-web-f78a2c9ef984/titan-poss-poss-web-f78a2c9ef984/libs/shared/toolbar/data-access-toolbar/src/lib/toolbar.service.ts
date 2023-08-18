import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getTransactionListUrl,
  getTransactionListCountUrl,
  getMetalPriceUrl
} from '@poss-web/shared/util-api-service';
import { ToolbarHelper } from '@poss-web/shared/util-adaptors';
import {
  TransactionCount,
  TransactionDetails,
  TransactionListPayload
} from '@poss-web/shared/models';

@Injectable()
export class ToolbarService {
  constructor(private apiService: ApiService) {}

  getMaterialPriceDetails() {
    const url = getMetalPriceUrl();
    //this.apiService.getWithoutPossBaseUrl('http://localhost:3002/metalPrice')
    return this.apiService
      .get(url)
      .pipe(map(data => ToolbarHelper.getMetalPriceData(data)));
  }

  loadTransactionList(
    searchValue: any,
    status: string,
    txnType: string,
    subTxnType: string,
    pageIndex: number,
    pageSize: number,
    searchData: TransactionListPayload
  ): Observable<TransactionDetails[]> {
    const loadTransactionListUrl = getTransactionListUrl(
      searchValue,
      status,
      txnType,
      subTxnType,
      pageIndex,
      pageSize,
      searchData
    );

    return this.apiService
      .get(loadTransactionListUrl.path, loadTransactionListUrl.params)
      .pipe(map((data: any) => ToolbarHelper.getTransactionDetails(data)));
  }

  loadTransactionListCount(
    status: string,
    txnType: string,
    subTxnType: string
  ): Observable<TransactionCount[]> {
    const loadTransactionListCountUrl = getTransactionListCountUrl(
      status,
      txnType,
      subTxnType
    );

    return this.apiService
      .get(loadTransactionListCountUrl.path, loadTransactionListCountUrl.params)
      .pipe(map((data: any) => ToolbarHelper.getTransactionCount(data)));
  }
}
