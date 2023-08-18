import { createFeatureSelector } from '@ngrx/store';

import { InventoryHomeState } from '@poss-web/shared/models';
import {
  InventoryHomeActions,
  InventoryHomeActionTypes
} from './inventory-home.actions';

export const inventoryHomeFeatureKey = 'inventoryHome';

export const selectInventoryHomeState = createFeatureSelector<
  InventoryHomeState
>(inventoryHomeFeatureKey);

export const initialState: InventoryHomeState = {
  pendingFactorySTNCount: 0,
  pendingBoutiqueSTNCount: 0,
  pendingMerchandiseSTNcount: 0,
  pendingCFASTNCount: 0,
  isLoadingCount: false,

  pendingBTQ_FAC_STNCount: 0,
  pendingBTQ_BTQ_STNCount: 0,
  pendingBTQ_MER_STNCount: 0,
  isLoadingIssueCount: false,

  error: null
};

export function inventoryHomeReducer(
  state = initialState,
  action: InventoryHomeActions
): InventoryHomeState {
  switch (action.type) {
    case InventoryHomeActionTypes.LOAD_STN_COUNT:
    case InventoryHomeActionTypes.LOAD_INVOICE_COUNT:
      return {
        ...state,
        error: null,
        isLoadingCount: true
      };

    case InventoryHomeActionTypes.LOAD_STN_COUNT_FAILURE:
    case InventoryHomeActionTypes.LOAD_INVOICE_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingCount: false
      };

    case InventoryHomeActionTypes.LOAD_STN_COUNT_SUCCESS:
      return {
        ...state,
        pendingFactorySTNCount: action.payload.pendingFactorySTNCount,
        pendingBoutiqueSTNCount: action.payload.pendingBoutiqueSTNCount,
        pendingMerchandiseSTNcount: action.payload.pendingMerchandiseSTNcount,
        isLoadingCount: false
      };

    case InventoryHomeActionTypes.LOAD_INVOICE_COUNT_SUCCESS:
      return {
        ...state,
        pendingCFASTNCount: action.payload.pendingCFASTNCount,
        isLoadingCount: false
      };
    case InventoryHomeActionTypes.LOAD_ISSUES_COUNT:
      return {
        ...state,
        isLoadingIssueCount: true,
        error: null
      };
    case InventoryHomeActionTypes.LOAD_ISSUES_COUNT_SUCCESS:
      return {
        ...state,
        pendingBTQ_BTQ_STNCount: action.payload.pendingIssueBTQ_BTQ_STNCount,
        pendingBTQ_FAC_STNCount: action.payload.pendingIssueBTQ_FAC_STNCount,
        pendingBTQ_MER_STNCount: action.payload.pendingIssueBTQ_MER_STNCount,
        isLoadingIssueCount: false
      };
    case InventoryHomeActionTypes.LOAD_ISSUES_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueCount: false
      };
    case InventoryHomeActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
  }
  return state;
}
