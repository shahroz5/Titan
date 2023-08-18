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
  LoadWeightValueConfigListingPayload,
  WeightValueConfigListingResult,
  WeightValueConfigDetails,
  WeightValueConfigConstants
} from '@poss-web/shared/models';
import { WeightValueConfigAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class WeightValueConfigService {
  constructor(private apiService: ApiService) {}

  getWeightValueConfigList(
    params: LoadWeightValueConfigListingPayload
  ): Observable<WeightValueConfigListingResult> {
    const url = getConfigurationListUrl(params.pageIndex, params.pageSize);

    return this.apiService
      .post(
        url.path,
        { description: params.searchDescription,
          ruleType: WeightValueConfigConstants.GRF_CONFIGURATION },
        url.params
      )

      .pipe(
        map(data => WeightValueConfigAdaptor.getWeightValueConfigListing(data))
      );
  }

  getWeightValueConfigSearch(
    params: string
  ): Observable<WeightValueConfigListingResult> {
    const url = getConfigurationListUrl(0, 10);
    return this.apiService
      .post(
        url.path,
        {
          description: params,
          ruleType: WeightValueConfigConstants.GRF_CONFIGURATION
        },
        url.params
      )
      .pipe(
        map(data => WeightValueConfigAdaptor.getWeightValueConfigListing(data))
      );
  }

  getWeightValueConfigDetails(
    params: string
  ): Observable<WeightValueConfigDetails> {
    if (params === WeightValueConfigConstants.NEW) {
      return of(WeightValueConfigAdaptor.getWeightValueConfigDetailsNew());
    }

    const url = getUpdateConfigFiledValueUrl(
      params,
      WeightValueConfigConstants.GRF_CONFIGURATION
    );
    return this.apiService
      .get(url)
      .pipe(
        map(data => WeightValueConfigAdaptor.getWeightValueConfigDetails(data))
      );
  }

  saveWeightValueConfigDetails(
    params: WeightValueConfigDetails
  ): Observable<WeightValueConfigDetails> {
    const url = getSaveConfigFiledValueUrl(
      WeightValueConfigConstants.GRF_CONFIGURATION
    );


    return this.apiService
      .post(url, params)
      .pipe(
        map(data => WeightValueConfigAdaptor.getWeightValueConfigDetails(data))
      );
  }

  editWeightValueConfigDetails(
    params: WeightValueConfigDetails
  ): Observable<WeightValueConfigDetails> {
    const url = getUpdateConfigFiledValueUrl(
      params.ruleId.toString(),
      WeightValueConfigConstants.GRF_CONFIGURATION
    );


    return this.apiService
      .patch(url, params)
      .pipe(
        map(data => WeightValueConfigAdaptor.getWeightValueConfigDetails(data))
      );
  }
}
