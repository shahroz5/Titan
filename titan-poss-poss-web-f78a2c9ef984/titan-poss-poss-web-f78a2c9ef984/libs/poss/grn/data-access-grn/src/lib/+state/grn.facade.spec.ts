import {
  GrnHistoryPayload,
  GrnReqStatusListPayload,
  ConfirmGrnPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { GrnFacade } from './grn.facade';

import { GrnSate } from './grn.state';

import {
  LoadGrnHistoryDetails,
  LoadGrnReqStatusList,
  FilterGrnReqStatusList,
  SearchGrn,
  ConfirmGrn
} from './grn.actions';
import { grnReqItemAdaptor } from './grn.entity';

describe(' GrnFacade Testing Suite', () => {
  const initialState: GrnSate = {
    error: null,
    hasSaved: null,
    hasUpdated: null,
    isLoading: null,
    totalElements: null,
    grnReqStatus: grnReqItemAdaptor.getInitialState(),
    customerId: null,
    grnDetails: null,
    totalReturnGrn: 0,
    totalReturnProduct: 0,
    status: null,
    grnConfirmResponse: null,
    grnInitiateResponse: null,
    reqId: null,
    locationCodes: null,
    approvers: [],
    sendForApprovalResponse: null,
    sendForApprovalSuccess: null,
    totalGrnHistoryReq: null,
    grnHistory: [],
    grnReasons: null,
    tcsAmountCollected: null,
    finalPriceDetails: null
  };

  let grnFacade: GrnFacade;
  let store: MockStore<GrnFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GrnFacade]
    });
    store = TestBed.inject<any>(Store);
    grnFacade = TestBed.inject<any>(GrnFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_GRN_HISTORY_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GrnHistoryPayload = {
        filterOptions: {
          fiscalYear: 2020
        }
      };

      const action = new LoadGrnHistoryDetails(payload);
      grnFacade.loadGrnHistory(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_GRN_REQ_STATUS_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new LoadGrnReqStatusList(payload);
      grnFacade.loadGrnReqStatusList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call FILTER_GRN_REQ_STATUS_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new FilterGrnReqStatusList(payload);
      grnFacade.filterGrnReqStatusList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_GRN action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new SearchGrn(payload);
      grnFacade.searchGrn(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CONFIRM_GRN action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ConfirmGrnPayload = {
        data: {
          customerId: '1',
          remarks: 'remarks'
        },
        txnType: 'GRN',
        subTxnType: 'CM',
        grnId: '1'
      };
      const action = new ConfirmGrn(payload);
      grnFacade.confirmGrn(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_GRN_REQ_STATUS_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new LoadGrnReqStatusList(payload);
      grnFacade.loadGrnReqStatusList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getHasSaved selector action', () => {
        expect(grnFacade.getHasSaved()).toEqual(grnFacade['hasSaved$']);
      });

      it('should access the getHasUpdated selector action', () => {
        expect(grnFacade.getHasUpdated()).toEqual(grnFacade['hasUpdated$']);
      });

      it('should access the getError selector action', () => {
        expect(grnFacade.getError()).toEqual(grnFacade['error$']);
      });

      it('should access the getTotalGrnHistoryReq selector action', () => {
        expect(grnFacade.getTotalGrnHistoryReq()).toEqual(
          grnFacade['totalGrnHistoryReq$']
        );
      });
      it('should access the getGrnHistory selector action', () => {
        expect(grnFacade.getGrnHistory()).toEqual(grnFacade['grnHistory$']);
      });

      it('should access the getGrnConfirmResponse selector action', () => {
        expect(grnFacade.getGrnConfirmResponse()).toEqual(
          grnFacade['grnConfirmResponse$']
        );
      });

      it('should access the getCustomerId selector action', () => {
        expect(grnFacade.getCustomerId()).toEqual(grnFacade['customerId$']);
      });

      it('should access the getGrnDetails selector action', () => {
        expect(grnFacade.getGrnDetails()).toEqual(grnFacade['grnDetails$']);
      });

      it('should access the getTotalReturnProducts selector action', () => {
        expect(grnFacade.getTotalReturnProducts()).toEqual(
          grnFacade['totalReturnProducts$']
        );
      });

      it('should access the getTotalReturnGrn selector action', () => {
        expect(grnFacade.getTotalReturnGrn()).toEqual(
          grnFacade['totalReturnGrn$']
        );
      });

      it('should access the getStatus selector action', () => {
        expect(grnFacade.getStatus()).toEqual(grnFacade['status$']);
      });

      it('should access the getTotalElement selector action', () => {
        expect(grnFacade.getTotalElement()).toEqual(
          grnFacade['totalElements$']
        );
      });

      it('should access the getGrnReqStatus selector action', () => {
        expect(grnFacade.getGrnReqStatus()).toEqual(grnFacade['grnReqStatus$']);
      });

      it('should access the getInitiateGrnResponse selector action', () => {
        expect(grnFacade.getInitiateGrnResponse()).toEqual(
          grnFacade['grnInitiateResponse$']
        );
      });

      it('should access the getLocationCodes selector action', () => {
        expect(grnFacade.getLocationCodes()).toEqual(
          grnFacade['locationCodes$']
        );
      });

      it('should access the getApprovers selector action', () => {
        expect(grnFacade.getApprovers()).toEqual(grnFacade['approvers$']);
      });

      it('should access the getIsloading selector action', () => {
        expect(grnFacade.getIsloading()).toEqual(grnFacade['isLoading$']);
      });
    });
  });
});
