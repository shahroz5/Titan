import { Injectable } from '@angular/core';

import {
  ApiService,
  getUpdateConfigurationUrl,
  getProductGroupMappingRulesUrl,
  getConfigurationListUrl,
  getSearchConfigByConfigNameUrl,
  getSaveConfigurationUrl,
  getWeightRangeUrl,
  getProductGroupMappingGetRulesUrl
} from '@poss-web/shared/util-api-service';

import { WeightToleranceAdaptor } from '@poss-web/shared/util-adaptors';
import {
  WeightToleranceRequest,
  weightToleranceEnum
} from '@poss-web/shared/models';
import { map, concatMap } from 'rxjs/operators';

@Injectable()
export class WeightToleranceService {
  constructor(private apiService: ApiService) {}

  updateIsActive(configId: string, data) {
    const url = getUpdateConfigurationUrl(
      configId,
      weightToleranceEnum.ruleType
    );
    return this.apiService.patch(url, data);
  }

  getConfigDetailsList(
    pageIndex: number, 
    pageSize: number,
    description?: string
  ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(url.path, { 
        description: description ? description : null,
        ruleType: weightToleranceEnum.ruleType 
      }, 
      url.params)
      .pipe(map(data => WeightToleranceAdaptor.getConfigDetailsListData(data)));
  }

  getSelectedConfigDetails(configId: string) {
    const url = getUpdateConfigurationUrl(
      configId,
      weightToleranceEnum.ruleType
    );
    return this.apiService
      .get(url)
      .pipe(map(data => WeightToleranceAdaptor.getSelectedConfigData(data)));
  }

  searchConfigDetailsByconfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: weightToleranceEnum.ruleType
      })
      .pipe(map(data => WeightToleranceAdaptor.getConfigDetailsListData(data)));
  }
  saveWeightTolerance(
    configDetails,
    weightToleranceRequest: WeightToleranceRequest
  ) {
    const url1 = getSaveConfigurationUrl(weightToleranceEnum.ruleType);

    return this.apiService
      .post(url1, configDetails)
      .pipe(map(details => details))
      .pipe(
        concatMap(configs => {
          return this.apiService
            .patch(
              getProductGroupMappingRulesUrl(
                configs.ruleId,
                weightToleranceEnum.ruleType
              ),
              weightToleranceRequest
            )
            .pipe(map(data => data.ruleId));
        })
      );
  }

  getWeightTolerance(
    pageIndex,
    pageSize,
    configId: any,
    productGroupCode: string
  ) {
    const url = getProductGroupMappingGetRulesUrl(
      pageIndex,
      pageSize,
      configId,
      productGroupCode,
      weightToleranceEnum.ruleType
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => WeightToleranceAdaptor.getWeightTolerance(data)));
  }

  updateWeightTolerance(
    configId: string,
    weightToleranceRequest: WeightToleranceRequest
  ) {
    const url = getProductGroupMappingRulesUrl(
      configId,
      weightToleranceEnum.ruleType
    );

    return this.apiService
      .patch(url, weightToleranceRequest)
      .pipe(map(data => WeightToleranceAdaptor.getWeightTolerance(data)));
  }

  loadRangeWeight() {
    const url = getWeightRangeUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => WeightToleranceAdaptor.getRangeWeight(data)));
  }
}
