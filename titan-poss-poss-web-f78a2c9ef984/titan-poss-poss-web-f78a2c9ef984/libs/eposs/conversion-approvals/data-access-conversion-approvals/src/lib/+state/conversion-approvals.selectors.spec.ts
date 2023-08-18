import * as selectors from './conversion-approvals.selectors';
import {
  CustomErrors,
  SelectedRequestDataResponse,
  SelectedRequestDetailsResponse
} from '@poss-web/shared/models';
import { initialState } from './conversion-approvals.reducer';
import { ConversionApprovalsState } from './conversion-approvals.state';
import * as moment from 'moment';

describe('Conversion Approval Selector Testing Suite', () => {
  it('Testing selectIsLoading selector', () => {
    const state: ConversionApprovalsState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.conversionApprovalsSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };

    const state: ConversionApprovalsState = {
      ...initialState,
      errors: customErrors
    };
    expect(
      selectors.conversionApprovalsSelectors.selectError.projector(state)
    ).toEqual(customErrors);
  });

  it('Testing selectApprovalRequestsLength selector', () => {
    const state: ConversionApprovalsState = {
      ...initialState,
      approvalRequestsLength: 10
    };
    expect(
      selectors.conversionApprovalsSelectors.selectApprovalRequestsLength.projector(
        state
      )
    ).toEqual(10);
  });
  it('Testing selectSelectedRequest selector', () => {
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
    const state: ConversionApprovalsState = {
      ...initialState,
      selectedRequest: responsePayload
    };
    expect(
      selectors.conversionApprovalsSelectors.selectSelectedRequest.projector(
        state
      )
    ).toEqual(responsePayload);
  });
  it('Testing selectSelectedRequestData selector', () => {
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

    const state: ConversionApprovalsState = {
      ...initialState,
      selectedRequestData: responsePayload.conversionRequestItems
    };
    expect(
      selectors.conversionApprovalsSelectors.selectSelectedRequestData.projector(
        state
      )
    ).toEqual(responsePayload.conversionRequestItems);
  });
  it('Testing selectSelectedItemIds selector', () => {
    const state: ConversionApprovalsState = {
      ...initialState,
      itemIds: ['123456789']
    };
    expect(
      selectors.conversionApprovalsSelectors.selectSelectedItemIds.projector(
        state
      )
    ).toEqual(['123456789']);
  });
  it('Testing selectUpdateStatusResponse selector', () => {
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

    const state: ConversionApprovalsState = {
      ...initialState,
      updateStatusResponse: responsePayload
    };
    expect(
      selectors.conversionApprovalsSelectors.selectUpdateStatusResponse.projector(
        state
      )
    ).toEqual(responsePayload);
  });
});
