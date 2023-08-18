import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getRangeMappingRulesUrl,
  getAbToleranceConfigWeightRangeUrl,
  getMetalTypesUrl,
  getAbToleranceRangeMappingRulesUrl,
  getUniqueConfigByConfigNameUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import { AbToleranceConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AbToleranceConfigDetailsReqPayload,
  AbToleranceConfigDetailsResPayload,
  AbToleranceConfigResponse,
  AbToleranceRangeConfigRequest
} from '@poss-web/shared/models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbToleranceConfigService {
  constructor(private apiService: ApiService) {}

  getAbToleranceConfigList(
    pageIndex: number,
    pageSize: number,
    ruleType: string,
    description?: string,
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
        map(data => AbToleranceConfigAdaptor.getAbToleranceConfigListData(data))
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
        map(data => AbToleranceConfigAdaptor.getAbToleranceConfigListData(data))
      );
  }

  uniqueConfigNameCheck(payload: string) {
    const url = getUniqueConfigByConfigNameUrl();
    return this.apiService
      .post(
        url.path, 
        {
          description: payload,
          ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
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
                ruleType: 'ORDER_AB_NON_FROZEN_TOLERANCE'
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
      .pipe(map(data => AbToleranceConfigAdaptor.getSelectedConfigData(data)));
  }

  updateConfig(payload: AbToleranceConfigResponse) {
    const url = getUpdateConfigurationUrl(
      payload.ruleId.toString(),
      payload.ruleDetails.type
    );
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data => AbToleranceConfigAdaptor.getAbToleranceConfiguration(data))
      );
  }

  saveConfig(
    configDetails,
    payload: AbToleranceRangeConfigRequest,
    ruleType: string
  ): Observable<any> {
    const saveUrl = getSaveConfigurationUrl(ruleType);
    return this.apiService
      .post(saveUrl, configDetails)
      .pipe(map(details => details));
  }

  getConfigMapping(
    payload: AbToleranceConfigDetailsReqPayload
  ): Observable<AbToleranceConfigDetailsResPayload> {
    const url = getAbToleranceRangeMappingRulesUrl(payload);
    if (payload.configId === 'new') {
      return of(AbToleranceConfigAdaptor.getConfigMappingNew());
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => AbToleranceConfigAdaptor.getConfigMapping(data)));
  }

  UpdateConfigMapping(
    configId: string,
    weightToleranceRequest: AbToleranceRangeConfigRequest,
    ruleType: string
  ) {
    const url = getRangeMappingRulesUrl(configId, ruleType);

    return this.apiService
      .patch(url, weightToleranceRequest)
      .pipe(map(data => AbToleranceConfigAdaptor.getConfigMapping(data)));
  }

  loadMetalTypes() {
    const url = getMetalTypesUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          AbToleranceConfigAdaptor.getAbToleranceConfigMetalTypes(data)
        )
      );
  }
  
  loadRangeWeight() {
    const url = getAbToleranceConfigWeightRangeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => AbToleranceConfigAdaptor.getAbToleranceRangeWeight(data))
      );
  }
}
