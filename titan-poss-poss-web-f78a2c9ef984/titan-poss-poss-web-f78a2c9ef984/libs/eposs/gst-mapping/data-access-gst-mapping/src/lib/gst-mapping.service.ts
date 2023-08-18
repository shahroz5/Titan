import { Injectable } from '@angular/core';
import {
  LoadGSTMappingListPayload,
  Tax,
  GSTMappingResponse,
  GSTMappingDetails,
  GSTMappingPayload} from '@poss-web/shared/models';
import {
  getGSTMappingListUrl,
  ApiService,
  getTaxMasterListingUrl,
  getGSTMappingBaseUrl,
  getEditGSTMappingUrl} from '@poss-web/shared/util-api-service';
import {
  GSTMappingHelper,
  GSTMappingAdaptor
} from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class GSTMappingService {
  maxPageSize = 100000;

  constructor(private apiService: ApiService) {}

  loadGSTMappingList(
    payload: LoadGSTMappingListPayload
  ): Observable<GSTMappingResponse> {
    const url = getGSTMappingListUrl(
      payload.pageIndex,
      payload.pageSize,
      payload.filter
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GSTMappingHelper.getGSTMappingDetails(data)));
  }

  addGSTMapping(payload: GSTMappingPayload): Observable<GSTMappingDetails> {
    const url = getGSTMappingBaseUrl();

    return this.apiService
      .post(url, payload)
      .pipe(map(data => GSTMappingAdaptor.getGSTMappingDetails(data)));
  }

  editGSTMapping(
    configId: string,
    payload: GSTMappingPayload
  ): Observable<GSTMappingDetails> {
    const url = getEditGSTMappingUrl(configId);

    return this.apiService
      .patch(url, payload)
      .pipe(map(data => GSTMappingAdaptor.getGSTMappingDetails(data)));
  }

  loadTaxDetails(): Observable<Tax[]> {
    const url = getTaxMasterListingUrl(0, this.maxPageSize, true);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GSTMappingHelper.getTaxDetails(data)));
  }
}
