import { initialState } from './gep.reducer';

import { Store } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { GepFacade } from './gep.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { GepState } from './gep.state';
import { AdvanceHistoryItemsRequestPayload, GEPSearchResponse, HistorySearchParamDetails, TransactionTypeEnum } from '@poss-web/shared/models';
import {
  GepInit,
  GepInitSuccess,
  GepInitFailure,
  PostGepItems,
  PostGepItemsSuccess,
  PostGepItemsFailure,
  GepMetalRate,
  GepMetalRateSuccess,
  GepMetalRateFailure,
  TotalValueBreakUp,
  TotalValueBreakUpSuccess,
  TotalValueBreakupFailure,
  LoadMetal,
  LoadMetalSuccess,
  LoadMetalFailure,
  LoadITEM,
  LoadITEMSuccess,
  LoadITEMFailure,
  UpdateSummaryBar,
  HoldConfirm,
  HoldConfirmSuccess,
  HoldConfirmFailure,
  Delete,
  DeleteSuccess,
  DeleteFailure,
  PostRSO,
  PostRSOSuccess,
  PostRSOFailure,
  UpdateITEM,
  UpdateITEMSuccess,
  UpdateITEMFailure,
  GetGepITEM,
  GetGepITEMSuccess,
  GetGepITEMFailure,
  ResetGep,
  SaveCanceleGep,
  SaveCanceleGepFailure,
  SaveCanceleGepSuccess,
  LoadCancelGep,
  LoadCancelGepSuccess,
  LoadCancelGepFailure,
  LoadCountOnHoLd,
  LoadCountOnHoLdSuccess,
  LoadCountOnHoLdFailure,
  LoadOnHold,
  LoadOnHoldSuccess,
  LoadOnHoldFailure,
  DeleteGepITEM,
  DeleteITEMSuccess,
  DeleteITEMFailure,
  LoadGepItem,
  LoadGepItemSuccess,
  LoadGepItemFailure,
  ImageUpload,
  ImageUploadSuccess,
  ImageUploadFailure,
  SaveProduct,
  UpdateProduct,
  UpdatePremelting,
  DeleteTempId,
  UpdatePrice,
  UpdatePriceSuccess,
  UpdatePriceFailure,
  UpdateWeight,
  UpdatePurity,
  LoadGepItemPriceSuccess,
  SaveRso,
  SaveReason,
  GepActionsTypes,
  ClearSearchList,
  SetHistoryGEPSearchParamDetails,
  LoadGEPHistory,
  ViewGEP
} from './gep.actions';

const advanceHistoryItemsRequestPayload : AdvanceHistoryItemsRequestPayload = { 
  "docNo": 26,
  "fiscalYear": 2020
}  

const gepSearchResponse : GEPSearchResponse = { GEPList:[], totalElements:1 };

const historySearchParamDetails : HistorySearchParamDetails = { cnDocNo:3 };

describe('Gep facade Testing Suite action', () => {
  let gepFacade: GepFacade;

  let store: Store<GepState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GepFacade]
    });

    gepFacade = TestBed.inject(GepFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call action', () => {
      const action = new GepInit({
        data: {},
        subTxnType: 'NEW_GEP'
      });
      gepFacade.loadGepInit({
        data: {},
        subTxnType: 'NEW_GEP'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new PostGepItems({
        id: '3456789-SDFGHJK',
        data: null,
        subTxnType: 'SDFGHJ'
      });
      gepFacade.postGepResponse({
        id: '3456789-SDFGHJK',
        data: null,
        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new GepMetalRate('METAL');
      gepFacade.metalPrice('METAL');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new LoadMetal('METAL');
      gepFacade.loadMetal('METAL');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new LoadITEM('METAL');
      gepFacade.loadItem('METAL');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new TotalValueBreakUp({
        standardPrice: null,
        metalType: 'J',
        itemType: 'JEWELLERY',
        measuredPurity: 90,
        measuredWeight: 78
      });
      gepFacade.totalBreakUp({
        standardPrice: null,
        metalType: 'J',
        itemType: 'JEWELLERY',
        measuredPurity: 90,
        measuredWeight: 78
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new Delete({
        id: '3456789-SDFGHJK',
        itemId: '345678-SDTYUI-45678',
        subTxnType: 'SDFGHJ'
      });
      gepFacade.delete({
        id: '3456789-SDFGHJK',
        itemId: '345678-SDTYUI-45678',
        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new TotalValueBreakUp({
        standardPrice: null,
        metalType: 'J',
        itemType: 'JEWELLERY',
        measuredPurity: 90,
        measuredWeight: 78
      });
      gepFacade.totalBreakUp({
        standardPrice: null,
        metalType: 'J',
        itemType: 'JEWELLERY',
        measuredPurity: 90,
        measuredWeight: 78
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new LoadGepItem({
        id: '3456789-SDFGHJK',
        itemId: '345678-SDTYUI-45678',
        subTxnType: 'SDFGHJ'
      });
      gepFacade.loadGepItem({
        id: '3456789-SDFGHJK',
        itemId: '345678-SDTYUI-45678',
        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new HoldConfirm({
        id: '3456789-SDFGHJK',
        data: null,
        status: 'jjj',
        subTxnType: 'SDFGHJ'
      });
      gepFacade.holdConfirm({
        id: '3456789-SDFGHJK',
        data: null,
        status: 'jjj',
        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdateSummaryBar({
        id: '3456789-SDFGHJK',
        data: null,
        status: 'jjj',
        subTxnType: 'SDFGHJ'
      });
      gepFacade.summary({
        id: '3456789-SDFGHJK',
        data: null,
        status: 'jjj',
        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new PostRSO({
        id: '3456789-SDFGHJK',
        data: null,

        subTxnType: 'SDFGHJ'
      });
      gepFacade.patchPso({
        id: '3456789-SDFGHJK',
        data: null,

        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdateITEM({
        id: '3456789-SDFGHJK',
        data: null,
        itemId: 'SDFHJK',

        subTxnType: 'SDFGHJ'
      });
      gepFacade.updateGep({
        id: '3456789-SDFGHJK',
        data: null,
        itemId: 'SDFHJK',

        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new GetGepITEM({
        id: '3456789-SDFGHJK',

        subTxnType: 'SDFGHJ'
      });
      gepFacade.loadGep({
        id: '3456789-SDFGHJK',

        subTxnType: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new ResetGep();
      gepFacade.resetGep();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new SaveRso({ id: 'rtyu', subTxnType: 'NEW_GEP' });
      gepFacade.saveRso({
        id: 'rtyu',
        subTxnType: 'NEW_GEP'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new SaveReason({ id: 'rtyu', subTxnType: 'NEW_GEP' });
      gepFacade.saveReason({
        id: 'rtyu',
        subTxnType: 'NEW_GEP'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new LoadCancelGep({
        subTxnType: 'NEW_GEP'
      });
      gepFacade.loadCancelGep({
        subTxnType: 'NEW_GEP'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new LoadOnHold({
        subTxnType: 'NEW_GEP',
        status: 'yu'
      });
      gepFacade.loadOnHoldGep({
        subTxnType: 'NEW_GEP',
        status: 'yu'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new LoadCountOnHoLd({
        subTxnType: 'NEW_GEP',
        status: 'yu'
      });
      gepFacade.loadOnoldCount({
        subTxnType: 'NEW_GEP',
        status: 'yu'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new DeleteGepITEM({
        subTxnType: 'NEW_GEP',
        id: 'SDFGHJ'
      });
      gepFacade.deleteGep({
        subTxnType: 'NEW_GEP',
        id: 'SDFGHJ'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new SaveCanceleGep({
        subTxnType: 'NEW_GEP',
        data: {}
      });
      gepFacade.saveCancelGep({
        subTxnType: 'NEW_GEP',
        data: {}
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new ImageUpload({
        file: null,
        customerId: 345678,

        id: '2346789-DDFTHJ',
        txnType: TransactionTypeEnum.GEP
      });
      gepFacade.uploadForm({
        file: null,
        customerId: 345678,

        id: '2346789-DDFTHJ',
        txnType: TransactionTypeEnum.GEP
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new SaveProduct({
        weight: 77,
        purity: 87,
        metalType: 'J'
      });
      gepFacade.addProduct({
        weight: 77,
        purity: 87,
        metalType: 'J'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdateProduct({
        item: 'jewel',
        metal: 'J',
        id: 'RTYUI-56789'
      });
      gepFacade.updateProduct({
        item: 'jewel',
        metal: 'J',
        id: 'RTYUI-56789'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdatePremelting({
        preMelting: null,
        id: 'RTYUI-56789'
      });
      gepFacade.updatePremelt({
        preMelting: null,
        id: 'RTYUI-56789'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new DeleteTempId('DRTYUJ-345678');
      gepFacade.deleteTempId('DRTYUJ-345678');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdatePrice({
        id: 'DFGHJK-456789',
        subTxnType: 'NEW_GEP'
      });
      gepFacade.updatePrice({
        id: 'DFGHJK-456789',
        subTxnType: 'NEW_GEP'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdateWeight({ id: 'DFGHJK-456789', weight: 99 });
      gepFacade.updateWeight({
        id: 'DFGHJK-456789',
        weight: 99
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call action', () => {
      const action = new UpdatePurity({ id: 'DFGHJK-456789', purity: 99 });
      gepFacade.updatePurity({
        id: 'DFGHJK-456789',
        purity: 99
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    
    it('should call clearSearchList action', () => {
      const action = new ClearSearchList();
      gepFacade.clearSearchList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call setHistorySearchParamDetails action', () => {
      const action = new SetHistoryGEPSearchParamDetails( historySearchParamDetails );
      gepFacade.setHistorySearchParamDetails(historySearchParamDetails);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadAdvanceHistory action', () => {
      const action = new LoadGEPHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'','');
      gepFacade.loadAdvanceHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'','');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call getViewGEPDetails action', () => {
      const payload = "C5611428-A559-488B-957B-94732086A54B";
      const action = new ViewGEP(payload, "NEW_GEP");
      gepFacade.getViewGEPDetails(payload, "NEW_GEP");
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadGepItem action', () => {
      const payload = {
        id: "C5611428-A559-488B-957B-94732086A54B",
        status: '',
        itemId: '',
        subTxnType: ''
      };
      const action = new LoadGepItem(payload);
      gepFacade.loadGepItem(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access gepItem selector', () => {
      expect(gepFacade.getgepItem()).toEqual(gepFacade['gepItem$']);
    });

    it('should access  getgepProductDetail() selector', () => {
      expect(gepFacade.getgepProductDetail()).toEqual(
        gepFacade['gepProductDetail$']
      );
    });

    it('should access   getCancelValidation() selector', () => {
      expect(gepFacade.getCancelValidation()).toEqual(gepFacade['rso$']);
    });

    it('should access    getgepItemResponse$() selector', () => {
      expect(gepFacade.getgepItemResponse$()).toEqual(
        gepFacade['gepItemResponse$']
      );
    });

    it('should access   getCancelValidation2() selector', () => {
      expect(gepFacade.getCancelValidation2()).toEqual(gepFacade['reason$']);
    });

    it('should access    getCustomerUpdate() selector', () => {
      expect(gepFacade.getCustomerUpdate()).toEqual(
        gepFacade['customerUpdate$']
      );
    });

    it('should access   getCancelCount() selector', () => {
      expect(gepFacade.getCancelCount()).toEqual(gepFacade['gepCancelCount$']);
    });

    it('should access     getGepInit()  selector', () => {
      expect(gepFacade.getGepInit()).toEqual(gepFacade['gepResponse$']);
    });

    it('should access     getDelete()  selector', () => {
      expect(gepFacade.getDelete()).toEqual(gepFacade['deleteResponse$']);
    });

    it('should access     getHold()  selector', () => {
      expect(gepFacade.getHold()).toEqual(gepFacade['holdConfrmResponse$']);
    });

    it('should access     getOnHoldExpiredTimeList()selector', () => {
      expect(gepFacade.getOnHoldExpiredTimeList()).toEqual(
        gepFacade['OnHoldExpiredTime$']
      );
    });

    it('should access    getGepDetails()selector', () => {
      expect(gepFacade.getGepDetails()).toEqual(gepFacade['gepDetails$']);
    });

    it('should access    getUpdatedGep() selector', () => {
      expect(gepFacade.getUpdatedGep()).toEqual(gepFacade['updateGep$']);
    });

    it('should access    getSummary()selector', () => {
      expect(gepFacade.getSummary()).toEqual(gepFacade['summaryResponse$']);
    });

    it('should access    getTotalBreakUp()  selector', () => {
      expect(gepFacade.getTotalBreakUp()).toEqual(gepFacade['totalBreakUp$']);
    });

    it('should access   getMetalPrice()   selector', () => {
      expect(gepFacade.getMetalPrice()).toEqual(gepFacade['metalPrice$']);
    });

    it('should access   getMetal()   selector', () => {
      expect(gepFacade.getMetal()).toEqual(gepFacade['metal$']);
    });

    it('should access    getItem()  selector', () => {
      expect(gepFacade.getItem()).toEqual(gepFacade['item$']);
    });

    it('should access     getGepResponse()  selector', () => {
      expect(gepFacade.getGepResponse()).toEqual(gepFacade['postGepResponse$']);
    });

    it('should access      getError()  selector', () => {
      expect(gepFacade.getError()).toEqual(gepFacade['hasError$']);
    });

    it('should access        getIsLoaded()  selector', () => {
      expect(gepFacade.getIsLoaded()).toEqual(gepFacade['isLoaded$']);
    });

    it('should access        getSaveCancel()  selector', () => {
      expect(gepFacade.getSaveCancel()).toEqual(gepFacade['saveCancel$']);
    });

    it('should access        getCancelGep() selector', () => {
      expect(gepFacade.getCancelGep()).toEqual(gepFacade['loadCancel']);
    });

    it('should access      getUploadResponse()selector', () => {
      expect(gepFacade.getUploadResponse()).toEqual(
        gepFacade['uploadResponse$']
      );
    });

    it('should access     getTotalValue() selector', () => {
      expect(gepFacade.getTotalValue()).toEqual(gepFacade['gepTotalValue$']);
    });

    it('should access     getTotalTax() selector', () => {
      expect(gepFacade.getTotalTax()).toEqual(gepFacade['gepTotalTax$']);
    });

    it('should access     getTotalWeight() selector', () => {
      expect(gepFacade.getTotalWeight()).toEqual(gepFacade['gepTotalWeight$']);
    });

    it('should access     getTotalqty() selector', () => {
      expect(gepFacade.getTotalqty()).toEqual(gepFacade['gepTotalqty$']);
    });

    it('should access      getloadOnHold() selector', () => {
      expect(gepFacade.getloadOnHold()).toEqual(gepFacade['loadOnHold']);
    });

    it('should access      getloadCountHold() selector', () => {
      expect(gepFacade.getloadCountHold()).toEqual(gepFacade['loadCountHold']);
    });

    it('should access     getdeleteGep() selector', () => {
      expect(gepFacade.getdeleteGep()).toEqual(gepFacade['deleteGep$']);
    });
    
    it('should access     getHeaderDetails() selector', () => {
      expect(gepFacade.getHeaderDetails()).toEqual(gepFacade['rsoResponse$']);
    });

    it('should access getGEPHistoryItems() selector', () => {
      expect(gepFacade.getGEPHistoryItems()).toEqual(gepFacade['gepHistoryItems$']);
    });

    it('should access getHistorySearchParamDetails() selector', () => {
      expect(gepFacade.getHistorySearchParamDetails()).toEqual(gepFacade['historySearchParamDetails$']);
    });

    it('should access getViewGEPResponse() selector', () => {
      expect(gepFacade.getViewGEPResponse()).toEqual(gepFacade['viewGEPResponse$']);
    });

    it('should access getgepProductDetail() selector', () => {
      expect(gepFacade.getgepProductDetail()).toEqual(gepFacade['gepProductDetail$']);
    });

  });
});
