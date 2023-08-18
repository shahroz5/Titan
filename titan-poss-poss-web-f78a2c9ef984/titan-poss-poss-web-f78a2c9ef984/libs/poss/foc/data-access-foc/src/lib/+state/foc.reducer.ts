import { createFeatureSelector } from '@ngrx/store';
import { FocState } from './foc.state';
import { FocActions, FocActionTypes } from './foc.actions';

export const FOC_FEATURE_KEY = 'foc';
export const selectFocState = createFeatureSelector<FocState>(FOC_FEATURE_KEY);
export const initalState: FocState = {
  pendingFocCm: [],
  isLoadingPendingCM: false,

  selectedPendingCM: null,

  pendingFocSchemes: null,
  isLoadingPendingFocSchemes: false,

  focItemDetails: null,
  isLoadingFocItemDetails: false,
  hasFocItemDetails: false,

  pendingIssueResponse: null,
  isIssuingPendingFOC: false,

  focItems: [],
  totalFocEligibleWt: 0,
  totalFocIssuingWt: 0,
  focItemsCount: 0,

  isLoading: false,
  availableFocSchemes: [],

  focSchemes: null,
  manualFocSchemes: null,
  isFocSchemesLoaded: false,
  isFocSchemesForItems: false,

  focAddedToCM: [],
  isFocAdded: false,

  manualFocAddedToCM: [],
  isManualFocAdded: false,

  pendingFocSchemeIds: [],
  isFocKeptPending: false,

  keepFOCPendingTrigger: false,

  error: null,
  isCleared: false,

  ABFocSchemes: null,
  ABFocSchemesForItems: false,
  SelectedABFocSchemes: null,
  SelectedABFocSchemesCount: -1,
  SaveFocSchemes: null,
  deleteABFOCSchemesRes: false,
  manualFocItemDetails: null,
  isLoadingManualFocItemDetails: false,
  hasManualFocItemDetails: false,
  manualFocValidationDetails: null,
  isManualFocVerified: false
};
export function FocReducer(
  state: FocState = initalState,
  action: FocActions
): FocState {
  switch (action.type) {
    case FocActionTypes.LOAD_PENDING_FOC_CM:
      return {
        ...state,
        isLoadingPendingCM: true,
        error: null,
        pendingFocCm: [],
        isFocKeptPending: false
      };
    case FocActionTypes.LOAD_PENDING_FOC_CM_SUCCESS:
      return {
        ...state,
        isLoadingPendingCM: false,
        pendingFocCm: action.payload,
        isFocKeptPending: action.payload.length > 0 ? true : false
      };

    case FocActionTypes.LOAD_PENDING_FOC_CM_FAILURE:
      return { ...state, isLoadingPendingCM: false, error: action.payload };

    case FocActionTypes.SET_SELECTED_FOC_PENDIND_CM:
      return { ...state, selectedPendingCM: action.payload };

    case FocActionTypes.LOAD_PENDING_FOC_SCHEME:
      return {
        ...state,
        isLoadingPendingFocSchemes: true,
        error: null
      };
    case FocActionTypes.LOAD_PENDING_FOC_SCHEME_SUCCESS:
      return {
        ...state,
        isLoadingPendingFocSchemes: false,
        pendingFocSchemes: action.payload
      };

    case FocActionTypes.LOAD_PENDING_FOC_SCHEME_FAILURE:
      return {
        ...state,
        isLoadingPendingFocSchemes: false,
        error: action.payload
      };

    case FocActionTypes.LOAD_FOC_ITEM_DETAILS:
      return {
        ...state,
        focItemDetails: null,
        isLoadingFocItemDetails: true,
        hasFocItemDetails: false
      };

    case FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS:
      return {
        ...state,
        manualFocItemDetails: null,
        isLoadingManualFocItemDetails: true,
        hasManualFocItemDetails: false
      };

    case FocActionTypes.LOAD_FOC_ITEM_DETAILS_SUCCESS:
      return {
        ...state,
        focItemDetails: action.payload,
        isLoadingFocItemDetails: false,
        hasFocItemDetails: true
      };

    case FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS_SUCCESS:
      return {
        ...state,
        manualFocItemDetails: action.payload,
        isLoadingManualFocItemDetails: false,
        hasManualFocItemDetails: true
      };
    case FocActionTypes.LOAD_FOC_ITEM_DETAILS_FAILURE:
      return {
        ...state,
        isLoadingFocItemDetails: false,
        hasFocItemDetails: false,
        error: action.payload.code === 'ERR-INV-029' ? null : action.payload,
        focItemDetails: action.payload.code === 'ERR-INV-029' ? [] : null
      };
    case FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS_FAILURE:
      return {
        ...state,
        isLoadingManualFocItemDetails: false,
        hasManualFocItemDetails: false,
        error: action.payload.code === 'ERR-INV-029' ? null : action.payload,
        manualFocItemDetails: action.payload.code === 'ERR-INV-029' ? [] : null
      };
    case FocActionTypes.ISSUE_PENDING_FOC:
      return {
        ...state,
        isIssuingPendingFOC: true,
        error: null
      };
    case FocActionTypes.ISSUE_PENDING_FOC_SUCCESS:
      return {
        ...state,
        isIssuingPendingFOC: false,
        pendingIssueResponse: action.payload
      };

    case FocActionTypes.ISSUE_PENDING_FOC_FAILURE:
      return {
        ...state,
        isIssuingPendingFOC: false,
        error: action.payload
      };
    case FocActionTypes.RESET_FOC_DATA:
      return {
        ...state,

        isLoadingPendingFocSchemes: false,
        pendingFocSchemes: null,
        selectedPendingCM: null,
        focItemDetails: null,
        manualFocItemDetails: null,
        isLoadingFocItemDetails: false,
        focItems: [],

        hasFocItemDetails: false,
        pendingIssueResponse: null,
        isIssuingPendingFOC: false,

        totalFocEligibleWt: 0,
        totalFocIssuingWt: 0,
        focItemsCount: 0,

        isLoading: false,

        focSchemes: null,
        manualFocSchemes: null,
        isFocSchemesLoaded: false,

        focAddedToCM: [],
        isFocAdded: false,
        manualFocAddedToCM: [],
        isManualFocAdded: false,
        pendingFocSchemeIds: [],
        isFocKeptPending: false,

        error: null,
        isLoadingManualFocItemDetails: false,
        hasManualFocItemDetails: false,
        manualFocValidationDetails: null,
        isManualFocVerified: false
      };
    // case FocActionTypes.SET_FOC_ITEMS:
    //   return {
    //     ...state,
    //     focItems: action.payload
    //   };

    case FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES:
      return {
        ...state,
        isLoading: true,
        focSchemes: null,
        availableFocSchemes: []
      };

    case FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        availableFocSchemes: action.payload
      };
    case FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES_FAILURE:
      return {
        ...state,
        isLoading: false,
        availableFocSchemes: [],
        error: action.payload.code === 'ERR-CONFIG-023' ? null : action.payload
      };
    case FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS:
      return {
        ...state,
        isLoading: true,
        focSchemes: null,
        isFocSchemesLoaded: false
      };
    case FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        focSchemes: action.payload,
        isFocSchemesLoaded: true
      };
    case FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_FAILURE:
    case FocActionTypes.LOAD_MANUAL_FOC_ITEMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.LOAD_MANUAL_FOC_ITEMS:
      return {
        ...state,
        isLoading: true,
        manualFocSchemes: null
      };
    case FocActionTypes.LOAD_MANUAL_FOC_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        manualFocSchemes: action.payload
      };

    case FocActionTypes.ADD_FOC_TO_CM:
      return {
        ...state,
        isLoading: true,
        focAddedToCM: []
      };
    case FocActionTypes.ADD_FOC_TO_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        focAddedToCM: action.payload,
        isFocAdded: true
      };
    case FocActionTypes.ADD_MANUAL_FOC_TO_CM:
      return {
        ...state,
        isLoading: true,
        manualFocAddedToCM: [],
        isManualFocAdded: false
      };
    case FocActionTypes.ADD_MANUAL_FOC_TO_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        manualFocAddedToCM: action.payload,
        isManualFocAdded: true
      };
    case FocActionTypes.DELETE_FOC_FROM_CM_FAILURE:
    case FocActionTypes.ADD_FOC_TO_CM_FAILURE:
    case FocActionTypes.ADD_MANUAL_FOC_TO_CM_FAILURE:
    case FocActionTypes.DELETE_MANUAL_FOC_FROM_CM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.DELETE_FOC_FROM_CM:
    case FocActionTypes.DELETE_MANUAL_FOC_FROM_CM:
      return {
        ...state,
        isLoading: true
      };
    case FocActionTypes.DELETE_MANUAL_FOC_FROM_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        manualFocAddedToCM: [],
        isManualFocAdded: false
      };
    case FocActionTypes.DELETE_FOC_FROM_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        focAddedToCM: [],
        isFocAdded: false,
        isFocKeptPending: false
      };
    case FocActionTypes.GET_FOC_ASSIGNED_TO_CM:
      return {
        ...state,
        isLoading: true,
        isFocAdded: false,
        focAddedToCM: []
      };

    case FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM:
      return {
        ...state,
        isLoading: true,
        isManualFocAdded: false,
        manualFocAddedToCM: []
      };
    case FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isManualFocAdded: action?.payload.length > 0 ? true : false,
        manualFocAddedToCM: action.payload
      };

    case FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM_FAILURE:
      if (action.payload.code === 'ERR-CORE-039') {
        return {
          ...state,
          isLoading: false,
          error: null
        };
      }
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.GET_FOC_ASSIGNED_TO_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isFocAdded: action?.payload.length !== 0 ? true : false,
        focAddedToCM: action.payload
      };
    case FocActionTypes.GET_FOC_ASSIGNED_TO_CM_FAILURE:
      if (action.payload.code === 'ERR-CORE-039') {
        return {
          ...state,
          isLoading: false,
          error: null
        };
      }
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.KEEP_FOC_PENDING:
      return {
        ...state,
        isLoading: true,
        pendingFocSchemeIds: [],
        isFocKeptPending: false
      };
    case FocActionTypes.KEEP_FOC_PENDING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pendingFocSchemeIds: action.payload,
        isFocKeptPending: action.payload.length > 0 ? true : false
      };
    case FocActionTypes.KEEP_FOC_PENDING_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.SET_PENDING_FOC_TRIGGER:
      return {
        ...state,
        keepFOCPendingTrigger: action.payload
      };

    case FocActionTypes.LOAD_FOC_SCHEME_ITEMS:
      return {
        ...state,
        isLoading: true,
        isFocSchemesForItems: false
      };
    case FocActionTypes.LOAD_FOC_SCHEME_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isFocSchemesForItems: action.payload.length > 0 ? true : false
      };
    case FocActionTypes.LOAD_FOC_SCHEME_ITEMS_FAILURE:
    case FocActionTypes.LOAD_AB_FOC_SCHEMES_FAILURE:
    case FocActionTypes.SAVE_AB_FOC_SCHEMES_FAILURE:
    case FocActionTypes.DELETE_AB_FOC_SCHEMES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.VALIDATE_MANUAL_FOC:
      return {
        ...state,
        isLoading: true,
        manualFocValidationDetails: null
      };

    case FocActionTypes.VERIFY_MANUAL_FOC:
      return {
        ...state,
        isLoading: true,
        isManualFocVerified: false
      };
    case FocActionTypes.VERIFY_MANUAL_FOC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isManualFocVerified: true
      };
    case FocActionTypes.VERIFY_MANUAL_FOC_FAILURE:
      return {
        ...state,
        isLoading: false,
        isManualFocVerified: false,
        error: action.payload
      };
    case FocActionTypes.VALIDATE_MANUAL_FOC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        manualFocValidationDetails: action.payload
      };
    case FocActionTypes.VALIDATE_MANUAL_FOC_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FocActionTypes.CLEAR_FOC_SCHEME_ITEMS:
      return {
        ...state,
        isLoading: false,
        isFocSchemesForItems: false,
        ABFocSchemesForItems: false
      };
    // AB FOC

    case FocActionTypes.LOAD_AB_FOC_SCHEMES:
      return {
        ...state,
        isLoading: true,
        ABFocSchemes: null
      };
    case FocActionTypes.LOAD_AB_FOC_SCHEMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ABFocSchemes: action.payload
      };

    case FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS:
      return {
        ...state,
        isLoading: true,
        ABFocSchemesForItems: false
      };
    case FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ABFocSchemesForItems: action.payload.length > 0 ? true : false
      };
    case FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        ABFocSchemesForItems: false
      };

    case FocActionTypes.SAVE_AB_FOC_SCHEMES:
      return {
        ...state,
        isLoading: true,
        SaveFocSchemes: null
      };
    case FocActionTypes.SAVE_AB_FOC_SCHEMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        SaveFocSchemes: action.payload
      };

    case FocActionTypes.DELETE_AB_FOC_SCHEMES:
      return {
        ...state,
        isLoading: true,
        deleteABFOCSchemesRes: false
      };
    case FocActionTypes.DELETE_AB_FOC_SCHEMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        deleteABFOCSchemesRes: action.payload
      };

    case FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES:
      return {
        ...state,
        isLoading: true,
        SelectedABFocSchemes: null,
        // SelectedABFocSchemesCount: -1,
      };
    case FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        SelectedABFocSchemes: action.payload,
        SelectedABFocSchemesCount: action.payload.length
      };
    case FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_FAILURE:
      return {
        ...state,
        isLoading: false,
        SelectedABFocSchemes: [],
        SelectedABFocSchemesCount: 0
      };
    case FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT:
      return {
        ...state,
        isLoading: true,
        SelectedABFocSchemesCount: -1
      };
    case FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        SelectedABFocSchemesCount: action.payload
      };
    case FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        SelectedABFocSchemesCount: 0
      };

    case FocActionTypes.CLEAR_AB_FOC_SCHEME:
      return {
        ...state,
        isLoading: false,
        ABFocSchemes: null,
        SelectedABFocSchemes: null,
        SaveFocSchemes: null,
        deleteABFOCSchemesRes: false
      };

    case FocActionTypes.CLEAR_AB_FOC_SCHEME_COUNT:
        return {
          ...state,
          isLoading: false,
          SelectedABFocSchemesCount: -1
        };
    case FocActionTypes.CLEAR_VALIDATED_MANUAL_FOC:
      return {
        ...state,
        manualFocValidationDetails: null
      };
    case FocActionTypes.CLEAR_VERIFY_MANUAL_FOC:
      return {
        ...state,
        isManualFocVerified: false
      };
    default:
      return state;
  }
}
