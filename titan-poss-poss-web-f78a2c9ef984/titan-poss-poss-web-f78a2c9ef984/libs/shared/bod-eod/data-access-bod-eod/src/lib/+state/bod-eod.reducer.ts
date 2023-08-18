import { createFeatureSelector } from '@ngrx/store';
import { BodEodEnum, BodEodStatusEnum } from '@poss-web/shared/models';
import { BodEodActions, BodEodActionTypes } from './bod-eod.actions';
import { BodEodState } from './bod-eod.state';

export const bodEodFeatureKey = 'sharedBodEod';

export const selectBodEodState = createFeatureSelector<BodEodState>(
  bodEodFeatureKey
);

export const initialState: BodEodState = {
  errors: null,
  isLoading: false,
  currentDayBodStatus: BodEodEnum.PENDING,
  openBusinessDate: -1,
  eodBusinessDate: -1,
  latestBusinessDate: -1,
  bodEodStatus: null,
  availableMetalRates: null,
  isGoldRateAvailable: null,
  metalRatesAvailableStatus: BodEodEnum.PENDING,
  fiscalYear: null
};

export function BodEodReducer(
  state: BodEodState = initialState,
  action: BodEodActions
): BodEodState {
  switch (action.type) {
    // Eod related below
    case BodEodActionTypes.OPEN_BUSINESS_DATE:
      return {
        ...state,
        currentDayBodStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.OPEN_BUSINESS_DATE_SUCCESS:
      return {
        ...state,
        currentDayBodStatus: BodEodEnum.COMPLETED,
        openBusinessDate: action.payload,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.OPEN_BUSINESS_DATE_FAILURE:
      return {
        ...state,
        currentDayBodStatus: BodEodEnum.ERROR,
        openBusinessDate: null,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY:
      return {
        ...state,
        availableMetalRates: null,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS:
      return {
        ...state,
        metalRatesAvailableStatus: !!action.payload.goldRateAvailable
          ? BodEodEnum.AVAILABLE
          : BodEodEnum.ERROR,
        availableMetalRates: action.payload.availableMetalRates,
        isGoldRateAvailable: action.payload.goldRateAvailable,
        isLoading: false,
        errors: null
      };
    case BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE:
      return {
        ...state,
        metalRatesAvailableStatus: BodEodEnum.ERROR,
        availableMetalRates: null,
        isGoldRateAvailable: false,
        isLoading: false,
        errors: action.payload
      };
    case BodEodActionTypes.LOAD_EOD_BUSINESS_DATE:
      return {
        ...state,
        eodBusinessDate: -1,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.LOAD_EOD_BUSINESS_DATE_SUCCESS:
      return {
        ...state,
        eodBusinessDate: action.payload,
        isLoading: false,
        errors: null
      };
    case BodEodActionTypes.LOAD_EOD_BUSINESS_DATE_FAILURE:
      return {
        ...state,
        eodBusinessDate: null,
        isLoading: false,
        errors: action.payload
      };
    case BodEodActionTypes.LATEST_BUSINESS_DAY: {
      return {
        ...state,
        isLoading: true,
        errors: null,
        latestBusinessDate: -1,
        bodEodStatus: null
      };
    }
    case BodEodActionTypes.LATEST_BUSINESS_DAY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        latestBusinessDate: action.payload.businessDate,
        bodEodStatus: action.payload.status,
        fiscalYear: action.payload.fiscalYear
      };
    case BodEodActionTypes.LATEST_BUSINESS_DAY_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        latestBusinessDate: null,
        bodEodStatus: BodEodStatusEnum.API_FAILURE
      };

    case BodEodActionTypes.RESET:
      return {
        ...state,
        errors: null,
        isLoading: false,

        currentDayBodStatus: BodEodEnum.PENDING,
        eodBusinessDate: -1,
        latestBusinessDate: -1
      };
    default:
      return state;
  }
}
