import { GEPProductDetails } from '@poss-web/shared/models';
import { GepState } from './gep.state';
import { GepActions, GepActionsTypes } from './gep.actions';

import { createFeatureSelector } from '@ngrx/store';
import { gepDetailsAdapter, gepCancelAdapter } from './gep.entity';
import * as moment from 'moment';

export const GEP_FEATURE_KEY = 'gep';

export const selectGepState = createFeatureSelector<GepState>(GEP_FEATURE_KEY);

export const initialState: GepState = {
  preMeltingUploadResponse: null,
  gepItem: null,
  gepInitResponse: null,
  gepResponse: null,
  metalPrice: null,
  metalType: null,
  itemType: null,
  totalBreakUp: null,
  deleteResponse: null,
  summary: null,
  updateRso: null,
  holdConfirmResponse: null,
  loadGepDetails: null,
  updateGepItem: null,
  hasError: null,
  isLoading: false,
  isCustomerUpdate: null,
  loadOnHold: null,
  countOnhold: 0,
  saveCancelGep: null,
  loadCancelGep: null,
  cancelGepCount: 0,
  deleteGep: null,
  loadGepItem: null,
  rso: null,
  reason: null,
  gepProductDetails: gepDetailsAdapter.getInitialState(),
  uploadFileListResponse: [],
  downloadFileUrl: null,
  searhGEPResponse: null,
  historySearchParamDetails: null,
  historyItems: null,
  searhGEPResponseCount: 0,
  viewGEPDeatilsResponse: null,
  availableDiscountsList: null
};

export function GepReducer(
  state: GepState = initialState,
  action: GepActions
): GepState {
  switch (action.type) {
    case GepActionsTypes.RESET_GEP:
      return {
        ...state,
        preMeltingUploadResponse: null,
        gepInitResponse: null,
        gepResponse: null,
        metalPrice: null,
        metalType: null,
        itemType: null,
        totalBreakUp: null,
        deleteResponse: null,
        summary: null,
        updateRso: null,
        holdConfirmResponse: null,
        loadGepDetails: null,
        updateGepItem: null,
        hasError: null,
        isLoading: false,
        gepItem: null,
        saveCancelGep: null,
        loadCancelGep: gepCancelAdapter.getInitialState(),
        deleteGep: null,
        loadGepItem: null,
        cancelGepCount: 0,
        gepProductDetails: gepDetailsAdapter.getInitialState(),
        uploadFileListResponse: [],
        downloadFileUrl: null,
        viewGEPDeatilsResponse: null,
        availableDiscountsList: null
      };

    case GepActionsTypes.GEP_INIT_SUCCESS:
      return {
        ...state,
        isLoading: false,

        gepInitResponse: action.payload,
        hasError: null
      };

    case GepActionsTypes.LOAD_GEP_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,

        historyItems: action.payload,
        hasError: null
      };

    case GepActionsTypes.LOAD_GEP_HISTORY_FAILURE:
      return {
        ...state,
        isLoading: false,

        historyItems: null,
        hasError: action.payload
      };

    case GepActionsTypes.VIEW_GEP:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case GepActionsTypes.VIEW_GEP_SUCCESS:
      return {
        ...state,
        isLoading: false,

        hasError: null,
        viewGEPDeatilsResponse: action.payload
      };

    case GepActionsTypes.VIEW_GEP_FAILURE:
      return {
        ...state,
        viewGEPDeatilsResponse: null,

        hasError: action.payload,
        isLoading: false
      };

    case GepActionsTypes.SEARCH_GEP_SUCCESS:
      return {
        ...state,
        isLoading: false,

        searhGEPResponse: action.payload.GEPList,
        searhGEPResponseCount: action.payload.totalElements
      };

    case GepActionsTypes.SEARCH_GEP_FAILURE:
      return {
        ...state,
        isLoading: false,

        hasError: action.payload
      };

    case GepActionsTypes.SET_HISTORY_SEARCH_PARAM_DETAILS:
      return {
        ...state,
        historySearchParamDetails: action.payload
      };

    case GepActionsTypes.GEP_INIT_FAILURE:
      return {
        ...state,
        isLoading: false,

        gepInitResponse: null,
        hasError: action.payload
      };

    case GepActionsTypes.LOAD_GEP_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,

        loadGepItem: action.payload,
        gepProductDetails: gepDetailsAdapter.addOne(
          action.payload,
          state.gepProductDetails
        ),
        hasError: null
      };
    case GepActionsTypes.LOAD_GEP_ITEM_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,

        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              ...action.payload
            }
          },

          state.gepProductDetails
        ),
        hasError: null
      };

    case GepActionsTypes.LOAD_GEP_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,

        loadGepItem: null,
        hasError: action.payload
      };

    case GepActionsTypes.SAVE_RSO:
      return {
        ...state,
        rso: action.payload
      };
    case GepActionsTypes.SAVE_REASON:
      return {
        ...state,
        reason: action.payload
      };
    case GepActionsTypes.UPDATE_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gepResponse: action.payload,

        hasError: null
      };

    case GepActionsTypes.UPDATE_PRICE_FAILURE:
      return {
        ...state,
        isLoading: false,

        hasError: action.payload
      };

    case GepActionsTypes.UPDATE_GEP_ITEM_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              itemType: action.payload.itemType,
              id: action.payload.id,
              metalType: action.payload.metalType,
              rate: action.payload.rate,
              weight: action.payload.weight,
              purity: action.payload.purity,
              karatage: action.payload.karatage,
              totalValue: action.payload.totalValue,
              netValue: action.payload.netValue,
              melted: action.payload.melted,
              totaltax: action.payload.totaltax,
              deductions: action.payload.deductions,
              preMeltingDetails: action.payload.preMeltingDetails,
              totalBreakUp: action.payload.totalBreakUp,
              isSave: action.payload.isSave
            }
          },

          state.gepProductDetails
        ),
        updateGepItem: action.payload,
        hasError: null
      };

    case GepActionsTypes.UPDATE_Purity:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              purity: action.payload.purity
            }
          },

          state.gepProductDetails
        ),

        hasError: null
      };

    case GepActionsTypes.UPDATE_WEIGHT:
      return {
        ...state,
        isLoading: false,
        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              weight: action.payload.weight
            }
          },

          state.gepProductDetails
        ),

        hasError: null
      };

    case GepActionsTypes.UPDATE_GEP_ITEM_FAILURE:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.data.id,
            changes: {
              ...action.payload.data
            }
          },

          state.gepProductDetails
        ),

        updateGepItem: null,
        hasError: action.payload.error
      };

    case GepActionsTypes.GET_GEP_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,

        loadGepDetails: action.payload,
        hasError: null
      };

    case GepActionsTypes.GET_GEP_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,

        loadGepDetails: null,
        hasError: action.payload
      };

    case GepActionsTypes.DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gepProductDetails: gepDetailsAdapter.removeOne(
          action.payload,
          state.gepProductDetails
        ),
        deleteResponse: action.payload,
        hasError: null
      };

    case GepActionsTypes.GEP_INIT_FAILURE:
      return {
        ...state,
        isLoading: false,

        deleteResponse: null,
        hasError: action.payload
      };
    case GepActionsTypes.UPDATE_SUMMARY:
      return {
        ...state,
        summary: action.payload
      };

    case GepActionsTypes.GEP_HOLD_CONFIRM_SUCCESS:
      return {
        ...state,
        isLoading: false,

        holdConfirmResponse: action.payload,
        hasError: null
      };

    case GepActionsTypes.GEP_HOLD_CONFIRM_FAILURE:
      return {
        ...state,
        isLoading: false,

        holdConfirmResponse: null,
        hasError: action.payload
      };

    case GepActionsTypes.GEP_INIT:
    case GepActionsTypes.LOAD_GEP_ITEM:
    case GepActionsTypes.UPDATE_PRICE:
    case GepActionsTypes.UPDATE_GEP_ITEM:
    case GepActionsTypes.GET_GEP_ITEM:
    case GepActionsTypes.DELETE:
    case GepActionsTypes.GEP_HOLD_CONFIRM:
    case GepActionsTypes.GEP_TOTAL_VALUE:
    case GepActionsTypes.GEP_METAL_PRICE:
    case GepActionsTypes.LOAD_METAL:
    case GepActionsTypes.LOAD_ITEM:
    case GepActionsTypes.LOAD_CANCEL_GEP:
    case GepActionsTypes.LOAD_ON_HOLD:
    case GepActionsTypes.SAVE_CANCEL_GEP:
    case GepActionsTypes.COUNT_ON_HOLD:
    case GepActionsTypes.DELETE_GEP:
    case GepActionsTypes.POST_GEP_ITEMS:
    case GepActionsTypes.SEARCH_GEP:
    case GepActionsTypes.LOAD_GEP_HISTORY:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case GepActionsTypes.UPDATE_RSO:
      return {
        ...state,
        isLoading: true,
        isCustomerUpdate: null,
        hasError: null
      };

    case GepActionsTypes.IMAGE_UPLOAD:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        preMeltingUploadResponse: null
      };

    case GepActionsTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileListResponse: []
      };

    case GepActionsTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        downloadFileUrl: null
      };

    // case GepActionsTypes.POST_GEP_ITEMS_SUCCESS:
    //   return {
    //     ...state,
    //     isLoading: false,

    //     gepProductDetails: gepDetailsAdapter.updateOne(
    //       {
    //         id: action.payload.id,
    //         changes: {
    //           id: action.payload.res.id,

    //           rate: action.payload.res.rate,
    //           weight: action.payload.res.weight,
    //           purity: action.payload.res.purity,
    //           karatage: action.payload.res.karatage,
    //           totalValue: action.payload.res.totalValue,
    //           netValue: action.payload.res.netValue,
    //           melted: action.payload.res.melted,
    //           totaltax: action.payload.res.totaltax,

    //           deductions: action.payload.res.deductions,
    //           preMeltingDetails: action.payload.res.preMeltingDetails,
    //           totalBreakUp: action.payload.res.totalBreakUp,
    //           isSave: action.payload.res.isSave
    //         }
    //       },
    //       state.gepProductDetails
    //     ),
    //     hasError: null
    //   };

    case GepActionsTypes.POST_GEP_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        gepProductDetails: gepDetailsAdapter.addOne(
          {
            id: action.payload.res.id,
            itemType: action.payload.res.itemType,
            metalDetail: action.payload.res.metalDetail,
            itemDetail: action.payload.res.itemDetail,
            metalType: action.payload.res.metalType,
            rate: action.payload.res.rate,
            weight: action.payload.res.weight,
            purity: action.payload.res.purity,
            karatage: action.payload.res.karatage,
            totalValue: action.payload.res.totalValue,
            netValue: action.payload.res.netValue,
            melted: action.payload.res.melted,

            totaltax: action.payload.res.totaltax,

            deductions: action.payload.res.deductions,
            preMeltingDetails: action.payload.res.preMeltingDetails,
            totalBreakUp: action.payload.res.totalBreakUp,
            isSave: action.payload.res.isSave
          },
          state.gepProductDetails
        ),
        hasError: null
      };

    case GepActionsTypes.POST_GEP_ITEMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload
      };

    case GepActionsTypes.UPDATE_RSO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateRso: action.payload.data,
        isCustomerUpdate: action.payload?.isCustomerUpdate !== null ? action.payload.isCustomerUpdate : null,
        hasError: null
      };

    case GepActionsTypes.UPDATE_RSO_FAILURE:
      return {
        ...state,
        isLoading: false,
        updateRso: null,
        isCustomerUpdate: null,
        hasError: action.payload
      };

    case GepActionsTypes.GEP_TOTAL_VALUE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        totalBreakUp: action.payload,
        hasError: null
      };

    case GepActionsTypes.GEP_TOTAL_VALUE_FAILURE:
      return {
        ...state,
        isLoading: false,

        totalBreakUp: null,
        hasError: action.payload
      };

    case GepActionsTypes.GEP_METAL_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,

        metalPrice: action.payload,
        hasError: null
      };

    case GepActionsTypes.GEP_METAL_PRICE_FAILURE:
      return {
        ...state,
        isLoading: false,

        metalPrice: null,
        hasError: action.payload
      };

    case GepActionsTypes.LOAD_METAL_SUCCESS:
      return {
        ...state,
        isLoading: false,

        metalType: action.payload,
        hasError: null
      };

    case GepActionsTypes.LOAD_METAL_FAILURE:
      return {
        ...state,
        isLoading: false,

        metalType: null,
        hasError: action.payload
      };

    case GepActionsTypes.LOAD_ITEM_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        itemType: action.payload,
        hasError: null
      };

    case GepActionsTypes.LOAD_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,

        itemType: null,
        hasError: action.payload
      };

    case GepActionsTypes.LOAD_CANCEL_GEP_SUCCESS:
      console.log('inside reducer');
      return {
        ...state,
        isLoading: false,

        loadCancelGep: gepCancelAdapter.setAll(
          action.payload.results,
          state.loadCancelGep
        ),
        cancelGepCount: action.payload.totalElements,
        hasError: null
      };

    case GepActionsTypes.LOAD_CANCEL_GEP_FAILURE:
      return {
        ...state,
        isLoading: false,

        hasError: action.payload
      };

    case GepActionsTypes.LOAD_ON_HOLD_SUCCESS:
      return {
        ...state,
        isLoading: false,

        loadOnHold: action.payload,
        hasError: null
      };

    case GepActionsTypes.LOAD_ON_HOLD_FAILURE:
      return {
        ...state,
        isLoading: false,

        loadOnHold: null,
        hasError: action.payload
      };

    case GepActionsTypes.SAVE_CANCEL_GEP_SUCCESS:
      return {
        ...state,
        isLoading: false,

        saveCancelGep: action.payload,
        hasError: null
      };

    case GepActionsTypes.SAVE_CANCEL_GEP_FAILURE:
      return {
        ...state,
        isLoading: false,

        saveCancelGep: null,
        hasError: action.payload
      };

    case GepActionsTypes.COUNT_ON_HOLD_SUCCESS:
      return {
        ...state,
        isLoading: false,

        countOnhold: action.payload,
        hasError: null
      };

    case GepActionsTypes.COUNT_ON_HOLD_FAILURE:
      return {
        ...state,
        isLoading: false,

        countOnhold: null,
        hasError: action.payload
      };

    case GepActionsTypes.DELETE_GEP_SUCCESS:
      return {
        ...state,
        isLoading: false,

        deleteGep: true,
        hasError: null
      };

    case GepActionsTypes.DELETE_GEP_FAILURE:
      return {
        ...state,
        isLoading: false,

        deleteGep: null,
        hasError: action.payload
      };

    case GepActionsTypes.IMAGE_UPLOAD_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        preMeltingUploadResponse: true,
        hasError: null
      };

    case GepActionsTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case GepActionsTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        hasError: null,
        isLoading: false
      };

    case GepActionsTypes.FILE_UPLOAD_LIST_FAILURE:
      return {
        ...state,
        uploadFileListResponse: [],
        hasError: action.payload,
        isLoading: false
      };

    case GepActionsTypes.FILE_DOWNLOAD_URL_FAILURE:
      return {
        ...state,
        downloadFileUrl: null,
        hasError: action.payload,
        isLoading: false
      };

    case GepActionsTypes.IMAGE_UPLOAD_FAILURE:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        preMeltingUploadResponse: null,
        hasError: action.payload
      };

    case GepActionsTypes.SAVE_PRODUCT_ID:
      const gepItem: GEPProductDetails = {
        id:
          action.payload.weight +
          '_' +
          action.payload.purity +
          '_' +
          moment().valueOf(),
        itemType: action.payload.itemType,
        metalDetail: null,
        itemDetail: null,
        metalType: action.payload.metalType,
        rate: null,
        weight: action.payload.weight,
        purity: action.payload.purity,
        karatage: null,
        melted: 'Enter Details',
        totalValue: null,
        netValue: null,
        totaltax: null,
        deductions: null,
        preMeltingDetails: null,
        totalBreakUp: null,
        isSave: false
      };
      return {
        ...state,
        isLoading: false,
        hasError: null,
        gepProductDetails: gepDetailsAdapter.addOne(
          gepItem,
          state.gepProductDetails
        ),
        gepItem: gepItem
      };

    case GepActionsTypes.UPDATE_PRODUCT:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              itemType: action.payload.item,
              metalType: action.payload.metal
            }
          },
          state.gepProductDetails
        )
      };

    case GepActionsTypes.UPDATE_PREMELTING:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        gepProductDetails: gepDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              preMeltingDetails: action.payload.preMelting,
              melted: 'Pre-Melting Details'
            }
          },
          state.gepProductDetails
        )
      };

    case GepActionsTypes.DELETE_TEMPID:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        gepProductDetails: gepDetailsAdapter.removeOne(
          action.payload,
          state.gepProductDetails
        )
      };

    case GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST_SUCCESS:
      return {
        ...state,
        hasError: null,
        availableDiscountsList: action.payload,
        isLoading: false
      };

    case GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        availableDiscountsList: null,
        isLoading: false
      };

    default:
      return state;
  }
}
