import {
  ActiveConfig,
  CountryList,
  CurrencyList,
  LocationMappingOption
} from '@poss-web/shared/models';

import { LocationMappingAdpator } from '../location-mapping/location-mapping.adaptor';


export class LocationMappingHelper {
  static getActiveConfigs(data: any, isConfig: boolean): ActiveConfig[] {
    const activeConfigs: ActiveConfig[] = [];
    for (const config of data.results) {
      activeConfigs.push(
        LocationMappingAdpator.getActiveConfig(config, isConfig)
      );
    }
    return activeConfigs;
  }

  static getCountryList(data: any): CountryList[] {
    const countryList: CountryList[] = [];
    for (const country of data) {
      countryList.push(LocationMappingAdpator.countryLiteDataFromJson(country));
    }
    return countryList;
  }

  static getCurrencyList(data: any): CurrencyList[] {
    const currencyList: CurrencyList[] = [];
    for (const currency of data) {
      currencyList.push(
        LocationMappingAdpator.currenciesLiteDataFromJson(currency)
      );
    }
    return currencyList;
  }

  static getMappedLocations(data: any): LocationMappingOption[] {
    const selectedLocations: LocationMappingOption[] = [];
    for (const locations of data.results) {
      selectedLocations.push({
        id: locations.locationCode,
        description: locations.locationCode
      });
    }

    return selectedLocations;
  }
}
