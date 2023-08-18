import * as selectors from './transaction-type-master.selectors';
import {
  CustomErrors,
  RequestList,
  IssueAdvanceFilterPayload,
  CashPaymentConfiguration,
  TransactionTypeMasterDetails
} from '@poss-web/shared/models';
import { initialState } from './transaction-type-master.reducer';
import { TransactionTypeMasterState } from './transaction-type-master.state';

describe('Product Category Selector Testing Suite', () => {

  const payload: CashPaymentConfiguration = {
    description: 'Desc',
    isActive: true,
    ruleDetails: null,
    ruleId: 1,
    ruleType: 'T'
  };

  describe('Testing selectTransactionTypeMasterListing Related Selectors', () => {
    it('should return selectTransactionTypeMasterListing Selector', () => {

      const state: TransactionTypeMasterState = {
        ...initialState,
        transactionTypeMasterListing: []
      };
      expect(
        selectors.TransactionTypeMasterSelectors.selectTransactionTypeMasterListing.projector(
          state
        )
      ).toEqual([]);
    });
  });

  describe('Testing selectTotalTransactionTypeMasterDetailsCount Related Selectors', () => {
    it('should return selectTotalTransactionTypeMasterDetailsCount Selector', () => {
      const state: TransactionTypeMasterState = {
        ...initialState,
        totalTransactionTypeMasterDetails: 1
      };
      expect(
        selectors.TransactionTypeMasterSelectors.selectTotalTransactionTypeMasterDetailsCount.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TransactionTypeMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.TransactionTypeMasterSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectTransactionTypeMasterDetails Related Selectors', () => {
    it('should return selectTransactionTypeMasterDetails Selector', () => {
      const dataPayload: TransactionTypeMasterDetails = {
        code: 'code',
        isActive: true,
        value: 'value'
      }
      const state: TransactionTypeMasterState = {
        ...initialState,
        transactionTypeMasterDetails: dataPayload
      };
      expect(
        selectors.TransactionTypeMasterSelectors.selectTransactionTypeMasterDetails.projector(
          state
        )
      ).toEqual(dataPayload);
    });
  });

  describe('Testing selectSaveResponse Related Selectors', () => {
    it('should return selectSaveResponse Selector', () => {
      const dataPayload: TransactionTypeMasterDetails = {
        code: 'code',
        isActive: true,
        value: 'value'
      }
      const state: TransactionTypeMasterState = {
        ...initialState,
        saveResponses: dataPayload
      };
      expect(
        selectors.TransactionTypeMasterSelectors.selectSaveResponse.projector(
          state
        )
      ).toEqual(dataPayload);
    });
  });

  describe('Testing selectEditResponse Related Selectors', () => {
    it('should return selectEditResponse Selector', () => {
      const dataPayload: TransactionTypeMasterDetails = {
        code: 'code',
        isActive: true,
        value: 'value'
      }
      const state: TransactionTypeMasterState = {
        ...initialState,
        editResponses: dataPayload
      };
      expect(
        selectors.TransactionTypeMasterSelectors.selectEditResponse.projector(
          state
        )
      ).toEqual(dataPayload);
    });
  });

});
