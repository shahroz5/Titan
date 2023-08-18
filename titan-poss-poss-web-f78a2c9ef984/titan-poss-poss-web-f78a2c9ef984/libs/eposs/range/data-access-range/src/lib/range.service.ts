import { Injectable } from '@angular/core';
import { Ranges } from '@poss-web/shared/models';
import { RangeAdaptor } from '@poss-web/shared/util-adaptors';

import {
  ApiService,
  getLoadRangesUrl,
  getRangeTypesUrl,
  getSaveRangesUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
@Injectable()
export class RangeService {
  constructor(private apiService: ApiService) {}
  loadRanges(configType: string) {
    const url = getLoadRangesUrl(configType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => RangeAdaptor.rangeList(data)));
  }
  saveRanges(payload: { rangeType: string; savePayload: Ranges[] }) {
    const url = getSaveRangesUrl(payload.rangeType);
    return this.apiService.patch(url.path, payload.savePayload, url.params);
  }
  loadRangeTypes(type: string) {
    const url = getRangeTypesUrl(type);
    return this.apiService
      .get(url)
      .pipe(map(data => RangeAdaptor.rangeTypes(data)));
  }
}
