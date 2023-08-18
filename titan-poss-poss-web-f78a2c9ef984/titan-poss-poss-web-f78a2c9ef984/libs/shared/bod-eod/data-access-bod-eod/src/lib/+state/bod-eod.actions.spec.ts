import {
  ClosedBodResponse,
  CustomErrors,
  MetalRatesAndGoldAvailabilityResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BodEodActionTypes,
  LatestBusinessDay,
  LatestBusinessDayFailure,
  LatestBusinessDaySuccess,
  LoadEodBusinessDate,
  LoadEodBusinessDateFailure,
  LoadEodBusinessDateSuccess,
  LoadMetalRatesForBusinessDay,
  LoadMetalRatesForBusinessDayFailure,
  LoadMetalRatesForBusinessDaySuccess,
  LoadOpenBusinessDate,
  LoadOpenBusinessDateFailure,
  LoadOpenBusinessDateSuccess,
  Reset
} from './bod-eod.actions';

describe('Shared BOD-EOD Actions Testing Suite', () => {
  describe('LoadOpenBusinessDate Test Cases', () => {
    it('should load Open Business Date action ', () => {
      const action = new LoadOpenBusinessDate();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.OPEN_BUSINESS_DATE
      });
    });

    it('should check correct type is used for LoadOpenBusinessDateSuccess action ', () => {
      const responsePayload = 123456789;
      const action = new LoadOpenBusinessDateSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.OPEN_BUSINESS_DATE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadOpenBusinessDateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOpenBusinessDateFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.OPEN_BUSINESS_DATE_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadMetalRatesForBusinessDay Test Cases', () => {
    it('should load Metal Rates For Business Date action ', () => {
      const requestPayload = 123456789;

      const action = new LoadMetalRatesForBusinessDay(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY,
        payload: requestPayload
      });
    });

    it('should check correct type is used for LoadMetalRatesForBusinessDaySuccess action ', () => {
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: {
          goldRate: 50000,
          platinumRate: null,
          silverRate: null
        },
        goldRateAvailable: true
      };
      const action = new LoadMetalRatesForBusinessDaySuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadMetalRatesForBusinessDayFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalRatesForBusinessDayFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE,
        payload
      });
    });
  });

  describe('LoadEodBusinessDate Test Cases', () => {
    it('should load EOD business Date action ', () => {
      const action = new LoadEodBusinessDate();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_EOD_BUSINESS_DATE
      });
    });

    it('should check correct type is used for LoadEodBusinessDateSuccess action ', () => {
      const responsePayload = 123456789;
      const action = new LoadEodBusinessDateSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_EOD_BUSINESS_DATE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadEodBusinessDateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEodBusinessDateFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_EOD_BUSINESS_DATE_FAILURE,
        payload
      });
    });
  });

  describe('LatestBusinessDay Test Cases', () => {
    it('should load Latest business Day action ', () => {
      const action = new LatestBusinessDay();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LATEST_BUSINESS_DAY
      });
    });

    it('should check correct type is used for LatestBusinessDaySuccess action ', () => {
      const responsePayload: ClosedBodResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        status: 'OPEN'
      };
      const action = new LatestBusinessDaySuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LATEST_BUSINESS_DAY_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LatestBusinessDayFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LatestBusinessDayFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LATEST_BUSINESS_DAY_FAILURE,
        payload
      });
    });
  });

  describe('Reset Test Cases', () => {
    it('should load Reset action ', () => {
      const action = new Reset();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.RESET
      });
    });
  });
});
