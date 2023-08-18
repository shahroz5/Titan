import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getSaveConfigurationUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getCreditNoteTypeUrl
} from '@poss-web/shared/util-api-service';

import { CnPriorityConfigAdaptor } from '@poss-web/shared/util-adaptors';
import { CnPriorityConfig, ConfigTypeEnum } from '@poss-web/shared/models';

import { map } from 'rxjs/Operators';

@Injectable()
export class CnPriorityConfigService {
  constructor(private apiService: ApiService) {}

  getCnPriorityConfigList(pageIndex: number, pageSize: number) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        { ruleType: ConfigTypeEnum.CN_PRIORITY_CONFIG },
        url.params
      )
      .pipe(map(data => CnPriorityConfigAdaptor.getCnPriorityConfigList(data)));
  }
  saveCnPriorityConfig(cnPriorityConfig: CnPriorityConfig) {
    const saveUrl = getSaveConfigurationUrl(ConfigTypeEnum.CN_PRIORITY_CONFIG);
    return this.apiService
      .post(saveUrl, cnPriorityConfig)
      .pipe(map(data => CnPriorityConfigAdaptor.getCnPriorityConfig(data)));
  }

  updateCnPriorityConfig(cnPriorityConfig: CnPriorityConfig) {
    const url = getUpdateConfigurationUrl(
      cnPriorityConfig.configId,
      ConfigTypeEnum.CN_PRIORITY_CONFIG
    );
    return this.apiService
      .patch(url, cnPriorityConfig)
      .pipe(map(data => CnPriorityConfigAdaptor.getCnPriorityConfig(data)));
  }

  searchConfigByConfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl(
      ConfigTypeEnum.CN_PRIORITY_CONFIG
    );
    return this.apiService
      .post(url, {
        ruleType: ConfigTypeEnum.CN_PRIORITY_CONFIG,
        description: configName
      })
      .pipe(map(data => CnPriorityConfigAdaptor.getCnPriorityConfigList(data)));
  }

  getCnPriorityConfig(configId: string) {
    const url = getUpdateConfigurationUrl(
      configId,
      ConfigTypeEnum.CN_PRIORITY_CONFIG
    );
    return this.apiService
      .get(url)
      .pipe(map(data => CnPriorityConfigAdaptor.getCnPriorityConfig(data)));
  }

  getNewCnPriorityConfigByConfigId() {
    const data = CnPriorityConfigAdaptor.getCnPriorityConfig(false);
    return data;
  }

  getCreditNoteType() {
    const url = getCreditNoteTypeUrl();
    return this.apiService
      .get(url)
      .pipe(map(data => CnPriorityConfigAdaptor.getCnTypeList(data)));
  }
}
