import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigFiledValueUrl,
  getSaveConfigFiledValueUrl,
  getLocationMappingDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadWeightValueConfigListingPayload,
  WeightValueConfigListingResult,
  WeightValueConfigDetails,
  WeightValueConfigConstants,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import { WeightValueConfigAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class GRNWeightValueConfigService {
  constructor(private apiService: ApiService) {}

  getWeightValueConfigList(
    params: LoadWeightValueConfigListingPayload
  ): Observable<WeightValueConfigListingResult> {
    const url = getConfigurationListUrl(params.pageIndex, params.pageSize);

    return this.apiService
      .post(
        url.path,
        { ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG },
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
          ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG
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
      return of(WeightValueConfigAdaptor.getGRNWeightValueConfigDetailsNew());
    }

    const url = getUpdateConfigFiledValueUrl(
      params,
      ConfigTypeEnum.GRN_TOLERANCE_CONFIG
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
    const url = getSaveConfigFiledValueUrl(ConfigTypeEnum.GRN_TOLERANCE_CONFIG);


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
      ConfigTypeEnum.GRN_TOLERANCE_CONFIG
    );


    return this.apiService
      .patch(url, params)
      .pipe(
        map(data => WeightValueConfigAdaptor.getWeightValueConfigDetails(data))
      );
  }

  getMappedLocationsCount(params: string): Observable<number> {
    const url = getLocationMappingDetailsUrl(
      params.toString(),
      ConfigTypeEnum.GRN_TOLERANCE_CONFIG
    );

    return this.apiService.get(url).pipe(map(data => data.results.length));
  }
}
