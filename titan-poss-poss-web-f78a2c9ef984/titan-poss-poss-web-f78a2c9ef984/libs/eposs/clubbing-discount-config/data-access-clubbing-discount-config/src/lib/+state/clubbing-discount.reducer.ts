import { ClubDiscountsState } from './clubbing-discount.state';
import {
  ClubDiscountsActions,
  ClubDiscountsActionTypes
} from './clubbing-discount.actions';
import { createFeatureSelector } from '@ngrx/store';
import { clubDiscountsAdapter } from './clubbing-discount.entity';

export const CLUB_DISCOUNTS_FEATURE_KEY = 'glLocationPayment';
export const selectClubDiscountsState = createFeatureSelector<
  ClubDiscountsState
>(CLUB_DISCOUNTS_FEATURE_KEY);
export const initialState: ClubDiscountsState = {
  error: null,
  clubbedDiscountList: clubDiscountsAdapter.getInitialState(),
  isLoading: false,
  hasSaved: null,
  totalCount: 0,
  saveclubbedDiscounts: null,
  discountCodesType1: null,
  discountCodesType2: null,
  discountCodesType3: null
};

export function ClubDiscountsReducer(
  state: ClubDiscountsState = initialState,
  action: ClubDiscountsActions
): ClubDiscountsState {
  switch (action.type) {
    case ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS:
    case ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS:
    case ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS:
    case ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };

    case ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS_SUCCESS:
      return {
        ...state,
        clubbedDiscountList: clubDiscountsAdapter.setAll(
          action.payload.clubDiscountsList,
          state.clubbedDiscountList
        ),
        totalCount: action.payload.count,
        isLoading: false,
        hasSaved: false,
        error: null
      };
    case ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS_SUCCESS:
      return {
        ...state,
        saveclubbedDiscounts: action.payload,
        isLoading: false,
        hasSaved: true
      };

    case ClubDiscountsActionTypes.DELETE_CLUBBING_DISCOUNTS:
      return {
        ...state,
        clubbedDiscountList: clubDiscountsAdapter.removeOne(
          action.payload,
          state.clubbedDiscountList
        ),
        isLoading: false,
        hasSaved: false
      };

    case ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS_SUCCESS:
      return {
        ...state,
        discountCodesType1: action.payload,
        isLoading: false,
        hasSaved: false
      };
    case ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS_SUCCESS:
      return {
        ...state,
        discountCodesType2: action.payload,
        isLoading: false,
        hasSaved: false
      };
    case ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS_SUCCESS:
      return {
        ...state,
        discountCodesType3: action.payload,
        isLoading: false,
        hasSaved: false
      };
    case ClubDiscountsActionTypes.RESET_CLUBBING_DISCOUNTS:
      return {
        ...state,
        clubbedDiscountList: clubDiscountsAdapter.getInitialState(),
        isLoading: false,
        hasSaved: false,
        error: null
      };
    case ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS_FAILURE:
    case ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS_FAILURE:
    case ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS_FAILURE:
    case ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS_FAILURE:
    case ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasSaved: false
      };
    default:
      return state;
  }
}
