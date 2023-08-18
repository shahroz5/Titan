import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getSaveConfigurationUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl
} from '@poss-web/shared/util-api-service';

import { IbtConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import { IbtConfiguration, ibtConfigEnums } from '@poss-web/shared/models';

import { map } from 'rxjs/Operators';

@Injectable()
export class IbtConfigurationService {
  configDetails: IbtConfiguration;
  constructor(private apiService: ApiService) {}

  getIbtConfiguratonList(pageIndex: number, pageSize: number) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        { ruleType: ibtConfigEnums.IBT_CONFIGURATIONS },
        url.params
      )
      .pipe(map(data => IbtConfigurationAdaptor.getIbtConfigurationList(data)));
  }
  saveIbtConfiguration(ibtConfiguration: IbtConfiguration) {
    const saveUrl = getSaveConfigurationUrl(ibtConfigEnums.IBT_CONFIGURATIONS);
    return this.apiService
      .post(saveUrl, ibtConfiguration)
      .pipe(map(data => IbtConfigurationAdaptor.getIbtConfiguration(data)));
  }

  updateIbtConfiguration(ibtConfiguration: IbtConfiguration) {
    const url = getUpdateConfigurationUrl(
      ibtConfiguration.configId,
      ibtConfigEnums.IBT_CONFIGURATIONS
    );
    return this.apiService
      .patch(url, ibtConfiguration)
      .pipe(map(data => IbtConfigurationAdaptor.getIbtConfiguration(data)));
  }
  searchConfigByConfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: ibtConfigEnums.IBT_CONFIGURATIONS
      })
      .pipe(map(data => IbtConfigurationAdaptor.getIbtConfigurationList(data)));
  }

  getIbtConfiguration(configId: string) {
    const url = getUpdateConfigurationUrl(
      configId,
      ibtConfigEnums.IBT_CONFIGURATIONS
    );
    return this.apiService
      .get(url)
      .pipe(map(data => IbtConfigurationAdaptor.getIbtConfiguration(data)));
  }

  getNewIbtConfigurationByConfigId() {
    const data = IbtConfigurationAdaptor.getIbtConfiguration(false);
    return data;
  }
}
