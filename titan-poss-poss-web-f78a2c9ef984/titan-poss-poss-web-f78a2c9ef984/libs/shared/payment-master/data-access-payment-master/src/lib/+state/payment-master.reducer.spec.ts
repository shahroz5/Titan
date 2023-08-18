//you should simply assert that you get the right state given the provided inputs.

import * as actions from './payment-master.actions';

import {
  SavePaymentMasterPayload,
  PaymentMasterListPayload,
  PaymentMasterList,
  UpdatePaymentMasterPayload,
  PaymentMaster
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { paymentMasterReducers, initialState } from './payment-master.reducers';
import { PaymentMasterState } from './payment-master.state';

describe('payment master reducer Testing Suite', () => {
  describe('Testing LoadPaymentMasterList ', () => {
    beforeEach(() => {});
    it('Load LoadPaymentMasterList should set the isLoading to true', () => {
      const payload: PaymentMasterListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };

      const action = new actions.LoadPaymentMasterList(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPaymentMasterListSuccess should return list of payment modes', () => {
      const payload: PaymentMasterList = {
        results: [
          {
            paymentCode: 'GPAY',
            type: 'wallet',
            description: 'gogglePay',
            isActive: true,
            referenceOne: 'transactionId',
            customerDependent: true,
            isEditable: false
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadPaymentMasterListSuccess(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentMasterList.length).toBe(1);
    });
    it('LoadPaymentMasterListFailure should return error', () => {
      const action = new actions.LoadPaymentMasterListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SavePaymentMaster Functionality ', () => {
    beforeEach(() => {});
    it('SavePaymentMaster ', () => {
      const payload: SavePaymentMasterPayload = {
        paymentGroup: 'WALLET',
        data: {
          paymentCode: 'gpay',
          description: 'gogglePay',
          isActive: true,

          customerDependent: true,
          fieldDetails: [
            {
              fieldCode: 'transaction_id',
              fieldName: 'transactionid',
              fieldType: null,
              fieldRegex: null
            }
          ]
        }
      };
      const action = new actions.SavePaymentMaster(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(false);
    });
    it('SavePaymentMasterSuccess should update the hasSaved property to true', () => {
      const action = new actions.SavePaymentMasterSuccess();

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
    });
    it('SavePaymentMasterFailure should return error', () => {
      const action = new actions.SavePaymentMasterFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdatePaymentMaster ', () => {
    beforeEach(() => {});
    it('UpdatePaymentMaster ', () => {
      const payload: UpdatePaymentMasterPayload = {
        paymentCode: 'GPAY',
        paymentGroup: 'WALLET',
        data: {
          isActive: false
        }
      };
      const action = new actions.UpdatePaymentMaster(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdatePaymentMasterSuccess should update the hasUpdated property to true', () => {
      const action = new actions.UpdatePaymentMasterSuccess();

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdatePaymentMasterFailure should return error', () => {
      const action = new actions.UpdatePaymentMasterFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPaymentMasterByPaymentCode ', () => {
    beforeEach(() => {});
    it('LoadPaymentMasterByPaymentCode should return the payment mode ', () => {
      const payload = 'GPAY';
      const action = new actions.LoadPaymentMasterByPaymentCode(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPaymentMasterByPaymentCodeSuccess should return the payment mode', () => {
      const payload: PaymentMaster = {
        paymentCode: 'GPAY',
        type: 'wallet',
        description: 'gogglePay',
        isActive: true,
        referenceOne: 'transactionId',
        customerDependent: true,
        isEditable: false
      };

      const action = new actions.LoadPaymentMasterByPaymentCodeSuccess(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentMaster).toEqual(payload);
    });
    it('LoadPaymentMasterByPaymentCodeFailure should return error', () => {
      const action = new actions.LoadPaymentMasterByPaymentCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchPaymentMaster Functionality ', () => {
    beforeEach(() => {});
    it('SearchPaymentMaster should return searched payment mode', () => {
      const payload = 'GPAY';
      const action = new actions.SearchPaymentMaster(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchPaymentMasterSuccess should return searched payment mode', () => {
      const payload: PaymentMasterList = {
        results: [
          {
            paymentCode: 'GPAY',
            type: 'wallet',
            description: 'gogglePay',
            isActive: true,
            referenceOne: 'transactionId',
            customerDependent: true,
            isEditable: false
          }
        ],
        totalElements: 1
      };

      const action = new actions.SearchPaymentMasterSuccess(payload);

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.totalElements).toBe(1);
      expect(result.paymentMasterList.length).toBe(1);
    });
    it('SearchPaymentMasterFailure should return error', () => {
      const action = new actions.SearchPaymentMasterFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: PaymentMasterState = paymentMasterReducers(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
