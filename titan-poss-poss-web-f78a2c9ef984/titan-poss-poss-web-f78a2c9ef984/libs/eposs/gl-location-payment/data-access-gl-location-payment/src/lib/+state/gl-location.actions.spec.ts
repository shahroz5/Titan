import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  GLLocationPaymentList,
  SaveGlLocationPayments,
  GLLocationPaymentListPayload,
  GLLocationPaymentSuccessList,
  PaymentCodes,
  LocationCodeDetails
} from '@poss-web/shared/models';
import {
  GlLocationPaymentActionTypes,
  LoadGlLocationPaymentList,
  LoadGlLocationPaymentListSuccess,
  LoadGlLocationPaymentListFailure,
  SaveGlLocationPayment,
  SaveGlLocationPaymentSuccess,
  SaveGlLocationPaymentFailure,
  LoadPaymentCodes,
  LoadPaymentCodesSuccess,
  LoadPaymentCodesFailure,
  GetLocationCodes,
  GetLocationCodesSuccess,
  GetLocationCodesFailure,
  DeleteGlLocationPayment,
  UpdateGlLocationPayment,
  ResetGlPaymentDetails
} from './gl-location.actions';

describe('GL Location Payment Action Testing Suite', () => {
  describe('LoadCurrency Action Test Cases', () => {
    it('should check correct type is used for  LoadCurrencyDetails action ', () => {
      const payload: GLLocationPaymentListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const locationCode = 'URB';
      const action = new LoadGlLocationPaymentList(payload, locationCode);
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST,
        payload,
        locationCode
      });
    });
    it('should check correct type is used for  LoadGlLocationPaymentListSuccess action ', () => {
      const payload: GLLocationPaymentSuccessList = {
        glLocationPaymentList: [],
        count: 0
      };
      const action = new LoadGlLocationPaymentListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGlLocationPaymentListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGlLocationPaymentListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST_FAILURE,
        payload
      });
    });
  });
  // load payment codes

  describe('LoadCurrency Action Test Cases', () => {
    it('should check correct type is used for  LoadCurrencyDetails action ', () => {
      const action = new LoadPaymentCodes();
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES
      });
    });
    it('should check correct type is used for  LoadPaymentCodesSuccess action ', () => {
      const payload: PaymentCodes[] = [
        {
          value: 'CASH',
          description: 'CASH'
        }
      ];
      const action = new LoadPaymentCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES_FAILURE,
        payload
      });
    });
  });

  // Load location codes

  describe('LoadCurrency Action Test Cases', () => {
    it('should check correct type is used for  LoadCurrencyDetails action ', () => {
      const action = new GetLocationCodes();
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.GET_LOCATIONS
      });
    });
    it('should check correct type is used for  GetLocationCodesSuccess action ', () => {
      const payload: LocationCodeDetails[] = [
        {
          locationCode: 'URB',
          description: 'aaaa'
        }
      ];
      const action = new GetLocationCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.GET_LOCATIONS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  GetLocationCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetLocationCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.GET_LOCATIONS_FAILURE,
        payload
      });
    });
  });

  describe('SaveGlLocationPayment Action Test Cases', () => {
    it('should check correct type is used for  SaveCurrencyFormDetails action ', () => {
      const payload: SaveGlLocationPayments = {
        locationCode: 'URB',
        addLocations: ['URB', 'BGR'],
        addPaymentCodes: ['CASH'],
        removeLocations: ['ADH'],
        removePaymentCodes: ['CHEQUE']
      };
      const action = new SaveGlLocationPayment(payload);
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveGlLocationPaymentSuccess action ', () => {
      const payload: GLLocationPaymentList = {
        id: '4567890',
        glCode: 23456,
        locationCode: 'URB',
        paymentCode: 'CASH',
        lastModified: true
      };

      const action = new SaveGlLocationPaymentSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveGlLocationPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveGlLocationPaymentFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('DeleteGlLocationPayment Action Test Cases', () => {
    it('should check correct type is used for  DeleteGlLocationPayment action ', () => {
      const payload = '12345678';
      const action = new DeleteGlLocationPayment(payload);
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.DELETE_GL_LOCATION_PAYMENT_DETAILS,
        payload
      });
    });
  });
  describe('UpdateGlLocationPayment Action Test Cases', () => {
    it('should check correct type is used for  UpdateGlLocationPayment action ', () => {
      const payload = { id: 'aaaaaa', glCode: 234321, paymentCode: 'aaaaaa' };
      const action = new UpdateGlLocationPayment(payload);
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.UPDATE_GL_LOCATION_PAYMENT_DETAILS,
        payload
      });
    });
  });
  describe('ResetGlPaymentDetails Action Test Cases', () => {
    it('should check correct type is used for  ResetGlPaymentDetails action ', () => {
      const action = new ResetGlPaymentDetails();
      expect({ ...action }).toEqual({
        type: GlLocationPaymentActionTypes.RESET_GL_LOCATION_PAYMENT
      });
    });
  });
});
