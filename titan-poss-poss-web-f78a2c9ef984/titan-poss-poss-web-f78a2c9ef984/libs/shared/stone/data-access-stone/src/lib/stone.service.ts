import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getFilterStoneListUrl
} from '@poss-web/shared/util-api-service';

import {
  LoadStoneListingSuccessPayload,
  StoneFilter
} from '@poss-web/shared/models';
import { StoneAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class StoneService {
  constructor(private apiService: ApiService) {}

  getFilteredStoneList(
    payload: StoneFilter
  ): Observable<LoadStoneListingSuccessPayload> {
    const url = getFilterStoneListUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .post(url.path, payload.payloadData, url.params)
      .pipe(map(data => StoneAdaptor.getStoneDetailsListing(data)));
  }
}
