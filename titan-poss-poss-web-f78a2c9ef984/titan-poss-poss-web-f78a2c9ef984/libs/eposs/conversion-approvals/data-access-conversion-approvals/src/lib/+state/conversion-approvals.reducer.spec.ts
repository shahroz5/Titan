import * as actions from './conversion-approvals.actions';
import { ConversionApprovalsState } from './conversion-approvals.state';
import {
  initialState,
  ConversionApprovalsReducer
} from './conversion-approvals.reducer';
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
import { conversionApprovalRequestAdaptor } from './conversion-approvals.entity';

describe('Conversion Approval Reducer Testing Suite', () => {
  let selectedRequestDataState = initialState;
  let selectedRequestState = initialState;
  selectedRequestDataState = {
    ...selectedRequestDataState,
    selectedRequestData: [{
      binCode: '',
      imageURL: '',
      thumbnailImageURL: '',
      inventoryId: 'C094FCF3-A012-48E1-A491-861271370E51',
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
    }]
  }

  selectedRequestState = {
    ...selectedRequestState,
    selectedRequest: {
      ...selectedRequestState.selectedRequest,
      otherDetails:[{
        binCode: '',
        imageURL: '',
        thumbnailImageURL: '',
        inventoryId: 'C094FCF3-A012-48E1-A491-861271370E51',
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
      }]
    }
  }

  it('should return initial state', () => {
    const action: any = {};
    const state = ConversionApprovalsReducer(initialState, action);

    expect(state).toBe(initialState);
  })
  describe('Testing LoadApprovalRequestsList Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_APPROVAL_REQUESTS_LIST', () => {
      const listingPayload: ConversionApprovalRequestsListingPayload = {
        reqDocNo: 91,
        locationCode: 'CPD',
        status: 'APVL_PENDING',
        pageNumber: 1,
        pageSize: 8
      };

      const action = new actions.LoadApprovalRequestsList(listingPayload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.approvalRequestsList).toEqual(
        conversionApprovalRequestAdaptor.removeAll(
          initialState.approvalRequestsList
        )
      );
      expect(result.approvalRequestsLength).toBe(null);
    });

    it('Testing LOAD_APPROVAL_REQUESTS_LIST_SUCCESS', () => {
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

      const action = new actions.LoadApprovalRequestsListSuccess(
        responsePayload
      );
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.approvalRequestsList).toEqual(
        conversionApprovalRequestAdaptor.setAll(
          action.payload.approvalRequestsList,
          initialState.approvalRequestsList
        )
      );
      expect(result.approvalRequestsLength).toBe(
        action.payload.approvalRequestsLength
      );
    });

    it('Testing LOAD_APPROVAL_REQUESTS_LIST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadApprovalRequestsListFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
    });
  });

  describe('Testing LoadMoreApprovalRequestsList Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_MORE_APPROVAL_REQUESTS_LIST', () => {
      const listingPayload: ConversionApprovalRequestsListingPayload = {
        reqDocNo: 91,
        locationCode: 'CPD',
        status: 'APVL_PENDING',
        pageNumber: 1,
        pageSize: 8
      };

      const action = new actions.LoadMoreApprovalRequestsList(listingPayload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing LOAD_MORE_APPROVAL_REQUESTS_LIST_SUCCESS', () => {
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

      const action = new actions.LoadMoreApprovalRequestsListSuccess(
        responsePayload
      );
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.approvalRequestsList).toEqual(
        conversionApprovalRequestAdaptor.addMany(
          action.payload.approvalRequestsList,
          initialState.approvalRequestsList
        )
      );
      expect(result.approvalRequestsLength).toBe(
        action.payload.approvalRequestsLength
      );
    });

    it('Testing LOAD_MORE_APPROVAL_REQUESTS_LIST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadMoreApprovalRequestsListFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
    });
  });

  describe('Testing LoadSelectedRequest Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SELECTED_REQUEST', () => {
      const payload: SelectedRequestPayload = {
        id: 239,
        requestType: 'CONV'
      };
      const action = new actions.LoadSelectedRequest(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.selectedRequest).toBe(null);
    });

    it('Testing LOAD_SELECTED_REQUEST_SUCCESS', () => {
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
      const action = new actions.LoadSelectedRequestSuccess(responsePayload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.selectedRequest).toBe(action.payload);
    });

    it('Testing LOAD_SELECTED_REQUEST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSelectedRequestFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.selectedRequest).toBe(null);
    });
  });

  describe('Testing LoadSelectedRequestData Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SELECTED_REQUEST_DATA', () => {
      const listingPayload: SelectedRequestPayload = {
        id: 239,
        requestType: 'CONV'
      };
      const action = new actions.LoadSelectedRequestData(listingPayload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing LOAD_SELECTED_REQUEST_DATA_SUCCESS', () => {
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
      const action = new actions.LoadSelectedRequestDataSuccess(
        responsePayload
      );
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData).toBe(
        action.payload.conversionRequestItems
      );
      expect(result.itemIds).toBe(action.payload.itemIds);
    });

    it('Testing LOAD_SELECTED_REQUEST_DATA_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSelectedRequestDataFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.selectedRequestData).toBe(null);
      expect(result.itemIds).toBe(null);
    });
  });

  describe('Testing UpdateApprovalRequestStatus Functionality', () => {
    beforeEach(() => {});

    it('Testing UPDATE_APPROVAL_REQUEST_STATUS', () => {
      const payload: UpdateApprovalRequestStatusPayload = {
        id: 239,
        requestType: 'CONV',
        requestUpdateDto: {
          itemIds: [''],
          remarks: null,
          status: 'ACKNOWLEDGED'
        }
      };
      const action = new actions.UpdateApprovalRequestStatus(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing UPDATE_APPROVAL_REQUEST_STATUS_SUCCESS', () => {
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
      const action = new actions.UpdateApprovalRequestStatusSuccess(
        responsePayload
      );
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.updateStatusResponse).toBe(action.payload);
    });

    it('Testing UPDATE_APPROVAL_REQUEST_STATUS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateApprovalRequestStatusFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.updateStatusResponse).toBe(null);
    });
  });

  describe('Testing ResetState Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET', () => {
      const action = new actions.ResetState();
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        initialState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.approvalRequestsList).toEqual(
        conversionApprovalRequestAdaptor.removeAll(
          initialState.approvalRequestsList
        )
      );
      expect(result.approvalRequestsLength).toBe(null);
      expect(result.selectedRequest).toBe(null);
      expect(result.selectedRequestData).toBe(null);
      expect(result.itemIds).toBe(null);
      expect(result.updateStatusResponse).toBe(null);
    });
  });

  describe('Testing LoadThumbNailImageUrl functionality', () => {
    beforeEach(() => {})

    it('Testing LOAD_THUMBNAIL_IMAGE_URL', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: true,
      }
      const action = new actions.LoadThumbnailImageUrl(null);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequest).toBeDefined();
    })
    it('if', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: true,
      }
      const action = new actions.LoadThumbnailImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequest?.otherDetails[0].inventoryId).toBeDefined();
    })
    it('Return data', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: true,
      }
      const action = new actions.LoadThumbnailImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequest?.otherDetails[0].inventoryId).toBe(action.payload.id);
    })
    it('else', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: false
      }
      const action = new actions.LoadThumbnailImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBe(action.payload.id);
    })
    it('else - ternary condition fails', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: false
      }
      const action = new actions.LoadThumbnailImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBeDefined();
    })
    it('Testing LOAD_THUMBNAIL_IMAGE_URL_SUCCESS', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        isChildItems: true
      }
      const action = new actions.LoadThumbnailImageUrlSuccess(null);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.selectedRequest).toBeDefined();
    })
    it('if', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        isChildItems: true
      }
      const action = new actions.LoadThumbnailImageUrlSuccess(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.selectedRequest?.otherDetails[0].inventoryId).toBeDefined();
    })
    it('return data', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: false
      }
      const action = new actions.LoadThumbnailImageUrlSuccess(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBe(action.payload.id);
    })
    it('ternary condition fails', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: false
      }
      const action = new actions.LoadThumbnailImageUrlSuccess(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBeDefined();
    })
    it('Testing LOAD_THUMBNAIL_IMAGE_URL_FAILURE', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: true
      }
      const action = new actions.LoadThumbnailImageUrlFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.selectedRequest?.otherDetails[0]?.inventoryId).toBe(action.payload.id);
    })
    it('if', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: false
      }
      const action = new actions.LoadThumbnailImageUrlFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.selectedRequestData[0]?.inventoryId).toBe(action.payload.id);
    })
    it('check selected request', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        isChildItems: true
      }
      const action = new actions.LoadThumbnailImageUrlFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.selectedRequest).toBeDefined();
    })
    it('else - ternary operator fails', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
      }
      const action = new actions.LoadThumbnailImageUrlFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.selectedRequestData[0]?.inventoryId).toBeDefined();
    })
  })

  describe('Testing LoadImageUrl functionality', () => {
    beforeEach(() => {})

    it('Testing LOAD_IMAGE_URL', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: true,
      }
      const action = new actions.LoadImageUrl(null);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequest).toBeDefined();
    })
    it('if', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: false
      }
      const action = new actions.LoadImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBeDefined();
    })
    it('Return data', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: true,
      }
      const action = new actions.LoadImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequest?.otherDetails[0].inventoryId).toBe(action.payload.id);
    })
    it('else', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: false
      }
      const action = new actions.LoadImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBe(action.payload.id);
    })
    it('check selectedRequest', () => {
      const payload: ImageReqPayload = {
        id: 'C094FCF3-A012-48E1-A491-861271370E52',
        imageUrl: 'abcd',
        imageCatalogueDetails: null,
        isChildItems: true
      }
      const action = new actions.LoadImageUrl(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequest).toBeDefined();
    })
    it('Testing LOAD_THUMBNAIL_IMAGE_URL_SUCCESS', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: true
      }
      const action = new actions.LoadImageUrlSuccess(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.selectedRequest?.otherDetails[0]?.inventoryId).toBe(action.payload.id);
    })
    it('if', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: false
      }
      const action = new actions.LoadImageUrlSuccess(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action,
      );
      expect(result.errors).toBe(null);
      expect(result.selectedRequestData[0]?.inventoryId).toBe(action.payload.id);
    })
    it('Testing LOAD_THUMBNAIL_IMAGE_URL_FAILURE', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: true
      }
      const action = new actions.LoadImageUrlFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestState,
        action
      );
      expect(result.selectedRequest?.otherDetails[0]?.inventoryId).toBe(action.payload.id);
      expect(result.itemIds).toBe(null);
    })
    it('if', () => {
      const payload: ImageResponse = {
        id: 'C094FCF3-A012-48E1-A491-861271370E51',
        isChildItems: false
      }
      const action = new actions.LoadImageUrlFailure(payload);
      const result: ConversionApprovalsState = ConversionApprovalsReducer(
        selectedRequestDataState,
        action
      );
      expect(result.selectedRequestData[0]?.inventoryId).toBe(action.payload.id);
    })
  })
})
