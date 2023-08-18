import * as actions from './country.action';
import { initialState, CountryReducer } from './country.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CountryDetails,
  CountryMaster,
  CountryNameData,
  CurrencyCodeData,
  CurrencyList,
  LoadCountryListingPayload,
  LoadCountryListingSuccessPayload,
  Lov,
  SaveCountryFormDetailsPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { CountryState } from './country.state';
describe('Country reducer Testing Suite', () => {
  describe('Testing Load Country details list', () => {
    beforeEach(() => {});
    it('LoadCountryDetails should return list of Country data', () => {
      const payload: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadCountryDetails(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadCountryDetailsSuccess should return list of Country data', () => {
      const payload: LoadCountryListingSuccessPayload = {
        countryListing: [
          {
            countryCode: 'ABC',
            description: 'ABC',
            isdCode: 'ABC',
            dateFormat: 'ABC',
            phoneLength: 'ABC',
            locale: 'ABC',
            timeFormat: 'ABC',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadCountryDetailsSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalCountryDetails).toBe(payload.countryListing.length);
    });

    it('LoadCountryDetailsFailure should return list of Country data', () => {
      const action = new actions.LoadCountryDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Country by Country code

  describe('Testing Load Country details by Country code list', () => {
    beforeEach(() => {});
    it('LoadCountryByCountryCode should return list of Country data', () => {
      const payload = 'AZ';
      const action = new actions.LoadCountryByCountryCode(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadCountryByCountryCodeSuccess should return list of Country data', () => {
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
      const action = new actions.LoadCountryByCountryCodeSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.countryDetails).toBe(payload);
    });

    it('LoadCountryByCountryCodeFailure should return error', () => {
      const action = new actions.LoadCountryByCountryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save country details', () => {
    beforeEach(() => {});
    it('SaveCountryFormDetails should return list of Country', () => {
      const payload: SaveCountryFormDetailsPayload = {
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
      const action = new actions.SaveCountryFormDetails(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SaveCountryFormDetailsSuccess should return list of Country', () => {
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
      const action = new actions.SaveCountryFormDetailsSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveCountryResponses).toBe(payload);
    });

    it('SaveCountryFormDetailsFailure should return error', () => {
      const action = new actions.SaveCountryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing edit Country details', () => {
    beforeEach(() => {});
    it('EditCountryFormDetails should return list Country data', () => {
      const payload: SaveCountryFormDetailsPayload = {
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
      const action = new actions.EditCountryFormDetails(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditCountryFormDetailsSuccess should return list of country data', () => {
      const payload: CountryDetails = {
        countryCode: 'ABC',
        description: 'ABC',
        isdCode: 'ABC',
        dateFormat: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        isActive: true
      };
      const action = new actions.EditCountryFormDetailsSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editCountryResponses).toBe(payload);
    });

    it('EditCountryFormDetailsFailure should return error', () => {
      const action = new actions.EditCountryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing  SearchCountry details by SearchCountry code list', () => {
    beforeEach(() => {});
    it(' SearchCountry should return list of matched Countrycode', () => {
      const payload = 'ABC';
      const action = new actions.SearchCountryCode(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SearchCountrySuccess should return list of Country data', () => {
      const payload: CountryDetails[] = [
        {
          countryCode: 'ABC',
          description: 'ABC',
          isdCode: 'ABC',
          dateFormat: 'ABC',
          phoneLength: 'ABC',
          locale: 'ABC',
          timeFormat: 'ABC',
          isActive: true
        }
      ];
      const action = new actions.SearchCountryCodeSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    });

    it('LoadTimeFormatsSuccess should return lovs', () => {
      const payload: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];

      const action = new actions.LoadTimeFormatsSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.timeFormats).toEqual(action.payload);
    });
    it('LoadDateFormatsSuccess should return lovs', () => {
      const payload: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];

      const action = new actions.LoadDateFormatsSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.dateFormats).toEqual(action.payload);
    });

    it('SearchCountryFailure should return error', () => {
      const action = new actions.SearchCountryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // describe('Testing  LoadCountryName details by LoadCountryName code list', () => {
  //   beforeEach(() => {});
  //   it(' LoadCountryName should return list of matched Countrycode', () => {
  //     const action = new actions.LoadCountryName();
  //     const result: CountryState = CountryReducer(initialState, action);
  //     expect(result.isLoading).toBe(true);
  //   });

  //   it('LoadCountryNameSuccess should return list of Country data', () => {
  //     const payload: CountryNameData[] = [
  //       {
  //         id: 'ABC',
  //         name: 'ABC'
  //       }
  //     ];
  //     const action = new actions.LoadCountryNameSuccess(payload);
  //     const result: CountryState = CountryReducer(initialState, action);
  //     expect(result.isLoading).toBe(false);
  //   });

  //   it('LoadCountryNameFailure should return error', () => {
  //     const action = new actions.LoadCountryNameFailure(
  //       CustomErrorAdaptor.fromJson(Error('some error'))
  //     );
  //     const result: CountryState = CountryReducer(initialState, action);
  //     expect(result.error.message).toEqual('some error');
  //   });
  // });

  describe('Testing  LoadCurrencyCode details by LoadCurrencyCode code list', () => {
    beforeEach(() => {});
    it(' LoadCurrencyCode should return list of matched Countrycode', () => {
      const action = new actions.LoadCurrencyCode();
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadCurrencyCodeSuccess should return list of Country data', () => {
      const payload: CurrencyList[] = [
        {
          description: 'ABC',
          currencyCode: 'ABC'
        }
      ];
      const action = new actions.LoadCurrencyCodeSuccess(payload);
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    });

    it('LoadCurrencyCodeFailure should return error', () => {
      const action = new actions.LoadCurrencyCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CountryState = CountryReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetCountryDialog ', () => {
    beforeEach(() => {});
    it('ResetCountryDialog should reset the store', () => {
      const action = new actions.ResetCountryDialog();
      const result: CountryState = CountryReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
