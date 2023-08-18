import { createFeatureSelector } from '@ngrx/store';
import {
  conversionApprovalsFeatureKey,
  ConversionApprovalsState
} from './conversion-approvals.state';
import {
  ConversionApprovalsActionTypes,
  ConversionApprovalsActions
} from './conversion-approvals.actions';
import { conversionApprovalRequestAdaptor } from './conversion-approvals.entity';

export const selectConversionApprovalsState = createFeatureSelector<
  ConversionApprovalsState
>(conversionApprovalsFeatureKey);

export const initialState: ConversionApprovalsState = {
  errors: null,
  isLoading: false,
  approvalRequestsList: conversionApprovalRequestAdaptor.getInitialState(),
  approvalRequestsLength: null,
  selectedRequest: null,
  selectedRequestData: [],
  itemIds: null,
  studdedProductGroups: [],
  updateStatusResponse: null,
  isLoadingImage: false
};

export function ConversionApprovalsReducer(
  state: ConversionApprovalsState = initialState,
  action: ConversionApprovalsActions
): ConversionApprovalsState {
  switch (action.type) {
    case ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA:
    case ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS:
    case ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST:
      return {
        ...state,
        isLoading: true,
        errors: null
      };
    case ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST:
      return {
        ...state,
        isLoading: true,
        errors: null,
        approvalRequestsList: conversionApprovalRequestAdaptor.removeAll(
          state.approvalRequestsList
        ),
        approvalRequestsLength: null
      };
    case ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        approvalRequestsList: conversionApprovalRequestAdaptor.setAll(
          action.payload.approvalRequestsList,
          state.approvalRequestsList
        ),
        approvalRequestsLength: action.payload.approvalRequestsLength
      };
    case ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST_FAILURE:
    case ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload
      };
    case ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        approvalRequestsList: conversionApprovalRequestAdaptor.addMany(
          action.payload.approvalRequestsList,
          state.approvalRequestsList
        ),
        approvalRequestsLength: action.payload.approvalRequestsLength
      };

    case ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST:
      return {
        ...state,
        isLoading: true,
        errors: null,
        selectedRequest: null
      };
    case ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        selectedRequest: action.payload
      };
    case ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        selectedRequest: null
      };

    case ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        selectedRequestData: action.payload.conversionRequestItems,
        itemIds: action.payload.itemIds
      };
    case ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        selectedRequestData: null,
        itemIds: null
      };

    case ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        updateStatusResponse: action.payload
      };
    case ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        updateStatusResponse: null
      };
    // Image
    case ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      if(action.payload?.isChildItems){
        return {
          ...state,
          errors: null,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  isLoadingThumbnailImage: true
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          errors: null,
          selectedRequestData: state.selectedRequestData.map(item => (
            item.inventoryId === action.payload.id
              ? {
                ...item,
                isLoadingThumbnailImage: true
              }
              : item
          ))
        };
      }
    case ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      if(action.payload?.isChildItems){
        return {
          ...state,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  thumbnailImageURL: action.payload.thumbnailImageUrl,
                  isLoadingThumbnailImage: false
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          selectedRequestData: state.selectedRequestData.map(item => (
            item?.inventoryId === action.payload.id
              ? {
                ...item,
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
              : item
          ))
        };
      }
    case ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      if(action.payload?.isChildItems){
        return {
          ...state,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  isLoadingThumbnailImage: false
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          selectedRequestData: state.selectedRequestData.map(item => (
            item?.inventoryId === action.payload.id
              ? {
                ...item,
                isLoadingThumbnailImage: false
              }
              : item
          ))
        };
      }

    case ConversionApprovalsActionTypes.LOAD_IMAGE_URL:
      if(action.payload?.isChildItems){
        return {
          ...state,
          errors: null,
          isLoadingImage: true,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  isLoadingImage: true
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          errors: null,
          isLoadingImage: true,
          selectedRequestData: state.selectedRequestData.map(item => (
            item.inventoryId === action.payload.id
              ? {
                ...item,
                isLoadingImage: true
              }
              : item
          ))
        };
      }
    case ConversionApprovalsActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case ConversionApprovalsActionTypes.LOAD_IMAGE_URL_FAILURE:
      if(action.payload?.isChildItems){
        return {
          ...state,
          isLoadingImage: false,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  imageURL: action.payload.imageUrl,
                  isLoadingImage: false
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          isLoadingImage: false,
          selectedRequestData: state.selectedRequestData.map(item => (
            item.inventoryId === action.payload.id
              ? {
                ...item,
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
              : item
          ))
        };
      }
    case ConversionApprovalsActionTypes.RESET:
      return {
        ...state,
        errors: null,
        isLoading: false,
        approvalRequestsList: conversionApprovalRequestAdaptor.removeAll(
          state.approvalRequestsList
        ),
        approvalRequestsLength: null,
        selectedRequest: null,
        selectedRequestData: null,
        itemIds: null,
        updateStatusResponse: null,
        isLoadingImage: false
      };
    default:
      return state;
  }
}
