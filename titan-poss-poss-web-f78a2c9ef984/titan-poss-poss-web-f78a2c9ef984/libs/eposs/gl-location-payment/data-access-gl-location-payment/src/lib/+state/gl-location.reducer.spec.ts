import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './gl-location.actions';
import {
  GLLocationPaymentList,
  SaveGlLocationPayments,
  GLLocationPaymentListPayload,
  GLLocationPaymentSuccessList,
  PaymentCodes,
  LocationCodeDetails
} from '@poss-web/shared/models';
import { GlLocationPaymentState } from './gl-location.state';
import { initialState, GlLocationPaymentReducer } from './gl-location.reducer';
describe('Currency reducer Testing Suite', () => {
  describe('Testing Load Currency details list', () => {
    beforeEach(() => {});
    it('LoadCurrencyDetails should return list of Currency data', () => {
      const payload: GLLocationPaymentListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadGlLocationPaymentList(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadGlLocationPaymentListSuccess should return list of Currency data', () => {
      const payload: GLLocationPaymentSuccessList = {
        glLocationPaymentList: [
          {
            id: '2345678956780',
            glCode: 2345645,
            locationCode: 'URB',
            paymentCode: 'CASH',
            lastModified: true
          }
        ],
        count: 1
      };
      const action = new actions.LoadGlLocationPaymentListSuccess(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.totalCount).toBe(payload.glLocationPaymentList.length);
    });

    it('LoadGlLocationPaymentListFailure should return list of Currency data', () => {
      const action = new actions.LoadGlLocationPaymentListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save SaveGlLocationPayment', () => {
    beforeEach(() => {});
    it('SaveGlLocationPayment should return list of gl locations', () => {
      const payload: SaveGlLocationPayments = {
        locationCode: 'URB',
        addLocations: ['URB', 'BGR'],
        addPaymentCodes: ['CASH'],
        removeLocations: ['ADH'],
        removePaymentCodes: ['CHEQUE']
      };
      const action = new actions.SaveGlLocationPayment(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });

    it('SaveGlLocationPaymentSuccess should return list of Currency', () => {
      const payload: GLLocationPaymentList = {
        id: '4567890',
        glCode: 23456,
        locationCode: 'URB',
        paymentCode: 'CASH',
        lastModified: true
      };
      const action = new actions.SaveGlLocationPaymentSuccess(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.saveGlLocationPayment).toBe(payload);
    });

    it('SaveGlLocationPaymentFailure should return error', () => {
      const action = new actions.SaveGlLocationPaymentFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //   //edit

  describe('Testing edit Currency details', () => {
    beforeEach(() => {});
    it('LoadPaymentCodes should return list Currency data', () => {
      const action = new actions.LoadPaymentCodes();
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadPaymentCodesSuccess should return list of currency data', () => {
      const payload: PaymentCodes[] = [
        {
          value: 'CASH',
          description: 'CASH'
        }
      ];
      const action = new actions.LoadPaymentCodesSuccess(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.paymentCodes).toBe(payload);
    });

    it('LoadPaymentCodesFailure should return error', () => {
      const action = new actions.LoadPaymentCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing edit Currency details', () => {
    beforeEach(() => {});
    it('GetLocationCodes should return list Currency data', () => {
      const action = new actions.GetLocationCodes();
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('GetLocationCodesSuccess should return list of currency data', () => {
      const payload: LocationCodeDetails[] = [
        {
          locationCode: 'URB',
          description: 'aaaa'
        }
      ];
      const action = new actions.GetLocationCodesSuccess(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.locationData).toBe(payload);
    });

    it('GetLocationCodesFailure should return error', () => {
      const action = new actions.GetLocationCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });
  //   //search

  describe('Testing DeleteGlLocationPayment ', () => {
    beforeEach(() => {});
    it('DeleteGlLocationPayment should reset the store', () => {
      const id = '2345678';
      const action = new actions.DeleteGlLocationPayment(id);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing UpdateGlLocationPayment ', () => {
    beforeEach(() => {});
    it('UpdateGlLocationPayment should reset the store', () => {
      const payload = { id: 'aaaaaa', glCode: 234321, paymentCode: 'aaaaaa' };
      const action = new actions.UpdateGlLocationPayment(payload);
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing ResetGlPaymentDetails ', () => {
    beforeEach(() => {});
    it('ResetGlPaymentDetails should reset the store', () => {
      const action = new actions.ResetGlPaymentDetails();
      const result: GlLocationPaymentState = GlLocationPaymentReducer(
        initialState,
        action
      );
      expect(result.hasSaved).toEqual(false);
      expect(result.isLoading).toEqual(false);
    });
  });
});
