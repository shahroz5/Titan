import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getSaveConfigurationUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getDiscountTypesUrl
} from '@poss-web/shared/util-api-service';

import { FtepApprovalConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigTypeEnum,
  DiscountLovTypesEnum,
  FtepApprovalConfig
} from '@poss-web/shared/models';

import { map } from 'rxjs/Operators';

@Injectable()
export class FtepApprovalConfigService {
  constructor(private apiService: ApiService) {}

  getFtepApprovalConfigList(pageIndex: number, pageSize: number) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        { ruleType: ConfigTypeEnum.FTEP_APPROVAL_ACCESS_REGULAR },
        url.params
      )
      .pipe(
        map(data => FtepApprovalConfigAdaptor.getFtepApprovalConfigList(data))
      );
  }
  saveFtepApprovalConfig(ftepApprovalConfig: FtepApprovalConfig) {
    const saveUrl = getSaveConfigurationUrl(ftepApprovalConfig.ruleType);
    return this.apiService
      .post(saveUrl, ftepApprovalConfig)
      .pipe(map(data => FtepApprovalConfigAdaptor.getFtepApprovalConfig(data)));
  }

  updateFtepApprovalConfig(ftepApprovalConfig: FtepApprovalConfig) {
    const url = getUpdateConfigurationUrl(
      ftepApprovalConfig.ruleId,
      ftepApprovalConfig.ruleType
    );
    return this.apiService
      .patch(url, ftepApprovalConfig)
      .pipe(map(data => FtepApprovalConfigAdaptor.getFtepApprovalConfig(data)));
  }

  searchFtepApprovalConfigByFtepType(ftepType: string) {
    const url = getSearchConfigByConfigNameUrl(ftepType);
    return this.apiService
      .post(url, {
        ruleType: ConfigTypeEnum.FTEP_APPROVAL_ACCESS_REGULAR,
        description: ftepType
      })
      .pipe(
        map(data => FtepApprovalConfigAdaptor.getFtepApprovalConfigList(data))
      );
  }

  getFtepApprovalConfig(ruleId: string, ruleType: string) {
    const url = getUpdateConfigurationUrl(ruleId, ruleType);
    return this.apiService
      .get(url)
      .pipe(map(data => FtepApprovalConfigAdaptor.getFtepApprovalConfig(data)));
  }

  getNewFtepApprovalConfigByRuleId() {
    const data = FtepApprovalConfigAdaptor.getFtepApprovalConfig(false);
    return data;
  }

  // getRoleList() {
  //   const url = getRoleTypeUrl();
  //   return this.apiService
  //     .get(url)
  //     .pipe(map(data => FtepApprovalConfigAdaptor.getRoleList(data)));
  // }

  getRoleList() {
    const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
    const url = getDiscountTypesUrl(lovType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FtepApprovalConfigAdaptor.getRoleList(data)));
  }
}
