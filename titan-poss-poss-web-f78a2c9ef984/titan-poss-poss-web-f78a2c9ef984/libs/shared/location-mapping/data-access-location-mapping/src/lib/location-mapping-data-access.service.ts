import { Injectable } from '@angular/core';
import {
  ApiService,
  getMappedLocationByConfigIdUrl,
  getRuleTypeActiveConfigUrl,
  getPaymentConfigLocationMappingUrlByIdUrl,
  getExchangeActiveConfigsUrl,
  getExchangeConfigByIdUrl,
  getPayerBankActiveConfigsUrl,
  getPayerBankConfigByIdUrl,
  getPaymentActiveConfigsUrl
} from '@poss-web/shared/util-api-service';

import {
  IbtConfiguration,
  LoadActiveConfigsPayload,
  ActiveConfig,
  UpdateLocationMappingPayload,
  LoadMappedLocationsPayload,
  LocationMappingOption,
  ConfigTypeEnum
} from '@poss-web/shared/models';

import { map } from 'rxjs/Operators';
import { Observable } from 'rxjs';
import { LocationMappingHelper } from '@poss-web/shared/util-adaptors';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LocationMappingDataAccessService {
  configDetails: IbtConfiguration;
  constructor(private apiService: ApiService) {}

  loadActiveConfigs(
    payload: LoadActiveConfigsPayload
  ): Observable<ActiveConfig[]> {
    let url: {
      path: string;
      params: HttpParams;
    };
    if (this.isPaymentConfig(payload.ruleType)) {
      url = getPaymentActiveConfigsUrl(payload.ruleType);
    } else if (this.isGEPConfig(payload.ruleType)) {
      url = getExchangeActiveConfigsUrl(payload.ruleType);
    } else if (this.isPayerBankConfig(payload.ruleType)) {
      url = getPayerBankActiveConfigsUrl();
    } else {
      url = getRuleTypeActiveConfigUrl(payload.ruleType);
    }

    const isConfig =
      this.isPaymentConfig(payload.ruleType) ||
      this.isGEPConfig(payload.ruleType) ||
      this.isPayerBankConfig(payload.ruleType);
    return this.apiService
      .post(
        url.path,
        this.createActiveConfigPayload(payload.data, isConfig),
        url.params
      )
      .pipe(
        map(data => LocationMappingHelper.getActiveConfigs(data, isConfig))
      );
  }

  updateLocationMapping(payload: UpdateLocationMappingPayload) {
    let url: {
      path: string;
      params: HttpParams;
    };
    if (this.isPaymentConfig(payload.ruleType)) {
      url = getPaymentConfigLocationMappingUrlByIdUrl(
        payload.ruleID,
        payload.ruleType
      );
    } else if (this.isGEPConfig(payload.ruleType)) {
      url = getExchangeConfigByIdUrl(payload.ruleID, payload.ruleType);
    } else if (this.isPayerBankConfig(payload.ruleType)) {
      url = getPayerBankConfigByIdUrl(payload.ruleID);
    } else {
      url = getMappedLocationByConfigIdUrl(payload.ruleID, payload.ruleType);
    }
    return this.apiService.patch(url.path, payload.data, url.params);
  }

  getMappedLocations(
    payload: LoadMappedLocationsPayload
  ): Observable<LocationMappingOption[]> {
    let url: {
      path: string;
      params: HttpParams;
    };
    if (this.isPaymentConfig(payload.ruleType)) {
      url = getPaymentConfigLocationMappingUrlByIdUrl(
        payload.ruleID,
        payload.ruleType
      );
    } else if (this.isGEPConfig(payload.ruleType)) {
      url = getExchangeConfigByIdUrl(payload.ruleID, payload.ruleType);
    } else if (this.isPayerBankConfig(payload.ruleType)) {
      url = getPayerBankConfigByIdUrl(payload.ruleID);
    } else {
      url = getMappedLocationByConfigIdUrl(payload.ruleID, payload.ruleType);
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => LocationMappingHelper.getMappedLocations(data)));
  }

  isPaymentConfig(ruleType: ConfigTypeEnum): boolean {
    return (
      ruleType === ConfigTypeEnum.PAYMENT_CONFIGURATIONS ||
      ruleType === ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS
    );
  }

  isGEPConfig(ruleType: ConfigTypeEnum): boolean {
    return (
      ruleType === ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS ||
      ruleType === ConfigTypeEnum.TEP_EXCEPTION ||
      ruleType === ConfigTypeEnum.TEP_VALIDATION ||
      ruleType === ConfigTypeEnum.TEP_ITEM ||
      ruleType === ConfigTypeEnum.TEP_STONE
    );
  }

  isPayerBankConfig(ruleType: ConfigTypeEnum): boolean {
    return ruleType === ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS;
  }

  createActiveConfigPayload(
    data: {
      excludeRuleId?: string;
      includeLocations: string[];
    },
    isConfig: boolean
  ) {
    if (isConfig) {
      return {
        excludeConfigId: data.excludeRuleId,
        includeLocations: data.includeLocations
      };
    } else {
      return {
        excludeRuleId: data.excludeRuleId,
        includeLocations: data.includeLocations
      };
    }
  }
}
