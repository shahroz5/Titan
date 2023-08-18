import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigFiledValueUrl,
  getSaveConfigFiledValueUrl
} from '@poss-web/shared/util-api-service';
import {
  ConfigTypeEnum,
  BgrConfigListingParams,
  BgrConfigListingResult,
  BgrConfigDetails,
  BgrConfigConstants
} from '@poss-web/shared/models';
import { BgrConfigAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class BgrConfigService {
  constructor(private apiService: ApiService) {}

  getBgrConfigList(
    params: BgrConfigListingParams,
    requestPayload: any
  ): Observable<BgrConfigListingResult> {
    const url = getConfigurationListUrl(params.pageIndex, params.pageSize);

    return this.apiService
      .post(
        url.path,
        {
          description: requestPayload.description
            ? requestPayload.description
            : null,
          ruleType: requestPayload.ruleType
        },
        url.params
      )
      .pipe(map(data => BgrConfigAdaptor.getBgrConfigListing(data)));
  }

  getBgrConfigSearch(params: any): Observable<BgrConfigListingResult> {
    const url = getConfigurationListUrl(0, 10);
    return this.apiService
      .post(url.path, {
        description: params.description,
        ruleType: params.ruleType
      })
      .pipe(map(data => BgrConfigAdaptor.getBgrConfigListing(data)));
  }

  getBgrConfigDetails(params: any): Observable<BgrConfigDetails> {
    if (params.ruleId === BgrConfigConstants.NEW) {
      return of(BgrConfigAdaptor.getBgrConfigDetailsNew());
    }

    const url = getUpdateConfigFiledValueUrl(params.ruleId, params.ruleType);
    return this.apiService
      .get(url)
      .pipe(map(data => BgrConfigAdaptor.getBgrConfigDetails(data)));
  }

  saveBgrConfigDetails(params: BgrConfigDetails): Observable<BgrConfigDetails> {
    const url = getSaveConfigFiledValueUrl(params.ruleType);

    return this.apiService
      .post(url, params)
      .pipe(map(data => BgrConfigAdaptor.getBgrConfigDetails(data)));
  }

  editBgrConfigDetails(params: BgrConfigDetails): Observable<BgrConfigDetails> {
    const url = getUpdateConfigFiledValueUrl(
      params.ruleId.toString(),
      params.ruleType
    );

    return this.apiService
      .patch(url, params)
      .pipe(map(data => BgrConfigAdaptor.getBgrConfigDetails(data)));
  }
}
