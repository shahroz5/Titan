import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  getTepGlobalConfigListUrl,
  updateTepGlobalConfigUrl
} from '@poss-web/shared/util-api-service';

import {
  GetMaxFlatTepConfigResponse,
  MaxFlatTepConfigDetails,
  MaxFlatTepConfigResults,
  MaxFlatValuePatchPayload
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';

import { MaxFlatTepConfigAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class MaxFlatTepConfigService {
  constructor(private apiService: ApiService) {}

  getMaxFlatTepConfig(): Observable<MaxFlatTepConfigDetails> {
    const urlObject = getTepGlobalConfigListUrl();
    const getMaxFlatTepConfigUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService.get(getMaxFlatTepConfigUrl, params).pipe(
      map((data: MaxFlatTepConfigResults) => {
        return MaxFlatTepConfigAdaptor.getConfigDetailsFromListResponse(data);
      })
    );
  }

  updateMaxFlatTepConfig(
    configId: string,
    payload: MaxFlatValuePatchPayload
  ): Observable<MaxFlatTepConfigDetails> {
    const urlObject = updateTepGlobalConfigUrl(configId);
    const updateMaxFlatTepConfigUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .patch(updateMaxFlatTepConfigUrl, payload, params)
      .pipe(
        map((data: GetMaxFlatTepConfigResponse) => {
          return MaxFlatTepConfigAdaptor.getConfigDetailsFromUpdateResponse(
            data
          );
        })
      );
  }
}
