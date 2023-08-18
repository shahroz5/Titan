import { Injectable } from '@angular/core';
import {
  PIFSeriesPayload,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import { PIFSeriesAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getPIFSeriesUrl,
  getSavePIFSeriesUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
@Injectable()
export class PIFSeriesService {
  constructor(private apiService: ApiService) { }
  loadPIFSeries(payload: PIFSeriesPayload) {
    const url = getPIFSeriesUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PIFSeriesAdaptor.getPIFSeries(data)));
  }
  savePIFSeries(savePayload: SavePIFSeriesPayload[]) {
    const url = getSavePIFSeriesUrl();
    return this.apiService.patch(url, { pifSeriesUpdateReqDto: savePayload });
  }
}
