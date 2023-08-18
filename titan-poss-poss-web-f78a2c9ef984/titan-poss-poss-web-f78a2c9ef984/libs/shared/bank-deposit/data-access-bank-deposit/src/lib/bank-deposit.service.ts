import {
  ApiService,
  getBankDepositDateUrl,
  getBankDepositUrl
} from '@poss-web/shared/util-api-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RevenueHelper } from '@poss-web/shared/util-adaptors';
import { BankDepositResponse, PaginatePayload, DepositDateResponse, DepositDatePayload } from '@poss-web/shared/models';

@Injectable()
export class BankDepositService {
  constructor(private apiService: ApiService) {}

  loadBankDeposit(
    payload: PaginatePayload,
    requestData
  ): Observable<BankDepositResponse> {
    const url = getBankDepositUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .post(url.path, requestData, url.params)
      .pipe(map(data => RevenueHelper.getBankDeposit(data)));
  }

  getTransactionDetails(depositDate: DepositDatePayload) {
    const url = getBankDepositDateUrl();
    return this.apiService
      .post(url.path, depositDate, url.params)
      .pipe(map((data: any) => RevenueHelper.getTransactionIds(data)));
  }
}
