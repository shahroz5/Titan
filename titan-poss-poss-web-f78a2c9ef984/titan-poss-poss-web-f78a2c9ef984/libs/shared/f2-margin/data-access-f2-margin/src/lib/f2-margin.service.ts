import { Injectable } from '@angular/core';
import {
  ApiService,
  getF2MarginListUrl
} from '@poss-web/shared/util-api-service';
import { F2MarginListPayload } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { F2MarginAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class F2MarginService {
  constructor(public apiService: ApiService) {}

  getF2MarginList(f2MarginListPayload: F2MarginListPayload) {
    const url = getF2MarginListUrl(
      f2MarginListPayload.pageIndex,
      f2MarginListPayload.pageSize,
      f2MarginListPayload.cfaCode
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => F2MarginAdaptor.getF2MarginListData(data)));
  }
}
