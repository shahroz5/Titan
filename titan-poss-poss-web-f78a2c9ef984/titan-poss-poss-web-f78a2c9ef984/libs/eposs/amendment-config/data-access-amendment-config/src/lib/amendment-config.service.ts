import { Injectable } from '@angular/core';
import { invglobalConfigurationsEnum, UpdateFieldValuePayload } from '@poss-web/shared/models';
import {
  ApiService, getUpdateConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AmendmentConfigService {
  constructor(private apiService: ApiService) {}

  getAmendmentConfiguration() {
    const url = getUpdateConfigurationUrl(
      '1',
      invglobalConfigurationsEnum.AMENDMENT_CONFIGURATION
    );
    return this.apiService
      .get(url)
      .pipe(map(data => data.ruleDetails?.data?.noOfDaysToRaiseAmendment));
  }

  saveAmendmentConfiguration(body: UpdateFieldValuePayload) {
    const url = getUpdateConfigurationUrl(
      '1',
      invglobalConfigurationsEnum.AMENDMENT_CONFIGURATION
    );
    return this.apiService
      .patch(url, body)
      .pipe(map(data => data.ruleDetails?.data?.noOfDaysToRaiseAmendment));
  }
}
