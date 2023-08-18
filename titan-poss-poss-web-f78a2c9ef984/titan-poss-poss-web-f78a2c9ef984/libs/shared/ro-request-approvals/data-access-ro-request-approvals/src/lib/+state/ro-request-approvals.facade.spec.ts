import {
  RoRequestApprovalListRequest,
  SaveRoRequestApproval
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { RoRequestApprovalFacade } from './ro-request-approvals.facade';

import {
  LoadRoRequestApprovalList,
  LoadPendingRoRequestApprovalList,
  LoadApprovedRoRequestList,
  LoadRejectedRoRequestApprovalList,
  SaveRoRequestApprovalStatus
} from './ro-request-approvals.actions';
import { RoRequestApprovalState } from './ro-request-approvals.state';
import { requestListAdaptor } from './ro-request-approvals.entity';

describe(' RoRequestApprovalFacade Testing Suite', () => {
  const initialState: RoRequestApprovalState = {
    pendingRoRequestList: requestListAdaptor.getInitialState(),
    approvedRoRequestList: [],
    rejectedRoRequestList: [],
    closedRoRequestList: [],
    totalElements: null,
    error: null,
    isLoading: null,
    hasUpdated: null,
    boutiqueRequestList: []
  };

  let roRequestApprovalFacade: RoRequestApprovalFacade;
  let store: MockStore<RoRequestApprovalFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RoRequestApprovalFacade]
    });
    store = TestBed.inject<any>(Store);
    roRequestApprovalFacade = TestBed.inject<any>(RoRequestApprovalFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_RO_REQUEST_APPROVAL_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadRoRequestApprovalList(payload);
      roRequestApprovalFacade.loadBoutiqueRequestList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PENDING_RO_REQUEST_APPROVAL_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadPendingRoRequestApprovalList(payload);
      roRequestApprovalFacade.loadPendingRoRequestList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_APPROVED_RO_REQUEST_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadApprovedRoRequestList(payload);
      roRequestApprovalFacade.loadApprovedRoRequestList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'REJECTED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadRejectedRoRequestApprovalList(payload);
      roRequestApprovalFacade.loadRejectedRoRequestList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_RO_REQUEST_APPROVAL_STATUS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveRoRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            approved: true,
            approverRemarks: 'APPROVING IT',
            taskId: '1',
            processId: '1',
            taskName: 'task'
          }
        ]
      };

      const action = new SaveRoRequestApprovalStatus(payload);
      roRequestApprovalFacade.saveRoRequestStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getBoutiqueRequestList selector action', () => {
        expect(roRequestApprovalFacade.getBoutiqueRequestList()).toEqual(
          roRequestApprovalFacade['boutiqueRoRequestList$']
        );
      });

      it('should access the getHasUpdated selector action', () => {
        expect(roRequestApprovalFacade.getHasUpdated()).toEqual(
          roRequestApprovalFacade['hasUpdated$']
        );
      });

      it('should access the getTotalElements selector action', () => {
        expect(roRequestApprovalFacade.getTotalElements()).toEqual(
          roRequestApprovalFacade['totalElements$']
        );
      });

      it('should access the getError selector action', () => {
        expect(roRequestApprovalFacade.getError()).toEqual(
          roRequestApprovalFacade['error$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(roRequestApprovalFacade.getIsloading()).toEqual(
          roRequestApprovalFacade['isLoading$']
        );
      });

      it('should access the getPendingRoRequestList selector action', () => {
        expect(roRequestApprovalFacade.getPendingRoRequestList()).toEqual(
          roRequestApprovalFacade['pendingRoRequestList$']
        );
      });

      it('should access the getApprovedRoRequestList selector action', () => {
        expect(roRequestApprovalFacade.getApprovedRoRequestList()).toEqual(
          roRequestApprovalFacade['approvedRoRequestList$']
        );
      });

      it('should access the getRejectedRoRequestList selector action', () => {
        expect(roRequestApprovalFacade.getRejectedRoRequestList()).toEqual(
          roRequestApprovalFacade['rejectedRoRequestList$']
        );
      });
    });
  });
});
