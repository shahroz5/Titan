import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  CurrencyDetails,
  LoadCurrencyListingPayload,
  LoadCurrencyListingSuccessPayload,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';
import {
  CurrencyActionTypes,
  LoadCurrencyDetails,
  LoadCurrencyDetailsSuccess,
  LoadCurrencyDetailsFailure,
  LoadCurrencyDetailsByCurrencyCode,
  LoadCurrencyDetailsByCurrencyCodeSuccess,
  LoadCurrencyDetailsByCurrencyCodeFailure,
  ResetCurrencyDialog,
  SaveCurrencyFormDetails,
  SaveCurrencyFormDetailsSuccess,
  SaveCurrencyFormDetailsFailure,
  EditCurrencyFormDetails,
  EditCurrencyFormDetailsSuccess,
  EditCurrencyFormDetailsFailure,
  SearchCurrency,
  SearchCurrencySuccess,
  SearchCurrencyFailure
} from './currency.action';
import * as moment from 'moment';

describe('Currency Action Testing Suite', () => {
  describe('LoadCurrency Action Test Cases', () => {
    it('should check correct type is used for  LoadCurrencyDetails action ', () => {
      const payload: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCurrencyDetails(payload);
      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.LOAD_CURRENCY_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadCurrencyDetailsSuccess action ', () => {
      const payload: LoadCurrencyListingSuccessPayload = {
        currencyListing: [],
        totalElements: 0
      };
      const action = new LoadCurrencyDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.LOAD_CURRENCY_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCurrencyDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCurrencyDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.LOAD_CURRENCY_LISTING_FAILURE,
        payload
      });
    });
  });

  // Currency by currency code
  describe(' LoadCurrencyDetailsByCurrencyCode Action Test Cases', () => {
    it('should check correct type is used for   LoadCurrencyDetailsByCurrencyCode action ', () => {
      const payload = 'abc';
      const action = new LoadCurrencyDetailsByCurrencyCode(payload);
      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE,
        payload
      });
    });
    it('should check correct type is used for  LoadCurrencyDetailsByCurrencyCodeSuccess action ', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const action = new LoadCurrencyDetailsByCurrencyCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for   LoadCurrencyDetailsByCurrencyCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCurrencyDetailsByCurrencyCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_FAILURE,
        payload
      });
    });
  });

  describe('EditCurrencyFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditCurrencyFormDetails action ', () => {
      const payload: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const action = new EditCurrencyFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditCurrencyFormDetailsSuccess action ', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };

      const action = new EditCurrencyFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditCurrencyFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditCurrencyFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveCurrencyFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveCurrencyFormDetails action ', () => {
      const payload: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const action = new SaveCurrencyFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveCurrencyFormDetailsSuccess action ', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };

      const action = new SaveCurrencyFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveCurrencyFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCurrencyFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchCurrency Action Test Cases', () => {
    it('should check correct type is used for  SearchCurrency action ', () => {
      const payload = 'ABC';
      const action = new SearchCurrency(payload);
      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.SEARCH_CURRENCY_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchCurrencySuccess action ', () => {
      const payload: CurrencyDetails[] = [
        {
          currencyCode: 'ABC',
          currencySymbol: 'ABC',
          description: 'ABC',
          isActive: true,
          unicode: 'ABC',
          lastModifiedDate: moment()
        }
      ];
      const action = new SearchCurrencySuccess(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.SEARCH_CURRENCY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCurrencyFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCurrencyFailure(payload);

      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.SEARCH_CURRENCY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('ResetCurrencyDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetCurrencyDialog action ', () => {
      const action = new ResetCurrencyDialog();
      expect({ ...action }).toEqual({
        type: CurrencyActionTypes.RESET_CURRENCY_DIALOG_DATA
      });
    });
  });
});
