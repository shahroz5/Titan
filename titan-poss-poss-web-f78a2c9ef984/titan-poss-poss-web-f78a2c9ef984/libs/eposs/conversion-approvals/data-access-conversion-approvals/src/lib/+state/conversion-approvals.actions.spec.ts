import {
  ConversionApprovalListingResponsePayload,
  ConversionApprovalRequestsListingPayload,
  CustomErrors,
  ImageReqPayload,
  ImageResponse,
  SelectedRequestDataResponse,
  SelectedRequestDetailsResponse,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  ConversionApprovalsActionTypes,
  LoadApprovalRequestsList,
  LoadApprovalRequestsListFailure,
  LoadApprovalRequestsListSuccess,
  LoadMoreApprovalRequestsList,
  LoadMoreApprovalRequestsListFailure,
  LoadMoreApprovalRequestsListSuccess,
  LoadSelectedRequest,
  LoadSelectedRequestData,
  LoadSelectedRequestDataFailure,
  LoadSelectedRequestDataSuccess,
  LoadSelectedRequestFailure,
  LoadSelectedRequestSuccess,
  LoadThumbnailImageUrl,
  LoadThumbnailImageUrlFailure,
  LoadThumbnailImageUrlSuccess,
  ResetState,
  UpdateApprovalRequestStatus,
  UpdateApprovalRequestStatusFailure,
  UpdateApprovalRequestStatusSuccess
} from './conversion-approvals.actions';

describe('Conversion Approval Actions Testing Suite', () => {
  describe('LoadApprovalRequestsList Test Cases', () => {
    const listingPayload: ConversionApprovalRequestsListingPayload = {
      reqDocNo: 91,
      locationCode: 'CPD',
      status: 'APVL_PENDING',
      pageNumber: 1,
      pageSize: 8
    };

    it('should LoadApprovalRequestsList action ', () => {
      const action = new LoadApprovalRequestsList(listingPayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST,
        payload: listingPayload
      });
    });

    it('should check correct type is used for LoadApprovalRequestsListSuccess action ', () => {
      const responsePayload: ConversionApprovalListingResponsePayload = {
        approvalRequestsList: [
          {
            id: 239,
            reqDocNo: 91,
            requestDate: moment(1638815400000),
            locationCode: 'CPD',
            variantCode: null,
            productDescription: null,
            currencyCode: 'INR',
            totalQuantity: 1,
            totalValue: 139318.21,
            totalWeight: '2.803',
            weightUnit: 'gms',
            status: 'APVL_PENDING'
          }
        ],
        approvalRequestsLength: 8
      };

      const action = new LoadApprovalRequestsListSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadApprovalRequestsListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadApprovalRequestsListFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadMoreApprovalRequestsList Test Cases', () => {
    const listingPayload: ConversionApprovalRequestsListingPayload = {
      reqDocNo: 91,
      locationCode: 'CPD',
      status: 'APVL_PENDING',
      pageNumber: 1,
      pageSize: 8
    };

    it('should LoadMoreApprovalRequestsList action ', () => {
      const action = new LoadMoreApprovalRequestsList(listingPayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST,
        payload: listingPayload
      });
    });

    it('should check correct type is used for LoadMoreApprovalRequestsListSuccess action ', () => {
      const responsePayload: ConversionApprovalListingResponsePayload = {
        approvalRequestsList: [
          {
            id: 239,
            reqDocNo: 91,
            requestDate: moment(1638815400000),
            locationCode: 'CPD',
            variantCode: null,
            productDescription: null,
            currencyCode: 'INR',
            totalQuantity: 1,
            totalValue: 139318.21,
            totalWeight: '2.803',
            weightUnit: 'gms',
            status: 'APVL_PENDING'
          }
        ],
        approvalRequestsLength: 8
      };
      const action = new LoadMoreApprovalRequestsListSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadMoreApprovalRequestsListFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMoreApprovalRequestsListFailure(errorPayload);
      expect({ ...action }).toEqual({
        type:
          ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST_FAILURE,
        payload: errorPayload
      });
    });
  });

  describe('LoadSelectedRequest Test Cases', () => {
    const listingPayload: SelectedRequestPayload = {
      id: 239,
      requestType: 'CONV'
    };

    it('should LoadSelectedRequest action ', () => {
      const action = new LoadSelectedRequest(listingPayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST,
        payload: listingPayload
      });
    });

    it('should check correct type is used for LoadSelectedRequestSuccess action ', () => {
      const responsePayload: SelectedRequestDetailsResponse = {
        id: 239,
        reqDocNo: 91,
        status: 'APVL_PENDING',
        createdDate: moment(1638815400000),
        totalRequestedQuantity: 1,
        totalRequestedWeight: 2.803,
        totalRequestedValue: 139318.21,
        otherDetails: null,
        locationCode: 'CPD',
        requestRemarks: null,
        approvalRemarks: null
      };

      const action = new LoadSelectedRequestSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadSelectedRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedRequestFailure(payload);
      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadSelectedRequestData Test Cases', () => {
    it('should LoadSelectedRequestData action ', () => {
      const listingPayload: SelectedRequestPayload = {
        id: 239,
        requestType: 'CONV'
      };

      const action = new LoadSelectedRequestData(listingPayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA,
        payload: listingPayload
      });
    });

    it('should check correct type is used for LoadSelectedRequestDataSuccess action ', () => {
      const responsePayload: SelectedRequestDataResponse = {
        conversionRequestItems: [
          {
            binCode: '',
            imageURL: '',
            thumbnailImageURL: '',
            inventoryId: '',
            itemCode: '',
            itemDetails: {
              complexityCode: '',
              itemCode: '',
              itemType: '',
              netWeight: '',
              remarks: '',
              sold: '',
              stonePrice: ''
            },
            lotNumber: '',
            mfgDate: moment(123456789),
            productCategory: '',
            productCategoryDesc: '',
            productGroup: '',
            productGroupDesc: '',
            stdValue: 1,
            stdWeight: 1,
            weightUnit: '',
            isStudded: false,
            isLoadingImage: false,
            isLoadingThumbnailImage: false
          }
        ],
        itemIds: ['']
      };
      const action = new LoadSelectedRequestDataSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadSelectedRequestDataFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedRequestDataFailure(payload);
      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA_FAILURE,
        payload: payload
      });
    });
  });

  describe('UpdateApprovalRequestStatus Test Cases', () => {
    const requestPayload: UpdateApprovalRequestStatusPayload = {
      id: 239,
      requestType: 'CONV',
      requestUpdateDto: {
        itemIds: [''],
        remarks: null,
        status: 'ACKNOWLEDGED'
      }
    };
    it('should UpdateApprovalRequestStatus action ', () => {
      const action = new UpdateApprovalRequestStatus(requestPayload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS,
        payload: requestPayload
      });
    });

    it('should check correct type is used for UpdateApprovalRequestStatusSuccess action ', () => {
      const responsePayload: SelectedRequestDetailsResponse = {
        id: 239,
        reqDocNo: 91,
        status: 'APVL_PENDING',
        createdDate: moment(1638815400000),
        totalRequestedQuantity: 1,
        totalRequestedWeight: 2.803,
        totalRequestedValue: 139318.21,
        otherDetails: null,
        locationCode: 'CPD',
        requestRemarks: null,
        approvalRemarks: null
      };

      const action = new UpdateApprovalRequestStatusSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  UpdateApprovalRequestStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateApprovalRequestStatusFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS_FAILURE,
        payload: payload
      });
    });
  });

  describe('ResetState Test Cases', () => {
    it('should ResetState action ', () => {
      const action = new ResetState();

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.RESET
      });
    });
  });

  describe('Testing LoadThumbnailImageUrl action', () => {
    it('should call LoadThumbnailImageUrl action', () => {
      const payload: ImageReqPayload = {
        id: '1',
        imageUrl: 'abcd',
        imageCatalogueDetails: null
      }
      const action = new LoadThumbnailImageUrl(payload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
        payload: payload
      });
    })
    it('should call LoadThumbnailImageUrl action', () => {
      const payload: ImageResponse = {
        id: '1',
      }
      const action = new LoadThumbnailImageUrlSuccess(payload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS,
        payload: payload
      });
    })
    it('should call LoadThumbnailImageUrlFailure action', () => {
      const payload: ImageResponse = {
        id: '1',
      }
      const action = new LoadThumbnailImageUrlFailure(payload);

      expect({ ...action }).toEqual({
        type: ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE,
        payload: payload
      });
    })
  })
})

