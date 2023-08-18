import {
  CustomErrors,
  MetalRateUpdateRequestPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadAvailableMetalRates,
  LoadAvailableMetalRatesFailure,
  LoadAvailableMetalRatesSuccess,
  LoadBodBusinessDate,
  LoadBodBusinessDateFailure,
  LoadBodBusinessDateSuccess,
  LoadEodBusinessDate,
  LoadEodBusinessDateFailure,
  LoadEodBusinessDateSuccess,
  MetalRatesActionTypes,
  ResetState,
  SaveMetalRates,
  SaveMetalRatesFailure,
  SaveMetalRatesSuccess
} from './metal-rates.actions';

describe('Metal Rates Update Actions Testing Suite', () => {
  describe('LoadBodBusinessDate Test Cases', () => {
    it('should LoadBodBusinessDate action ', () => {
      const action = new LoadBodBusinessDate();

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE
      });
    });

    it('should check correct type is used for LoadBodBusinessDateSuccess action ', () => {
      const responsePayload = 123456789;
      const action = new LoadBodBusinessDateSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadBodBusinessDateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBodBusinessDateFailure(payload);
      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadEodBusinessDate Test Cases', () => {
    it('should LoadEodBusinessDate action ', () => {
      const action = new LoadEodBusinessDate();

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE
      });
    });

    it('should check correct type is used for LoadEodBusinessDateSuccess action ', () => {
      const responsePayload = 123456789;
      const action = new LoadEodBusinessDateSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadEodBusinessDateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEodBusinessDateFailure(payload);
      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadAvailableMetalRates Test Cases', () => {
    it('should LoadAvailableMetalRates action ', () => {
      const businessDate = 123456789;
      const action = new LoadAvailableMetalRates(businessDate);

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES,
        payload: businessDate
      });
    });

    it('should check correct type is used for LoadAvailableMetalRatesSuccess action ', () => {
      const action = new LoadAvailableMetalRatesSuccess(true);

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES_SUCCESS,
        payload: true
      });
    });

    it('should check correct type is used for  LoadAvailableMetalRatesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableMetalRatesFailure(payload);
      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES_FAILURE,
        payload: payload
      });
    });
  });

  describe('SaveMetalRates Test Cases', () => {
    const payload: MetalRateUpdateRequestPayload = {
      applicableDate: '123456789',
      metalRates: {
        additionalProp1: {
          metalTypeCode: 'J',
          ratePerUnit: 5000
        },
        additionalProp2: {
          metalTypeCode: 'L',
          ratePerUnit: 4500
        },
        additionalProp3: {
          metalTypeCode: 'P',
          ratePerUnit: 899
        }
      },
      password: 'password'
    };

    it('should SaveMetalRates action ', () => {
      const action = new SaveMetalRates(payload);

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.SAVE_METAL_RATES,
        payload: payload
      });
    });

    it('should check correct type is used for SaveMetalRatesSuccess action ', () => {
      const action = new SaveMetalRatesSuccess(payload);

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.SAVE_METAL_RATES_SUCCESS,
        payload: payload
      });
    });

    it('should check correct type is used for  SaveMetalRatesFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveMetalRatesFailure(errorPayload);
      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.SAVE_METAL_RATES_FAILURE,
        payload: errorPayload
      });
    });
  });

  describe('ResetState Test Cases', () => {
    it('should ResetState action ', () => {
      const action = new ResetState();

      expect({ ...action }).toEqual({
        type: MetalRatesActionTypes.RESET
      });
    });
  });
});
