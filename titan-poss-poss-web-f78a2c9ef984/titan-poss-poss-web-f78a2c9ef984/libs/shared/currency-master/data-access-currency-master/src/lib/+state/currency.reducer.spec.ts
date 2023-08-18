import * as actions from './currency.action';
import { initialState, CurrencyReducer } from './currency.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CurrencyDetails,
  LoadCurrencyListingPayload,
  LoadCurrencyListingSuccessPayload,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { CurrencyState } from './currency.state';
describe('Currency reducer Testing Suite', () => {
  describe('Testing Load Currency details list', () => {
    beforeEach(() => {});
    it('LoadCurrencyDetails should return list of Currency data', () => {
      const payload: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadCurrencyDetails(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadCurrencyDetailsSuccess should return list of Currency data', () => {
      const payload: LoadCurrencyListingSuccessPayload = {
        currencyListing: [
          {
            currencyCode: 'ABC',
            currencySymbol: 'ABC',
            description: 'ABC',
            isActive: true,
            unicode: 'ABC',
            lastModifiedDate: moment()
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadCurrencyDetailsSuccess(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalCurrencyDetails).toBe(payload.currencyListing.length);
    });

    it('LoadCurrencyDetailsFailure should return list of Currency data', () => {
      const action = new actions.LoadCurrencyDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Currency by Currency code

  describe('Testing Load Currency details by Currency code list', () => {
    beforeEach(() => {});
    it('LoadCurrencyDetailsByCurrencyCode should return list of Currency data', () => {
      const payload = 'AZ';
      const action = new actions.LoadCurrencyDetailsByCurrencyCode(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadCurrencyDetailsByCurrencyCodeSuccess should return list of Currency data', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const action = new actions.LoadCurrencyDetailsByCurrencyCodeSuccess(
        payload
      );
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.currencyDetails).toBe(payload);
    });

    it('LoadCurrencyDetailsByCurrencyCodeFailure should return error', () => {
      const action = new actions.LoadCurrencyDetailsByCurrencyCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save currency details', () => {
    beforeEach(() => {});
    it('SaveCurrencyFormDetails should return list of Currency', () => {
      const payload: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const action = new actions.SaveCurrencyFormDetails(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SaveCurrencyFormDetailsSuccess should return list of Currency', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const action = new actions.SaveCurrencyFormDetailsSuccess(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveCurrency).toBe(payload);
    });

    it('SaveCurrencyFormDetailsFailure should return error', () => {
      const action = new actions.SaveCurrencyFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing edit Currency details', () => {
    beforeEach(() => {});
    it('EditCurrencyFormDetails should return list Currency data', () => {
      const payload: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const action = new actions.EditCurrencyFormDetails(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditCurrencyFormDetailsSuccess should return list of currency data', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const action = new actions.EditCurrencyFormDetailsSuccess(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editCurrency).toBe(payload);
    });

    it('EditCurrencyFormDetailsFailure should return error', () => {
      const action = new actions.EditCurrencyFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing  SearchCurrency details by SearchCurrency code list', () => {
    beforeEach(() => {});
    it(' SearchCurrency should return list of matched Currencycode', () => {
      const payload = 'ABC';
      const action = new actions.SearchCurrency(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SearchCurrencySuccess should return list of Currency data', () => {
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
      const action = new actions.SearchCurrencySuccess(payload);
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    });

    it('SearchCurrencyFailure should return error', () => {
      const action = new actions.SearchCurrencyFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetCurrencyDialog ', () => {
    beforeEach(() => {});
    it('ResetCurrencyDialog should reset the store', () => {
      const action = new actions.ResetCurrencyDialog();
      const result: CurrencyState = CurrencyReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
