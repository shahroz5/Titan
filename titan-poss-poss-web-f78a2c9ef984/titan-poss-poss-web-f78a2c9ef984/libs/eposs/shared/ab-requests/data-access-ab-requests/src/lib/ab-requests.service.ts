import {
  ABRequestsHelper
} from '@poss-web/shared/util-adaptors';

import { Injectable } from '@angular/core';
import {
  ApiService,
  getBillCancellationRequestUrl,
  putBillCancellationUrl,
} from '@poss-web/shared/util-api-service';
import * as actions from './+state/ab-requests.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ABRequests } from '@poss-web/shared/models';
@Injectable({
  providedIn: 'root'
})
export class AbRequestsService {
  constructor(private apiService: ApiService) {}
  getloadabRequest(
    data: actions.AbRequestsListPayload
  ): Observable<ABRequests> {
    const url = getBillCancellationRequestUrl(data);

    return this.apiService
      .post(url.path, data.body, url.params)
      .pipe(map(res => ABRequestsHelper.getBills(res)));
  }

  putab(data: actions.ApprovePayload): Observable<any> {
    const url = putBillCancellationUrl(data);

    return this.apiService
      .put(url.path, data.body, url.params)
      .pipe(map((res: any) => res));
  }

  // getloadabBulk(data: any): Observable<any> {
  //   const url = getBulkApproveUrl();

  //   return this.apiService
  //     .put(url, data)
  //     .pipe(map((data: any) => data.results));
  // }
}
