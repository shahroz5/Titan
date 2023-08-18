import {
  BodEodEnum,
  ClosedBodResponse,
  CustomErrors,
  MetalRatesAndGoldAvailabilityResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './bod-eod.actions';
import { BodEodReducer, initialState } from './bod-eod.reducer';
import { BodEodState } from './bod-eod.state';

describe('Shared BOD-EOD reducer Testing Suite', () => {
  describe('Testing LoadOpenBusinessDate Functionality', () => {
    beforeEach(() => {});

    it('Testing OPEN_BUSINESS_DATE', () => {
      const action = new actions.LoadOpenBusinessDate();
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.currentDayBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing OPEN_BUSINESS_DATE_SUCCESS', () => {
      const businessDate = 123456789;

      const action = new actions.LoadOpenBusinessDateSuccess(businessDate);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.currentDayBodStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.openBusinessDate).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing OPEN_BUSINESS_DATE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOpenBusinessDateFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.currentDayBodStatus).toBe(BodEodEnum.ERROR);
      expect(result.openBusinessDate).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadMetalRatesForBusinessDay Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY', () => {
      const requestPayload = 123456789;

      const action = new actions.LoadMetalRatesForBusinessDay(requestPayload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.availableMetalRates).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS when goldRate is available', () => {
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: {
          goldRate: 50000,
          platinumRate: null,
          silverRate: null
        },
        goldRateAvailable: true
      };

      const action = new actions.LoadMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.AVAILABLE);
      expect(result.availableMetalRates).toBe(
        action.payload.availableMetalRates
      );
      expect(result.isGoldRateAvailable).toBe(action.payload.goldRateAvailable);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS when goldRate is not available', () => {
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: {
          goldRate: null,
          platinumRate: null,
          silverRate: null
        },
        goldRateAvailable: false
      };

      const action = new actions.LoadMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.ERROR);
      expect(result.availableMetalRates).toBe(
        action.payload.availableMetalRates
      );
      expect(result.isGoldRateAvailable).toBe(action.payload.goldRateAvailable);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadMetalRatesForBusinessDayFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.ERROR);
      expect(result.availableMetalRates).toBe(null);
      expect(result.isGoldRateAvailable).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadEodBusinessDate Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_EOD_BUSINESS_DATE', () => {
      const action = new actions.LoadEodBusinessDate();
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodBusinessDate).toBe(-1);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_EOD_BUSINESS_DATE_SUCCESS', () => {
      const businessDate = 123456789;

      const action = new actions.LoadEodBusinessDateSuccess(businessDate);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodBusinessDate).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_EOD_BUSINESS_DATE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadEodBusinessDateFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodBusinessDate).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LatestBusinessDay Action Functionality', () => {
    beforeEach(() => {});

    it('Testing LATEST_BUSINESS_DAY', () => {
      const action = new actions.LatestBusinessDay();
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.latestBusinessDate).toBe(-1);
      expect(result.bodEodStatus).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LATEST_BUSINESS_DAY_SUCCESS', () => {
      const responsePayload: ClosedBodResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        status: 'OPEN'
      };

      const action = new actions.LatestBusinessDaySuccess(responsePayload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.latestBusinessDate).toBe(action.payload.businessDate);
      expect(result.bodEodStatus).toBe(action.payload.status);
      expect(result.fiscalYear).toBe(action.payload.fiscalYear);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LATEST_BUSINESS_DAY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LatestBusinessDayFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.latestBusinessDate).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing Reset Action Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET', () => {
      const action = new actions.Reset();
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.currentDayBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.eodBusinessDate).toBe(-1);
      expect(result.latestBusinessDate).toBe(-1);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });
});
