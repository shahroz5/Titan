import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getRangeMappingRulesUrl,
  getBgrToleranceConfigWeightRangeUrl,
  getMetalTypesUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import { AbToleranceConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AbToleranceConfigResponse,
  AbToleranceRangeConfigRequest
} from '@poss-web/shared/models';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BgrToleranceConfigService {
  configIdInValidationFailureScenario = null;
  constructor(private apiService: ApiService) {}

  getBgrToleranceConfigList(
    pageIndex: number,
    pageSize: number,
    description?: string,
    ruleType?: string
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

  searchConfigByConfigName(configName: string, ruleType?: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: ruleType
      })
      .pipe(
        map(data => AbToleranceConfigAdaptor.getAbToleranceConfigListData(data))
      );
  }
  getSelectedConfigDetails(configId: string, ruleType?: string) {
    const url = getUpdateConfigurationUrl(configId, ruleType);
    return this.apiService
      .get(url)
      .pipe(map(data => AbToleranceConfigAdaptor.getSelectedConfigData(data)));
  }
  updateConfig(payload: AbToleranceConfigResponse) {
    const url = getUpdateConfigurationUrl(
      payload.ruleId.toString(),
      payload.ruleType
    );
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data => AbToleranceConfigAdaptor.getAbToleranceConfiguration(data))
      );
  }
  loadRangeWeight() {
    const url = getBgrToleranceConfigWeightRangeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => AbToleranceConfigAdaptor.getAbToleranceRangeWeight(data))
      );
  }
  saveConfig(configDetails, payload: AbToleranceRangeConfigRequest) {
    const saveUrl = getSaveConfigurationUrl(configDetails.ruleDetails.type);
    return this.apiService
      .post(saveUrl, configDetails)
      .pipe(map(details => details))
      .pipe(
        concatMap(configs => {
          this.configIdInValidationFailureScenario = configs.ruleId;
          return this.apiService
            .patch(
              getRangeMappingRulesUrl(configs.ruleId, configs.ruleType),
              payload
            )
            .pipe(map(data => data.ruleId));
        })
      );
  }
  getConfigMapping(configId: any, ruleType: string) {
    const url = getRangeMappingRulesUrl(configId, ruleType);
    if (configId === 'new') {
      return of(AbToleranceConfigAdaptor.getConfigMappingNew());
    }
    return this.apiService
      .get(url)
      .pipe(map(data => AbToleranceConfigAdaptor.getBgrRangeMapping(data)));
  }
  UpdateConfigMapping(
    configId: string,
    ruleType: string,
    weightToleranceRequest: AbToleranceRangeConfigRequest
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
}
