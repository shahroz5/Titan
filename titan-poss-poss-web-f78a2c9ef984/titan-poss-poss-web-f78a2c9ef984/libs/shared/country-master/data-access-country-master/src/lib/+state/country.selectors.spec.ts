import {
  CountryDetails,
  CountryMaster,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';
import { CountryState } from './country.state';
import { initialState } from './country.reducer';
import * as selectors from './country.selectors';

describe('Country selector Testing Suite', () => {
  const createCountry = (
    countryCode: string,
    description: string,
    isdCode: string,
    dateFormat: string,
    phoneLength: string,
    locale: string,
    timeFormat: string,
    isActive: boolean
  ): CountryDetails => {
    return {
      countryCode,
      description,
      isdCode,
      dateFormat,
      phoneLength,
      locale,
      timeFormat,
      isActive
    };
  };

  const country1 = createCountry(
    'country1',
    'country1',
    'country1',
    'country1',
    'country1',
    'country1',
    'country1',
    true
  );

  const country2 = createCountry(
    'country2',
    'country2',
    'country2',
    'country2',
    'country2',
    'country2',
    'country2',
    true
  );

  const countryArray = [country1, country2];

  const countryMaster = {
    countryCode: 'ABC',
    description: 'ABC',
    currencyCode: 'ABC',
    dateFormat: 'ABC',
    fiscalYearStart: 'ABC',
    fiscalYearEnd: 'ABC',
    isdCode: 'ABC',
    phoneLength: 'ABC',
    locale: 'ABC',
    timeFormat: 'ABC',
    isActive: true
  };

  const CountryNameData = {
    id: 'aaa',
    name: 'aaa'
  };
  const CurrencyCodeData = {
    description: 'aaa',
    currencyCode: 'aaa'
  };
  const lovData: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing Country master related Selectors', () => {
    it('Should return the list of Countries ', () => {
      const state: CountryState = {
        ...initialState,
        countryListing: countryArray
      };
      expect(
        selectors.CountrySelectors.selectCountryDetailsListing.projector(state)
      ).toEqual(countryArray);
    });
    it('Should return the true or false', () => {
      const state: CountryState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CountrySelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: CountryState = {
        ...initialState,
        totalCountryDetails: 0
      };
      expect(
        selectors.CountrySelectors.selectTotalCountryDetailsCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: CountryState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.CountrySelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the error object', () => {
      const payload: CountryMaster = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };

      const state: CountryState = {
        ...initialState,
        saveCountryResponses: payload
      };
      expect(
        selectors.CountrySelectors.selectSaveCountryFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should return the Country object', () => {
      const state: CountryState = {
        ...initialState,
        countryDetails: country1
      };
      expect(
        selectors.CountrySelectors.selectCountryDetailsByCountryCode.projector(
          state
        )
      ).toEqual(country1);
    });

    // it('Should save the Country', () => {
    //   const state: CountryState = {
    //     ...initialState,
    //     saveCountryResponses: countryMaster
    //   };
    //   expect(
    //     selectors.CountrySelectors.selectSaveCountryFormResponse.projector(
    //       state
    //     )
    //   ).toEqual(countryMaster);
    // });
    it('Should edit the Country', () => {
      const state: CountryState = {
        ...initialState,
        editCountryResponses: countryMaster
      };
      expect(
        selectors.CountrySelectors.selectEditCountryFormResponse.projector(
          state
        )
      ).toEqual(countryMaster);
    });
  });
  it('Should  return time formats', () => {
    const state: CountryState = {
      ...initialState,
      timeFormats: lovData
    };
    expect(
      selectors.CountrySelectors.selectTimeFormats.projector(state)
    ).toEqual(lovData);
  });
  it('Should  return date formats', () => {
    const state: CountryState = {
      ...initialState,
      dateFormats: lovData
    };
    expect(
      selectors.CountrySelectors.selectDateFormats.projector(state)
    ).toEqual(lovData);
  });
  it(' Should return Currency codes', () => {
    const state: CountryState = {
      ...initialState,
      currencyCode: [CurrencyCodeData]
    };
    expect(
      selectors.CountrySelectors.selectCurrencyCode.projector(state)
    ).toEqual([CurrencyCodeData]);
  });
});
