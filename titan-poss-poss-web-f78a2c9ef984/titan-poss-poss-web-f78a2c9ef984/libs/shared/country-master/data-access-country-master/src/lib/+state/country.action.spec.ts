import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadCountryListingPayload,
  CustomErrors,
  LoadCountryListingSuccessPayload,
  CountryDetails,
  SaveCountryFormDetailsPayload,
  CountryMaster,
  CountryNameData,
  CurrencyCodeData,
  CurrencyList,
  Lov
} from '@poss-web/shared/models';
import {
  CountryActionTypes,
  LoadCountryDetails,
  LoadCountryDetailsSuccess,
  LoadCountryDetailsFailure,
  LoadCountryByCountryCode,
  LoadCountryByCountryCodeSuccess,
  LoadCountryByCountryCodeFailure,
  ResetCountryDialog,
  SaveCountryFormDetails,
  SaveCountryFormDetailsFailure,
  EditCountryFormDetails,
  EditCountryFormDetailsSuccess,
  EditCountryFormDetailsFailure,
  SaveCountryFormDetailsSuccess,
  SearchCountryCode,
  SearchCountryCodeSuccess,
  SearchCountryCodeFailure,
  LoadCurrencyCode,
  LoadCurrencyCodeSuccess,
  LoadCurrencyCodeFailure,
  LoadTimeFormatsFailure,
  LoadTimeFormatsSuccess,
  LoadTimeFormats,
  LoadDateFormatsSuccess,
  LoadDateFormats,
  LoadDateFormatsFailure
} from './country.action';

describe('Country Action Testing Suite', () => {
  describe('LoadStoneTypeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCountryDetails action ', () => {
      const payload: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCountryDetails(payload);
      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_COUNTRY_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadCountryDetailsSuccess action ', () => {
      const payload: LoadCountryListingSuccessPayload = {
        countryListing: [],
        totalElements: 0
      };
      const action = new LoadCountryDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_COUNTRY_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCountryDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_COUNTRY_LISTING_FAILURE,
        payload
      });
    });
  });

  // stone type by stone type code
  describe('LoadStoneTypeByStoneTypeCode Action Test Cases', () => {
    it('should check correct type is used for  LoadCountryByCountryCode action ', () => {
      const payload = 'abc';
      const action = new LoadCountryByCountryCode(payload);
      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE,
        payload
      });
    });
    it('should check correct type is used for LoadCountryByCountryCodeSuccess action ', () => {
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
      const action = new LoadCountryByCountryCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCountryByCountryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryByCountryCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_FAILURE,
        payload
      });
    });
  });

  describe('EditStoneTypeFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditStoneTypeFormDetails action ', () => {
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
      const action = new EditCountryFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditCountryFormDetailsSuccess action ', () => {
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

      const action = new EditCountryFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditCountryDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditCountryFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveStoneTypeFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveStoneTypeFormDetails action ', () => {
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
      const action = new SaveCountryFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveStoneTypeFormDetailsSuccess action ', () => {
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

      const action = new SaveCountryFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveCountryFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCountryFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchStoneTypeCode Action Test Cases', () => {
    it('should check correct type is used for  SearchStoneTypeCode action ', () => {
      const payload = 'ABC';
      const action = new SearchCountryCode(payload);
      expect({ ...action }).toEqual({
        type: CountryActionTypes.SEARCH_COUNTRY_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchCountryCodeSuccess action ', () => {
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
      const action = new SearchCountryCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.SEARCH_COUNTRY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchStoneTypeCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCountryCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.SEARCH_COUNTRY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadCurrencyCode Action Test Cases', () => {
    it('should check correct type is used for  LoadCurrencyCode action ', () => {
      const action = new LoadCurrencyCode();
      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_CURRENCY_CODE
      });
    });
    it('should check correct type is used for LoadCurrencyCodeSuccess action ', () => {
      const payload: CurrencyList[] = [
        {
          description: 'abc',
          currencyCode: 'abc'
        }
      ];

      const action = new LoadCurrencyCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_CURRENCY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCurrencyCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCurrencyCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_CURRENCY_CODE_FAILURE,
        payload
      });
    });
  });
  describe('LoadTimeFormats Action Test Cases', () => {
    it('should check correct type is used for  LoadTimeFormats action ', () => {
      const action = new LoadTimeFormats();
      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_TIME_FORMATS
      });
    });
    it('should check correct type is used for LoadTimeFormatsSuccess action ', () => {
      const payload: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];

      const action = new LoadTimeFormatsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_TIME_FORMATS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTimeFormatsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTimeFormatsFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_TIME_FORMATS_FAILURE,
        payload
      });
    });
  });

  describe('LoadDateFormats Action Test Cases', () => {
    it('should check correct type is used for  LoadDateFormats action ', () => {
      const action = new LoadDateFormats();
      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_DATE_FORMATS
      });
    });
    it('should check correct type is used for LoadDateFormatsSuccess action ', () => {
      const payload: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];

      const action = new LoadDateFormatsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_DATE_FORMATS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDateFormatsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDateFormatsFailure(payload);

      expect({ ...action }).toEqual({
        type: CountryActionTypes.LOAD_DATE_FORMATS_FAILURE,
        payload
      });
    });
  });
  describe('ResetCountryDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetCountryDialog action ', () => {
      const action = new ResetCountryDialog();
      expect({ ...action }).toEqual({
        type: CountryActionTypes.RESET_COUNTRY_DIALOG_DATA
      });
    });
  });
});
