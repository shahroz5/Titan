import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getSaveConfigurationUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getDiscountTypesUrl
} from '@poss-web/shared/util-api-service';

import { GrnApprovalConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigTypeEnum,
  DiscountLovTypesEnum,
  GrnApprovalConfig
} from '@poss-web/shared/models';

import { map } from 'rxjs/Operators';

@Injectable()
export class GrnApprovalConfigService {
  constructor(private apiService: ApiService) {}

  getGrnApprovalConfigList(
    pageIndex: number, 
    pageSize: number,
    description?: string
  ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,{ 
          description: description ? description : null,
          ruleGroup: ConfigTypeEnum.GRN_APPROVAL_CONFIGURATION 
        },
        url.params
      )
      .pipe(
        map(data => GrnApprovalConfigAdaptor.getGrnApprovalConfigList(data))
      );
  }
  saveGrnApprovalConfig(grnApprovalConfig: GrnApprovalConfig) {
    const saveUrl = getSaveConfigurationUrl(grnApprovalConfig.ruleType);
    return this.apiService
      .post(saveUrl, grnApprovalConfig)
      .pipe(map(data => GrnApprovalConfigAdaptor.getGrnApprovalConfig(data)));
  }

  updateGrnApprovalConfig(grnApprovalConfig: GrnApprovalConfig) {
    const url = getUpdateConfigurationUrl(
      grnApprovalConfig.ruleId,
      grnApprovalConfig.ruleType
    );
    return this.apiService
      .patch(url, grnApprovalConfig)
      .pipe(map(data => GrnApprovalConfigAdaptor.getGrnApprovalConfig(data)));
  }

  searchGrnApprovalConfigByGrnType(grnType: string) {
    const url = getSearchConfigByConfigNameUrl(grnType);
    return this.apiService
      .post(url, {
        ruleGroup: ConfigTypeEnum.GRN_APPROVAL_CONFIGURATION,
        description: grnType
      })
      .pipe(
        map(data => GrnApprovalConfigAdaptor.getGrnApprovalConfigList(data))
      );
  }

  getGrnApprovalConfig(ruleId: string, ruleType: string) {
    const url = getUpdateConfigurationUrl(ruleId, ruleType);
    return this.apiService
      .get(url)
      .pipe(map(data => GrnApprovalConfigAdaptor.getGrnApprovalConfig(data)));
  }

  getNewGrnApprovalConfigByRuleId() {
    const data = GrnApprovalConfigAdaptor.getGrnApprovalConfig(false);
    return data;
  }

  getRoleList() {
    const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
    const url = getDiscountTypesUrl(lovType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GrnApprovalConfigAdaptor.getRoleList(data)));
  }
}
