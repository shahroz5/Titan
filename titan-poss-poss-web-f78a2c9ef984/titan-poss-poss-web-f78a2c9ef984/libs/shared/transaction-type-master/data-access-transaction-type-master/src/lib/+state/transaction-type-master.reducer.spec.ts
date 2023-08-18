import {
  LoadTransactionTypeMasterListingPayload,
  LoadTransactionTypeMasterListingSuccessPayload,
  TransactionTypeMasterDetails
} from '@poss-web/shared/models';
import * as actions from './transaction-type-master.actions';
import { TransactionTypeMasterState } from './transaction-type-master.state';
import { TransactionTypeMasterReducer, initialState as istate } from './transaction-type-master.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Product Category Reducer Testing Suite', () => {
  const initialState: TransactionTypeMasterState = { ...istate, transactionTypeMasterListing: [] };

  const responsePayload: LoadTransactionTypeMasterListingSuccessPayload = {
    transactionTypeMasterListing: [
      {
        code: 'code',
        isActive: true,
        value: 'value'
      }
    ],
    totalElements: 8
  };

  describe('Testing LoadTransactionTypeMasterListing Functionality', () => {
    it('LoadTransactionTypeMasterListing should be called', () => {

      const payload2: LoadTransactionTypeMasterListingPayload = {
        pageIndex: 1,
        pageSize: 8
      };

      const action = new actions.LoadTransactionTypeMasterListing(payload2);

      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTransactionTypeMasterListingSuccess should return list', () => {
      const action = new actions.LoadTransactionTypeMasterListingSuccess(responsePayload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);

      expect(result.transactionTypeMasterListing[0].value).toBe('value');
      expect(result.isLoading).toBe(false);
    });
    it('LoadTransactionTypeMasterListingFailure should return error', () => {
      const action = new actions.LoadTransactionTypeMasterListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing LoadTransactionTypeMasterByCode Functionality', () => {
    it('LoadTransactionTypeMasterByCode should be called', () => {
      const action = new actions.LoadTransactionTypeMasterByCode('1');

      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTransactionTypeMasterByCodeSuccess should return list', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };
      const action = new actions.LoadTransactionTypeMasterByCodeSuccess(payload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);

      expect(result.transactionTypeMasterDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryByProductCategoryCodeFailure should return error', () => {
      const action = new actions.LoadTransactionTypeMasterByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing SaveTransactionTypeMasterFormDetails Functionality', () => {
    it('SaveTransactionTypeMasterFormDetails should be called', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new actions.SaveTransactionTypeMasterFormDetails(payload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTransactionTypeMasterFormDetails should return', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new actions.SaveTransactionTypeMasterFormDetailsSuccess(payload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.saveResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryByProductCategoryCodeFailure should return error', () => {
      const action = new actions.SaveTransactionTypeMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditTransactionTypeMasterFormDetails Functionality', () => {
    it('EditTransactionTypeMasterFormDetails should be called', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new actions.EditTransactionTypeMasterFormDetails(payload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditTransactionTypeMasterFormDetailsSuccess should return', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new actions.EditTransactionTypeMasterFormDetailsSuccess(payload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.editResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditTransactionTypeMasterFormDetailsFailure should return error', () => {
      const action = new actions.EditTransactionTypeMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchTransactionTypeMasterCode Functionality', () => {
    it('SearchTransactionTypeMasterCode should be called', () => {

      const action = new actions.SearchTransactionTypeMasterCode('');
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTransactionTypeMasterCodeSuccess should return list', () => {

      const action = new actions.SearchTransactionTypeMasterCodeSuccess(responsePayload);
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.transactionTypeMasterListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTransactionTypeMasterCodeFailure should return error', () => {
      const action = new actions.SearchTransactionTypeMasterCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TransactionTypeMasterState = TransactionTypeMasterReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });


});
