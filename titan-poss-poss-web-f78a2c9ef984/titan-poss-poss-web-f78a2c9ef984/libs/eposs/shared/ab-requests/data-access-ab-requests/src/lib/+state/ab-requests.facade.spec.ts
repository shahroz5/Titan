
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ABRequestsFacade } from './ab-requests.facade';

import {
   LoadABRequests
  , LoadABRequestsSuccess
  , LoadABRequestsFailure

  , ApproveABRequests
  , ApproveABRequestsFailure
  , ApproveABRequestsSuccess
  , Reset
  , LoadLocation
  , LoadLocationSuccess
  , LoadLocationFailure
} from './ab-requests.actions';
import { AbRequestsState } from './ab-requests.state';
import { ABDetailsAdapter } from './ab-requests.entity';

describe(' ABRequestApprovalFacade Testing Suite', () => {
  const initialState: AbRequestsState = {
    abRequests: ABDetailsAdapter.getInitialState(),
    abRequestsDetail: null,
    abRequestsCount: 0,
    hasError: null,
    isLoading: false,
    locations: null,

  };

  let requestApprovalFacade: ABRequestsFacade;
  let store: MockStore<ABRequestsFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }),ABRequestsFacade]
    });
    store = TestBed.inject<any>(Store);
    requestApprovalFacade = TestBed.inject<any>(ABRequestsFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_REQUEST_APPROVAL_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload= {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT',
        body:{}
      };
      const action = new LoadABRequests(payload);
      requestApprovalFacade.loadABRequests(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_LOCATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadLocation();
      requestApprovalFacade.loadLocations();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call Resetaction', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new Reset();
      requestApprovalFacade.reset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });


    it('should call SAVE_REQUEST_APPROVAL_STATUS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload= {
        approved: 'yes',
  body: {
    approvedData: {
      data: null,
      type:'cm'
    },
    approverRemarks: 'string',
  },
  processId: '4567890',
  taskId: '4567890',
  taskName: 'string',
      };

      const action = new ApproveABRequests(payload);
      requestApprovalFacade.approveABRequests(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the ABRequest$ selector action', () => {
        expect(requestApprovalFacade.getABRequest()).toEqual(
          requestApprovalFacade['ABRequest$']
        );
      });



      it('should access the getHasUpdated selector action', () => {
        expect( requestApprovalFacade.getLocations()).toEqual(
           requestApprovalFacade['location$']
        );
      });
      it('should access the getisLoading()  selector action', () => {
        expect( requestApprovalFacade.getisLoading() ).toEqual(
           requestApprovalFacade['isLoading$']
        );
      });
      it('should access the hasError()  selector action', () => {
        expect( requestApprovalFacade.hasError() ).toEqual(
           requestApprovalFacade['hasError$']
        );
      });
      it('should access the  getABDetail() selector action', () => {
        expect( requestApprovalFacade. getABDetail()).toEqual(
           requestApprovalFacade['ABDetail$']
        );
      });
      it('should access the getabCancelCount() selector action', () => {
        expect( requestApprovalFacade.getabCancelCount()).toEqual(
           requestApprovalFacade['abCancelCount$']
        );
      });

    //
    });
  });
});
