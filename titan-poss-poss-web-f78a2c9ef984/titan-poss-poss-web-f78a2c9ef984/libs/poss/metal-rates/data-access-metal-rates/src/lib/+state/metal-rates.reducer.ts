import { createFeatureSelector } from '@ngrx/store';
import { metalRatesFeatureKey, MetalRatesState } from './metal-rates.state';
import {
  MetalRatesActionTypes,
  MetalRatesActions
} from './metal-rates.actions';

export const selectMetalRatesState = createFeatureSelector<MetalRatesState>(
  metalRatesFeatureKey
);

export const initialState: MetalRatesState = {
  errors: null,
  isLoading: false,
  goldRateAvailableForBusinessDay: false,
  bodBusinessDate: null,
  eodBusinessDate: null,
  metalRatesUpdatedInBoutique: false
};

export function MetalRatesReducer(
  state: MetalRatesState = initialState,
  action: MetalRatesActions
): MetalRatesState {
  switch (action.type) {
    case MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE:
      return {
        ...state,
        bodBusinessDate: null,
        isLoading: true,
        errors: null
      };
    case MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE_SUCCESS:
      return {
        ...state,
        bodBusinessDate: action.payload,
        isLoading: false,
        errors: null
      };
    case MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE_FAILURE:
      return {
        ...state,
        bodBusinessDate: null,
        isLoading: false,
        errors: action.payload
      };
    case MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE:
      return {
        ...state,
        isLoading: true,
        errors: null,
        eodBusinessDate: null
      };
    case MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        eodBusinessDate: action.payload
      };
    case MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        eodBusinessDate: null
      };
    case MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES:
      return {
        ...state,
        goldRateAvailableForBusinessDay: false,
        isLoading: true,
        errors: null
      };
    case MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES_SUCCESS:
      return {
        ...state,
        goldRateAvailableForBusinessDay: action.payload,
        isLoading: false,
        errors: null
      };
    case MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES_FAILURE:
      return {
        ...state,
        goldRateAvailableForBusinessDay: null,
        isLoading: false,
        errors: action.payload
      };
    case MetalRatesActionTypes.SAVE_METAL_RATES:
      return {
        ...state,
        metalRatesUpdatedInBoutique: false,
        isLoading: true,
        errors: null
      };
    case MetalRatesActionTypes.SAVE_METAL_RATES_SUCCESS:
      return {
        ...state,
        metalRatesUpdatedInBoutique: true,
        errors: null,
        isLoading: false
      };
    case MetalRatesActionTypes.SAVE_METAL_RATES_FAILURE:
      return {
        ...state,
        metalRatesUpdatedInBoutique: false,
        errors: action.payload,
        isLoading: false
      };
    case MetalRatesActionTypes.RESET:
      return {
        ...state,
        errors: null,
        isLoading: false,
        goldRateAvailableForBusinessDay: false,
        bodBusinessDate: null,
        eodBusinessDate: null,
        metalRatesUpdatedInBoutique: false
      };
    default:
      return state;
  }
}
