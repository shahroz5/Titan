
import { Injectable } from '@angular/core';
import {
  ApiService,
  getAllBinHistoryUrl
} from '@poss-web/shared/util-api-service';
import {
  InStockAdaptor,
  BinHistoryHelper
} from '@poss-web/shared/util-adaptors';

import { map } from 'rxjs/operators';
import {
  requestBinUrl,
  getAllBinCodesUrl
} from '@poss-web/shared/util-api-service';

import { Observable } from 'rxjs';

import { BinCodes, BinRequestDto,LoadBinHistoryResponse } from '@poss-web/shared/models';

@Injectable()
export class InStockService {
  getBinCodes(): Observable<BinCodes[]> {
    const url = getAllBinCodesUrl();

    return this.apiService
      .get(url)
      .pipe(map((data: any) => InStockAdaptor.BinCodesJson(data.results)));
  }

  getBinHistory(
    historyPayload: any,
    page: number,
    size: number
  ): Observable<LoadBinHistoryResponse> {
    const url = getAllBinHistoryUrl(page, size);

    return this.apiService
      .post(url.path, historyPayload, url.params)
      .pipe(map((data: any) => BinHistoryHelper.getItems(data)));
  }

  requestBin(requestBin: BinRequestDto): Observable<any> {
    const url = requestBinUrl();

    return this.apiService.post(url, requestBin).pipe(map((data: any) => data));
  }
  constructor(private apiService: ApiService) {}
}
