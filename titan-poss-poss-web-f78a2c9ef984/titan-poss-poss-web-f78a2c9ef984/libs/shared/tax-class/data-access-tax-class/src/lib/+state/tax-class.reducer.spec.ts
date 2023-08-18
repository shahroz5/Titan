import {
  LoadTaxClassListingPayload,
  TaxClassDetails
} from '@poss-web/shared/models';
import * as actions from './tax-class.actions';
import { TaxClassState } from './tax-class.state';
import { initialState as istate, TaxClassReducer } from './tax-class.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Tax Class Reducer Testing Suite', () => {
  const initialState: TaxClassState = { ...istate, taxClassListing: [] };

  const responsePayload: TaxClassDetails = {
    description: 'desc',
    isActive: true,
    taxClassCode: 'code'
  };

  describe('Testing LoadTaxClassListing Functionality', () => {
    it('LoadTaxClassListing should be called', () => {

      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const action = new actions.LoadTaxClassListing(payload);

      const result: TaxClassState = TaxClassReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTaxClassListingSuccess should return list', () => {
      const action = new actions.LoadTaxClassListingSuccess({
        taxClassListing: [responsePayload],
        totalElements: 0
      });
      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.taxClassListing[0].isActive).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('LoadTaxClassListingFailure should return error', () => {
      const action = new actions.LoadTaxClassListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing LoadTaxClassDetailsByTaxClassCode Functionality', () => {
    it('LoadTaxClassDetailsByTaxClassCode should be called', () => {
      const action = new actions.LoadTaxClassDetailsByTaxClassCode('');

      const result: TaxClassState = TaxClassReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTaxClassDetailsByTaxClassCodeSuccess should return list', () => {
      const action = new actions.LoadTaxClassDetailsByTaxClassCodeSuccess(responsePayload);
      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.taxClassDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTaxClassDetailsByTaxClassCodeFailure should return error', () => {
      const action = new actions.LoadTaxClassDetailsByTaxClassCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing SaveTaxClassFormDetails Functionality', () => {
    it('SaveTaxClassFormDetails should be called', () => {
      const action = new actions.SaveTaxClassFormDetails(responsePayload);

      const result: TaxClassState = TaxClassReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTaxClassFormDetails should return list', () => {
      const action = new actions.SaveTaxClassFormDetailsSuccess(responsePayload);
      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.saveTaxClassResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveTaxClassFormDetailsFailure should return error', () => {
      const action = new actions.SaveTaxClassFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing EditTaxClassFormDetails Functionality', () => {
    it('EditTaxClassFormDetails should be called', () => {
      const action = new actions.EditTaxClassFormDetails(responsePayload);

      const result: TaxClassState = TaxClassReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditTaxClassFormDetailsSuccess should return list', () => {
      const action = new actions.EditTaxClassFormDetailsSuccess(responsePayload);
      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.editTaxClassResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditTaxClassFormDetailsFailure should return error', () => {
      const action = new actions.EditTaxClassFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing SearchTaxClassCode Functionality', () => {
    it('SearchTaxClassCode should be called', () => {
      const action = new actions.SearchTaxClassCode('');

      const result: TaxClassState = TaxClassReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTaxClassCodeSuccess should return list', () => {
      const action = new actions.SearchTaxClassCodeSuccess([responsePayload]);
      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.taxClassListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTaxClassCodeFailure should return error', () => {
      const action = new actions.SearchTaxClassCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TaxClassState = TaxClassReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });



});
