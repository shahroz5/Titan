import { Injectable } from '@angular/core';

import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigFiledValueUrl,
  getSaveConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { InventoryGlobalConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  UpdateFieldValuePayload,
  invglobalConfigurationsEnum
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
@Injectable()
export class InventoryGlobalConfigService {
  constructor(private apiService: ApiService) {}
  getInvGlobalConfigurationList() {
    const url = getConfigurationListUrl();
    return this.apiService
      .post(url.path, {
        ruleType: invglobalConfigurationsEnum.HISTORY_TIME_CONFIGURATION
      })
      .pipe(
        map(data =>
          InventoryGlobalConfigAdaptor.getInvGlobalConfigurationList(data)
        )
      );
  }

  saveInvGlobalConfiguration() {
    const url = getSaveConfigurationUrl(
      invglobalConfigurationsEnum.HISTORY_TIME_CONFIGURATION
    );
    return this.apiService
      .post(url, {
        description: 'INV GLOBAL CONFIG',
        isActive: true,
        ruleDetails: {}
      })
      .pipe(
        map(data =>
          InventoryGlobalConfigAdaptor.getInvGlobalConfiguration(data)
        )
      );
  }

  getInvGlobalConfigurationFiledValue(configId: string) {
    const url = getUpdateConfigFiledValueUrl(
      configId,
      invglobalConfigurationsEnum.HISTORY_TIME_CONFIGURATION
    );
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          InventoryGlobalConfigAdaptor.getInvGlobalConfigFiledValues(data)
        )
      );
  }

  updateInvGlobalonfigurationFieldValue(
    updateFieldValuePayload: UpdateFieldValuePayload
  ) {
    const url = getUpdateConfigFiledValueUrl(
      updateFieldValuePayload.configId,
      invglobalConfigurationsEnum.HISTORY_TIME_CONFIGURATION
    );
    return this.apiService
      .patch(url, updateFieldValuePayload)
      .pipe(
        map(data =>
          InventoryGlobalConfigAdaptor.getInvGlobalConfigFiledValues(data)
        )
      );
  }
}
