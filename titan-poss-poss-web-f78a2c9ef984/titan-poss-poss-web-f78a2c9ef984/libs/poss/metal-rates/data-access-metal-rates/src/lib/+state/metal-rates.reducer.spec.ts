import {
  CustomErrors,
  MetalRateUpdateRequestPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './metal-rates.actions';
import { initialState, MetalRatesReducer } from './metal-rates.reducer';
import { MetalRatesState } from './metal-rates.state';

describe('Metal Rates Update Reducer Testing Suite', () => {
  describe('Testing LoadBodBusinessDate Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_BOD_BUSINESS_DATE', () => {
      const action = new actions.LoadBodBusinessDate();
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_BOD_BUSINESS_DATE_SUCCESS', () => {
      const businessDate = 123456789;

      const action = new actions.LoadBodBusinessDateSuccess(businessDate);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.bodBusinessDate).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_BOD_BUSINESS_DATE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBodBusinessDateFailure(payload);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadEodBusinessDate Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_EOD_BUSINESS_DATE', () => {
      const action = new actions.LoadEodBusinessDate();
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.eodBusinessDate).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_EOD_BUSINESS_DATE_SUCCESS', () => {
      const businessDate = 123456789;

      const action = new actions.LoadEodBusinessDateSuccess(businessDate);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.eodBusinessDate).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_EOD_BUSINESS_DATE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadEodBusinessDateFailure(payload);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.eodBusinessDate).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadAvailableMetalRates Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_AVAILABLE_METAL_RATES', () => {
      const businessDate = 123456789;

      const action = new actions.LoadAvailableMetalRates(businessDate);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.goldRateAvailableForBusinessDay).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_AVAILABLE_METAL_RATES_SUCCESS', () => {
      const action = new actions.LoadAvailableMetalRatesSuccess(true);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.goldRateAvailableForBusinessDay).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_AVAILABLE_METAL_RATES_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAvailableMetalRatesFailure(payload);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.goldRateAvailableForBusinessDay).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SaveMetalRates Functionality', () => {
    beforeEach(() => {});

    it('Testing SAVE_METAL_RATES', () => {
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

      const action = new actions.SaveMetalRates(payload);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.metalRatesUpdatedInBoutique).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing SAVE_METAL_RATES_SUCCESS', () => {
      const action = new actions.SaveMetalRatesSuccess(true);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.metalRatesUpdatedInBoutique).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing SAVE_METAL_RATES_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SaveMetalRatesFailure(payload);
      const result: MetalRatesState = MetalRatesReducer(initialState, action);
      expect(result.metalRatesUpdatedInBoutique).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing ResetState Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET', () => {
      const action = new actions.ResetState();
      const result: MetalRatesState = MetalRatesReducer(initialState, action);

      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.goldRateAvailableForBusinessDay).toBe(false);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.eodBusinessDate).toBe(null);
      expect(result.metalRatesUpdatedInBoutique).toBe(false);
    });
  });
});
