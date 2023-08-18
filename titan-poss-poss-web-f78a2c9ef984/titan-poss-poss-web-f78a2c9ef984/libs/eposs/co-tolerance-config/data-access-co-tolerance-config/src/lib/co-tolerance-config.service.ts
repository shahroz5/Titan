import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getRangeMappingRulesUrl,
  getCoToleranceConfigWeightRangeUrl,
  getMetalTypesUrl,
  getCoToleranceRangeMappingRulesUrl,
  getUniqueConfigByConfigNameUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import { CoToleranceConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CoToleranceConfigDetailsReqPayload,
  CoToleranceConfigDetailsResPayload,
  CoToleranceConfigResponse,
  CoToleranceRangeConfigRequest
} from '@poss-web/shared/models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoToleranceConfigService {
  constructor(private apiService: ApiService) {}

  getCoToleranceConfigList(
    pageIndex: number,
    pageSize: number,
    ruleType: string,
    description?: string
  ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        {
          description: description ? description : null,
          ruleType: ruleType
        },
        url.params
      )
      .pipe(
        map(data => CoToleranceConfigAdaptor.getCoToleranceConfigListData(data))
      );
  }

  searchConfigByConfigName(payload: { configName: string; ruleType: string }) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: payload.configName,
        ruleType: payload.ruleType
      })
      .pipe(
        map(data => CoToleranceConfigAdaptor.getCoToleranceConfigListData(data))
      );
  }

  uniqueConfigNameCheck(payload: string) {
    const url = getUniqueConfigByConfigNameUrl();
    return this.apiService
      .post(
        url.path,
        {
          description: payload,
          ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
        },
        url.params
      )
      .pipe(
        concatMap(frozenOrderDetails => {
          return this.apiService
            .post(
              url.path,
              {
                description: payload,
                ruleType: 'ORDER_CO_NON_FROZEN_TOLERANCE'
              },
              url.params
            )
            .pipe(
              map(
                nonFrozenOrderDetails =>
                  frozenOrderDetails.totalElements +
                  nonFrozenOrderDetails.totalElements
              )
            );
        })
      );
  }

  getSelectedConfigDetails(configId: string, ruleType: string) {
    const url = getUpdateConfigurationUrl(configId, ruleType);
    return this.apiService
      .get(url)
      .pipe(map(data => CoToleranceConfigAdaptor.getSelectedConfigData(data)));
  }

  updateConfig(payload: CoToleranceConfigResponse) {
    const url = getUpdateConfigurationUrl(
      payload.ruleId.toString(),
      payload.ruleDetails.type
    );
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data => CoToleranceConfigAdaptor.getCoToleranceConfiguration(data))
      );
  }

  saveConfig(
    configDetails,
    payload: CoToleranceRangeConfigRequest,
    ruleType: string
  ): Observable<any> {
    const saveUrl = getSaveConfigurationUrl(ruleType);
    return this.apiService
      .post(saveUrl, configDetails)
      .pipe(map(details => details));
  }

  getConfigMapping(
    payload: CoToleranceConfigDetailsReqPayload
  ): Observable<CoToleranceConfigDetailsResPayload> {
    const url = getCoToleranceRangeMappingRulesUrl(payload);
    if (payload.configId === 'new') {
      return of(CoToleranceConfigAdaptor.getConfigMappingNew());
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CoToleranceConfigAdaptor.getConfigMapping(data)));
  }

  UpdateConfigMapping(
    configId: string,
    weightToleranceRequest: CoToleranceRangeConfigRequest,
    ruleType: string
  ) {
    const url = getRangeMappingRulesUrl(configId, ruleType);

    return this.apiService
      .patch(url, weightToleranceRequest)
      .pipe(map(data => CoToleranceConfigAdaptor.getConfigMapping(data)));
  }

  loadMetalTypes() {
    const url = getMetalTypesUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CoToleranceConfigAdaptor.getCoToleranceConfigMetalTypes(data)
        )
      );
  }

  loadRangeWeight() {
    const url = getCoToleranceConfigWeightRangeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CoToleranceConfigAdaptor.getCoToleranceRangeWeight(data))
      );
  }
}
