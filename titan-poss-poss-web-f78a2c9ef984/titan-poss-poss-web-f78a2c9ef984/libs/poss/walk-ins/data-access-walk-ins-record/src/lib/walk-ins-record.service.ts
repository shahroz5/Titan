import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  getWalkInDetailsCustomerVisitsCountEndpointUrl,
  saveWalkInDetailsEndpointUrl,
  walkInsHistoryDataApiUrl
} from '@poss-web/shared/util-api-service';
import {
  WalkInsDetails,
  SaveWalkInDetailsRequestPayload,
  WalkInsCustomerVisitDetails,
  WalkInsDetailsHistoryResponse,
  WalkInsCountRequestPayload
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { WalkInsAdaptor } from '@poss-web/shared/util-adaptors';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';

@Injectable({
  providedIn: 'root'
})
export class WalkInsRecordService {
  constructor(
    private apiService: ApiService,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {}

  loadWalkInsHistoryData(): Observable<WalkInsDetailsHistoryResponse[]> {
    const walkInsHistoryApiUrl = walkInsHistoryDataApiUrl();

    return this.apiService
      .get(walkInsHistoryApiUrl)
      .pipe(
        map(data => WalkInsAdaptor.getWalkInsHistoryData(data, this.dateFormat))
      );
  }

  saveWalkInsDetails(
    requestPayload: SaveWalkInDetailsRequestPayload
  ): Observable<WalkInsDetails> {
    const saveWalkInDetailsApiUrl = saveWalkInDetailsEndpointUrl();
    return this.apiService
      .post(saveWalkInDetailsApiUrl, requestPayload)
      .pipe(map((data: WalkInsDetails) => data));
  }

  getWalkInsCustomerVisitDetails(
    requestPayload: WalkInsCountRequestPayload
  ): Observable<WalkInsCustomerVisitDetails> {
    const saveWalkInDetailsApiUrl = getWalkInDetailsCustomerVisitsCountEndpointUrl();
    return this.apiService
      .post(saveWalkInDetailsApiUrl, requestPayload)
      .pipe(
        map((data: WalkInsCustomerVisitDetails) =>
          WalkInsAdaptor.getWalkInsCustomerVisitDetails(data)
        )
      );
  }
}
