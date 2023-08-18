import { Country, CountrySummary } from '@poss-web/shared/models';

export class CountryDataAdaptor {
  static countryDataFromJson(data: any): Country[] {
    const countryData: Country[] = [];
    for (const country of data.results) {
      countryData.push({
        id: country.id,
        countryCode: country.countryCode,
        currencyCode: country.currencyCode,
        dateFormat: country.dateFormat,
        description: country.description,
        isActive: country.isActive,
        locale: country.locale,
        phoneLength: country.phoneLength,
        timeFormat: country.timeFormat,
        isdCode: country.isdCode
      });
    }
    return countryData;
  }

  static countryFromJson(data: any): Country {
    if (!data) {
      return null;
    }

    const country: Country = {
      id: data.id,
      countryCode: data.countryCode,
      currencyCode: data.currencyCode,
      dateFormat: data.dateFormat,
      description: data.description,
      isActive: data.isActive,
      locale: data.locale,
      phoneLength: data.phoneLength,
      timeFormat: data.timeFormat,
      isdCode: data.isdCode,
      fiscalYear: data.fiscalYear
    };
    return country;
  }
  static countrySummaryDataFromJson(data: any): CountrySummary[] {
    const currencyCodes: CountrySummary[] = [];
    for (const country of data.results) {
      currencyCodes.push({
        countryCode: country.countryCode,
        description: country.description,
        isdCode: country.isdCode
      });
    }
    return currencyCodes;
  }


}
