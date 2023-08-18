import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getResidualWeightRangeUrl,
  getRangeMappingRulesUrl,
  geResidualRangeMappingRulesUrl
} from '@poss-web/shared/util-api-service';
import { ResidualWeightConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ResidualWeightConfigResponse,
  RangeConfigRequest,
  LoadResidualToleranceByConfigidPayload,
  ResidualWeightToleranceResponse
} from '@poss-web/shared/models';
import { map, concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidualWeightConfigService {
  constructor(private apiService: ApiService) {}

  getResidualWeightConfigList(
    pageIndex: number,
    pageSize: number,
    description?: string
    ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        {
          description: description ? description : null,
          ruleType: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
        },
        url.params
      )
      .pipe(
        map(data =>
          ResidualWeightConfigAdaptor.getResidualWeightConfigListData(data)
        )
      );
  }

  searchConfigByConfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
      })
      .pipe(
        map(data =>
          ResidualWeightConfigAdaptor.getResidualWeightConfigListData(data)
        )
      );
  }
  saveResidualWeightConfig(configDetails, payload: RangeConfigRequest) {
    const saveUrl = getSaveConfigurationUrl(
      'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .post(saveUrl, configDetails)
      .pipe(map(details => details))
      .pipe(
        concatMap(configs => {
          return this.apiService
            .patch(
              getRangeMappingRulesUrl(
                configs.ruleId,
                'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
              ),
              payload
            )
            .pipe(map(data => data.ruleId));
        })
      );
  }
  updateResidualWeightConfig(payload: ResidualWeightConfigResponse) {
    const url = getUpdateConfigurationUrl(
      payload.ruleId.toString(),
      'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data =>
          ResidualWeightConfigAdaptor.getResidualWeightConfiguration(data)
        )
      );
  }

  loadRangeWeight() {
    const url = getResidualWeightRangeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => ResidualWeightConfigAdaptor.getResidualRangeWeight(data))
      );
  }
  selectedConfigDetails(configId: string): any {
    const url = getUpdateConfigurationUrl(
      configId,
      'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          ResidualWeightConfigAdaptor.getResidualWeightConfiguration(data)
        )
      );
  }

  getRangeMapping(
    payload: LoadResidualToleranceByConfigidPayload
  ): Observable<ResidualWeightToleranceResponse> {

    const url = geResidualRangeMappingRulesUrl(
      payload,
      'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ResidualWeightConfigAdaptor.getRangeMapping(data)));
  }

  UpdateRangeMapping(
    configId: string,
    weightToleranceRequest: RangeConfigRequest
  ) {
    const url = getRangeMappingRulesUrl(
      configId,
      'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
    );

    return this.apiService
      .patch(url, weightToleranceRequest)
      .pipe(map(data => ResidualWeightConfigAdaptor.getRangeMapping(data)));
  }
}
