import {
  ActiveConfig,
  CountryList,
  CurrencyList
} from '@poss-web/shared/models';

export class LocationMappingAdpator {
  static getActiveConfig(data: any, isConfig: boolean): ActiveConfig {
    return {
      locationCode: data.locationCode,
      configId: isConfig ? data.configId : data.ruleId,
      configName: isConfig ? data.configName : data.ruleName
    };
  }

  static countryLiteDataFromJson(data: any): CountryList {
    return {
      countryCode: data.countryCode,
      description: data.description
    };
  }

  static currenciesLiteDataFromJson(data: any): CurrencyList {
    return {
      currencyCode: data.currencyCode,
      description: data.description
    };
  }
}
