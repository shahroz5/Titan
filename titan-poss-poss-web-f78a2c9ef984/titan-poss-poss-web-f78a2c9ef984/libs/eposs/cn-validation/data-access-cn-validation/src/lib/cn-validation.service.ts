import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getSaveConfigurationUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getCreditNoteTypeUrl
} from '@poss-web/shared/util-api-service';

import { CnValidationAdaptor } from '@poss-web/shared/util-adaptors';
import { CnValidation, ConfigTypeEnum } from '@poss-web/shared/models';

import { map } from 'rxjs/Operators';

@Injectable()
export class CnValidationService {
  configDetails: CnValidation;
  constructor(private apiService: ApiService) {}

  getCnValidationList(pageIndex: number, pageSize: number, description?: any) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        {
          ruleGroup: ConfigTypeEnum.CN_VALIDATION_CONFIG,
          ...description
        },
        url.params
      )
      .pipe(map(data => CnValidationAdaptor.getCnValidationList(data)));
  }
  saveCnValidation(cnValidation: CnValidation) {
    const saveUrl = getSaveConfigurationUrl(cnValidation.ruleType);
    return this.apiService
      .post(saveUrl, cnValidation)
      .pipe(map(data => CnValidationAdaptor.getCnValidation(data)));
  }

  updateCnValidation(cnValidation: CnValidation) {
    const url = getUpdateConfigurationUrl(
      cnValidation.ruleId,
      cnValidation.ruleType
    );
    return this.apiService
      .patch(url, cnValidation)
      .pipe(map(data => CnValidationAdaptor.getCnValidation(data)));
  }

  searchCnValidationByCnType(cnType: any) {
    const url = getSearchConfigByConfigNameUrl(cnType);
    return this.apiService
      .post(url, {
        ruleGroup: ConfigTypeEnum.CN_VALIDATION_CONFIG,
        description: cnType
      })
      .pipe(map(data => CnValidationAdaptor.getCnValidationList(data)));
  }

  getCnValidation(ruleId: string, ruleType: string) {
    const url = getUpdateConfigurationUrl(ruleId, ruleType);
    return this.apiService
      .get(url)
      .pipe(map(data => CnValidationAdaptor.getCnValidation(data)));
  }

  getNewCnValidationByRuleId() {
    const data = CnValidationAdaptor.getCnValidation(false);
    return data;
  }

  getCreditNoteType() {
    const url = getCreditNoteTypeUrl();
    return this.apiService
      .get(url)
      .pipe(map(data => CnValidationAdaptor.getCnTypeList(data)));
  }
}
