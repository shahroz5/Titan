import {
  LoadTaxMasterListingPayload,
  TaxMasterDetails
} from '@poss-web/shared/models';
import * as actions from './tax-master.actions';
import { TaxMasterState } from './tax-master.state';
import { initialState as istate, TaxMasterReducer } from './tax-master.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Tax Master Reducer Testing Suite', () => {
  const initialState: TaxMasterState = { ...istate, taxMasterListing: [] };

  const responsePayload: TaxMasterDetails = {
    description: 'desc',
    isActive: true,
    taxCode: 'code',
    taxSystem: 'VAT'
  };

  describe('Testing LoadTaxMasterListing Functionality', () => {
    it('LoadTaxMasterListing should be called', () => {

      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const action = new actions.LoadTaxMasterListing(payload);

      const result: TaxMasterState = TaxMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTaxMasterListingSuccess should return list', () => {
      const action = new actions.LoadTaxMasterListingSuccess({
        taxMasterListing: [responsePayload],
        totalElements: 0
      });
      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.taxMasterListing[0].isActive).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('LoadTaxMasterListingFailure should return error', () => {
      const action = new actions.LoadTaxMasterListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing LoadTaxMasterDetailsByTaxCode Functionality', () => {
    it('LoadTaxMasterDetailsByTaxCode should be called', () => {
      const action = new actions.LoadTaxMasterDetailsByTaxCode('');

      const result: TaxMasterState = TaxMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTaxMasterDetailsByTaxCodeSuccess should return list', () => {
      const action = new actions.LoadTaxMasterDetailsByTaxCodeSuccess(responsePayload);
      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.taxMasterDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTaxMasterDetailsByTaxCodeFailure should return error', () => {
      const action = new actions.LoadTaxMasterDetailsByTaxCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing SaveTaxMasterFormDetails Functionality', () => {
    it('SaveTaxMasterFormDetails should be called', () => {
      const action = new actions.SaveTaxMasterFormDetails(responsePayload);

      const result: TaxMasterState = TaxMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTaxMasterFormDetailsSuccess should return list', () => {
      const action = new actions.SaveTaxMasterFormDetailsSuccess(responsePayload);
      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.saveTaxMasterResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveTaxMasterFormDetailsFailure should return error', () => {
      const action = new actions.SaveTaxMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing EditTaxMasterFormDetails Functionality', () => {
    it('EditTaxMasterFormDetails should be called', () => {
      const action = new actions.EditTaxMasterFormDetails(responsePayload);

      const result: TaxMasterState = TaxMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditTaxMasterFormDetailsSuccess should return list', () => {
      const action = new actions.EditTaxMasterFormDetailsSuccess(responsePayload);
      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.editTaxMasterResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditTaxMasterFormDetailsFailure should return error', () => {
      const action = new actions.EditTaxMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing SearchTaxMasterCode Functionality', () => {
    it('SearchTaxMasterCode should be called', () => {
      const action = new actions.SearchTaxMasterCode('');

      const result: TaxMasterState = TaxMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTaxMasterCodeSuccess should return list', () => {
      const action = new actions.SearchTaxMasterCodeSuccess([responsePayload]);
      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.taxMasterListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTaxMasterCodeFailure should return error', () => {
      const action = new actions.SearchTaxMasterCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxMasterState = TaxMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });



});
