import { SaveCnApproval, CnApprovalListRequest } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CnApprovalFacade } from './cn-approvals.facade';
import { CnApprovalState } from './cn-approvals.state';

import {
  LoadCnApprovalsList,
  SaveCnApprovalStatus,
  LoadReset
} from './cn-approvals.action';
import { cnRequestListAdaptor } from './cn-approvals.entity';

describe(' CnApprovalFacade Testing Suite', () => {
  const initialState: CnApprovalState = {
    cnApprovalsList: cnRequestListAdaptor.getInitialState(),
    error: null,
    isLoading: null,
    hasUpdated: null
  };

  let cnApprovalFacade: CnApprovalFacade;
  let store: MockStore<CnApprovalFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CnApprovalFacade]
    });
    store = TestBed.inject<any>(Store);
    cnApprovalFacade = TestBed.inject<any>(CnApprovalFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_CN_APPROVALS_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CnApprovalListRequest = {
        approvalStatus: 'PENDING',
        filterOptions: {
          fiscalYear: 2020,
          dateRangeType: 'CUSTOM'
        },
        workflowType: 'CREDIT_NOTE_ACTIVATE',
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadCnApprovalsList(payload);
      cnApprovalFacade.loadCnApprovalsList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_CN_APPROVAL_STATUS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [
          {
            approvedData: {
              data: 'ok',
              type: 'string'
            },
            approved: true,
            approverRemarks: 'test',
            processId: '11',
            taskId: '22',
            taskName: 'ABc'
          }
        ]
      };

      const action = new SaveCnApprovalStatus(payload);
      cnApprovalFacade.saveCnStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      cnApprovalFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getError selector action', () => {
        expect(cnApprovalFacade.getError()).toEqual(cnApprovalFacade['error$']);
      });

      it('should access the getGrnRequestList selector action', () => {
        expect(cnApprovalFacade.getCnApprovalsList()).toEqual(
          cnApprovalFacade['selectCnApprovalsList$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(cnApprovalFacade.getIsloading()).toEqual(
          cnApprovalFacade['isLoading$']
        );
      });
      it('should access the getHasUpdated selector action', () => {
        expect(cnApprovalFacade.getHasUpdated()).toEqual(
          cnApprovalFacade['hasUpdated$']
        );
      });
    });
  });
});
