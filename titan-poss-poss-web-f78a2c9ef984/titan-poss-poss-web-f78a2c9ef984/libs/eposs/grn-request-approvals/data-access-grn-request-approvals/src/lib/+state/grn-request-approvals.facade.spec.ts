import {
  GrnRequestApprovalListRequest,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { GrnRequestApprovalFacade } from './grn-request-approvals.facade';

import { GrnRequestApprovalState } from './grn-request-approvals.state';

import { grnRequestListAdaptor } from './grn-request-approvals.entity';
import {
  LoadGrnRequestList,
  SaveGrnRequestApprovalStatus,
  LoadReset
} from './grn-request-approvals.action';

describe(' GrnRequestApprovalFacade Testing Suite', () => {
  const initialState: GrnRequestApprovalState = {
    grnRequestList: grnRequestListAdaptor.getInitialState(),
    error: null,
    hasSaved: null,
    totalElements: null,
    isLoading: null,
    hasUpdated: null
  };

  let grnRequestApprovalFacade: GrnRequestApprovalFacade;
  let store: MockStore<GrnRequestApprovalFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GrnRequestApprovalFacade]
    });
    store = TestBed.inject<any>(Store);
    grnRequestApprovalFacade = TestBed.inject<any>(GrnRequestApprovalFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_GRN_REQUEST_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GrnRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'GOODS_RETURN',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadGrnRequestList(payload);
      grnRequestApprovalFacade.loadGrnRequestList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_GRN_REQUEST_APPROVAL_STATUS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveGrnRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            processId: '1',
            taskId: '2',
            taskName: 't',
            approved: true,
            approverRemarks: 'test'
          }
        ]
      };
      const action = new SaveGrnRequestApprovalStatus(payload);
      grnRequestApprovalFacade.saveGrnRequestStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      grnRequestApprovalFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    describe('Access Selector action', () => {
      it('should access the getHasSaved selector action', () => {
        expect(grnRequestApprovalFacade.getHasSaved()).toEqual(
          grnRequestApprovalFacade['hasSaved$']
        );
      });

      it('should access the getHasUpdated selector action', () => {
        expect(grnRequestApprovalFacade.getHasUpdated()).toEqual(
          grnRequestApprovalFacade['hasUpdated$']
        );
      });

      it('should access the getError selector action', () => {
        expect(grnRequestApprovalFacade.getError()).toEqual(
          grnRequestApprovalFacade['error$']
        );
      });

      it('should access the getGrnRequestList selector action', () => {
        expect(grnRequestApprovalFacade.getGrnRequestList()).toEqual(
          grnRequestApprovalFacade['selectGrnRequestList$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(grnRequestApprovalFacade.getIsloading()).toEqual(
          grnRequestApprovalFacade['isLoading$']
        );
      });
    });
  });
});
