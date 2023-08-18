import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SavePaymentMasterPayload,
  PaymentMasterListPayload,
  PaymentMasterList,
  UpdatePaymentMasterPayload,
  PaymentMaster
} from '@poss-web/shared/models';
import {
  PaymentMasterActionTypes,
  LoadPaymentMasterListSuccess,
  LoadPaymentMasterListFailure,
  SearchPaymentMaster,
  SearchPaymentMasterSuccess,
  SearchPaymentMasterFailure,
  SavePaymentMaster,
  SavePaymentMasterSuccess,
  SavePaymentMasterFailure,
  LoadPaymentMasterByPaymentCode,
  LoadPaymentMasterByPaymentCodeSuccess,
  LoadPaymentMasterByPaymentCodeFailure,
  LoadReset,
  LoadPaymentMasterList,
  UpdatePaymentMaster,
  UpdatePaymentMasterSuccess,
  UpdatePaymentMasterFailure
} from './payment-master.actions';

describe('Payment master Action Testing Suite', () => {
  describe('LoadPaymentMasterList Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentMasterList action ', () => {
      const payload: PaymentMasterListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadPaymentMasterList(payload);
      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentMasterListSuccess action ', () => {
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
      const action = new LoadPaymentMasterListSuccess(payload);

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentMasterListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentMasterListFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchPaymentMaster Action Test Cases', () => {
    it('should check correct type is used for  SearchPaymentMaster action ', () => {
      const payload = 'GPAY';
      const action = new SearchPaymentMaster(payload);
      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER,
        payload
      });
    });
    it('should check correct type is used for SearchPaymentMasterSuccess action ', () => {
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
      const action = new SearchPaymentMasterSuccess(payload);

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchPaymentMasterFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPaymentMasterFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER_FAILURE,
        payload
      });
    });
  });

  describe('SavePaymentMaster Action Test Cases', () => {
    it('should check correct type is used for  SavePaymentMaster action ', () => {
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
      const action = new SavePaymentMaster(payload);
      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.SAVE_PAYMENT_MASTER,
        payload
      });
    });
    it('should check correct type is used for SavePaymentMasterSuccess action ', () => {
      const action = new SavePaymentMasterSuccess();

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.SAVE_PAYMENT_MASTER_SUCCESS
      });
    });
    it('should check correct type is used for  SavePaymentMasterFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePaymentMasterFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.SAVE_PAYMENT_MASTER_FAILURE,
        payload
      });
    });
  });

  describe('UpdatePaymentMaster Action Test Cases', () => {
    it('should check correct type is used for  UpdatePaymentMaster action ', () => {
      const payload: UpdatePaymentMasterPayload = {
        paymentCode: 'GPAY',
        paymentGroup: 'WALLET',
        data: {
          isActive: false
        }
      };
      const action = new UpdatePaymentMaster(payload);
      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER,
        payload
      });
    });
    it('should check correct type is used for SavePaymentMasterSuccess action ', () => {
      const action = new UpdatePaymentMasterSuccess();

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER_SUCCESS
      });
    });
    it('should check correct type is used for  UpdatePaymentMasterFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePaymentMasterFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER_FAILURE,
        payload
      });
    });
  });

  describe('LoadPaymentMasterByPaymentCode Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentMasterByPaymentCode action ', () => {
      const payload = 'GPAY';
      const action = new LoadPaymentMasterByPaymentCode(payload);
      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadPaymentMasterByPaymentCodeSuccess action ', () => {
      const payload: PaymentMaster = {
        paymentCode: 'GPAY',
        type: 'wallet',
        description: 'gogglePay',
        isActive: true,
        referenceOne: 'transactionId',
        customerDependent: true,
        isEditable: false
      };

      const action = new LoadPaymentMasterByPaymentCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentMasterByPaymentCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentMasterByPaymentCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: PaymentMasterActionTypes.LOAD_RESET
      });
    });
  });
});
