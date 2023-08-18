//you should simply assert that you get the right state given the provided inputs.

import * as actions from './bankPriority.action';

import {
  LoadBankPriorityListingSuccessPayload,
  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { bankPriorityReducer, initialState } from './bankPriority.reducer';
import { BankPriorityState } from './bankPriority.state';

describe('Bank priority reducer Testing Suite', () => {
  describe('Testing LoadBankPriority ', () => {
    beforeEach(() => {});
    it('Load LoadBankPriority should set the isLoading to true', () => {
      const action = new actions.LoadBankPriority();

      const result: BankPriorityState = bankPriorityReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadBankPrioritySuccess should return list of bank with priority', () => {
      const payload: LoadBankPriorityListingSuccessPayload = {
        bankPriorityListing: [
          {
            bankName: 'HDFC',
            priority: '1'
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadBankPrioritySuccess(payload);

      const result: BankPriorityState = bankPriorityReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.bankPriorityListing.length).toBe(1);
    });
    it('LoadBankPriorityFailure should return error', () => {
      const action = new actions.LoadBankPriorityFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BankPriorityState = bankPriorityReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveBankPriority Functionality ', () => {
    beforeEach(() => {});
    it('SaveBankPriority ', () => {
      const payload: SaveBankPriorityFormDetailsPayload = {
        addPriority: [{ bankName: 'HDFC', priority: '2', locationCode: '' }],
        removePriority: []
      };
      const action = new actions.SaveBankPriority(payload);

      const result: BankPriorityState = bankPriorityReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(false);
    });
    it('SaveBankPrioritySuccess should update the hasSaved property to true', () => {
      const action = new actions.SaveBankPrioritySuccess();

      const result: BankPriorityState = bankPriorityReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
    });
    it('SaveBankPriorityFailure should return error', () => {
      const action = new actions.SaveBankPriorityFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BankPriorityState = bankPriorityReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.ResetBankPriorityDialog();

      const result: BankPriorityState = bankPriorityReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
