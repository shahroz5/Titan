import { Store } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConversionApprovalsState } from './conversion-approvals.state';
import { ConversionApprovalsFacade } from './conversion-approvals.facade';
import {
  LoadApprovalRequestsList,
  LoadMoreApprovalRequestsList,
  LoadSelectedRequest,
  LoadSelectedRequestData,
  ResetState,
  UpdateApprovalRequestStatus
} from './conversion-approvals.actions';
import {
  ConversionApprovalRequestsListingPayload,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';
import { conversionApprovalRequestAdaptor } from './conversion-approvals.entity';

describe('Conversion Approval Facade Testing Suite', () => {
  const initialState: ConversionApprovalsState = {
    errors: null,
    isLoading: false,
    approvalRequestsList: conversionApprovalRequestAdaptor.getInitialState(),
    approvalRequestsLength: null,
    selectedRequest: null,
    selectedRequestData: [],
    itemIds: null,
    studdedProductGroups: [],
    updateStatusResponse: null,
    isLoadingImage: false,
    isLoadingThumbnailImage: true
  };

  let conversionApprovalsFacade: ConversionApprovalsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ConversionApprovalsFacade]
    });

    conversionApprovalsFacade = TestBed.inject(ConversionApprovalsFacade);
  });

  it('should dispatch ResetState action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new ResetState();

    conversionApprovalsFacade.resetState();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadApprovalRequestsList action', inject(
    [Store],
    store => {
      const listingPayload: ConversionApprovalRequestsListingPayload = {
        reqDocNo: 91,
        locationCode: 'CPD',
        status: 'APVL_PENDING',
        pageNumber: 1,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadApprovalRequestsList(listingPayload);

      conversionApprovalsFacade.loadApprovalRequestsList(listingPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadMoreApprovalRequestsList action', inject(
    [Store],
    store => {
      const listingPayload: ConversionApprovalRequestsListingPayload = {
        reqDocNo: 91,
        locationCode: 'CPD',
        status: 'APVL_PENDING',
        pageNumber: 1,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadMoreApprovalRequestsList(listingPayload);

      conversionApprovalsFacade.loadMoreApprovalRequestsList(listingPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadSelectedRequest action', inject([Store], store => {
    const payload: SelectedRequestPayload = {
      id: 239,
      requestType: 'CONV'
    };
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadSelectedRequest(payload);

    conversionApprovalsFacade.loadSelectedRequest(payload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadSelectedRequestData action', inject(
    [Store],
    store => {
      const payload: SelectedRequestPayload = {
        id: 239,
        requestType: 'CONV'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedRequestData(payload);

      conversionApprovalsFacade.loadSelectedRequestData(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch UpdateApprovalRequestStatus action', inject(
    [Store],
    store => {
      const requestPayload: UpdateApprovalRequestStatusPayload = {
        id: 239,
        requestType: 'CONV',
        requestUpdateDto: {
          itemIds: [''],
          remarks: null,
          status: 'ACKNOWLEDGED'
        }
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateApprovalRequestStatus(requestPayload);

      conversionApprovalsFacade.updateApprovalRequestStatus(requestPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should access  getIsLoading() selector action', () => {
    expect(conversionApprovalsFacade.getIsLoading()).toEqual(
      conversionApprovalsFacade['isLoading$']
    );
  });
  it('should access  getError() selector action', () => {
    expect(conversionApprovalsFacade.getError()).toEqual(
      conversionApprovalsFacade['error$']
    );
  });
  it('should access  getConversionRequestsList() selector action', () => {
    expect(conversionApprovalsFacade.getConversionRequestsList()).toEqual(
      conversionApprovalsFacade['selectApprovalRequestsList$']
    );
  });
  it('should access  getConversionRequestsLength() selector action', () => {
    expect(conversionApprovalsFacade.getConversionRequestsLength()).toEqual(
      conversionApprovalsFacade['selectApprovalRequestsLength$']
    );
  });
  it('should access  getSelectedRequest() selector action', () => {
    expect(conversionApprovalsFacade.getSelectedRequest()).toEqual(
      conversionApprovalsFacade['selectedRequest$']
    );
  });
  it('should access  getSelectedRequestData() selector action', () => {
    expect(conversionApprovalsFacade.getSelectedRequestData()).toEqual(
      conversionApprovalsFacade['selectedRequestData$']
    );
  });
  it('should access  getSelectedItemIds() selector action', () => {
    expect(conversionApprovalsFacade.getSelectedItemIds()).toEqual(
      conversionApprovalsFacade['selectedItemIds$']
    );
  });
  it('should access  getUpdateStatusResponse() selector action', () => {
    expect(conversionApprovalsFacade.getUpdateStatusResponse()).toEqual(
      conversionApprovalsFacade['selectUpdateStatusResponse$']
    );
  });
});
