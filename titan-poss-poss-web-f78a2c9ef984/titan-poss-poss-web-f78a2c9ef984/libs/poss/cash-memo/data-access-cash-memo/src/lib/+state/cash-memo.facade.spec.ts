import {
  CreateCashMemo,
  DeleteCashMemo,
  InvokeOrderDetails,
  PartialUpdateCashMemo,
  ResetValues,
  UpdateCashMemo,
  UpdatePriceDetails,
  ViewCashMemo,
  LoadCashMemoHistory,
  LoadItemFromCashMemoHistory,
  UpdateHistorySearchParameter,
  ResetHistory,
  GetMaterialPrices,
  FileUpload,
  FileUploadList,
  FileDownloadUrl,
  LoadTcsDetail,
  SetFocus,
  SetABInvoked
} from './cash-memo.actions';
import { CashMemoState } from './cash-memo.state';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { CashMemoFacade } from './cash-memo.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { CashMemoDetailsRequestPayload, FileUploadDownloadPayload, MetalRatesPayload, TcsDataResponse, TransactionTypeEnum } from '@poss-web/shared/models';
import { initialState } from './cash-memo.reducer';
import {
  cashMemoHistoryRequestPayload,
  cashMemoItemDetailsRequestPayload
} from './cash-memo.actions.spec';

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_CM',
  txnType: 'CM',
  requestDetails: {
    manualBillDetails: {
      approvedBy: 'cashiercpd',
      manualBillDate: '2021-07-06T00:00:00+05:30',
      manualBillNo: '10AQ',
      manualBillValue: 100000,
      metalRates: {
        J: { metalTypeCode: 'J', ratePerUnit: 46934, totalMetalWeight: 10 }
      },
      password: 'MAzmkyR+',
      remarks: 'test'
    },
    validationType: 'PASSWORD_VALIDATION'
  }
};

const metalRatesPayload: MetalRatesPayload = {
  applicableDate: 1639455052000,
  locationCode: 'CPD'
};

const fileUploadDownloadPayload: FileUploadDownloadPayload = {
  txnType: TransactionTypeEnum.CM,
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
};

const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };
const tcsResponse: TcsDataResponse = {
  tcsToBeCollected: 100,
  tcsCollected: 10,
  tcsEligibleAmount: 1000
};

describe('Cash Memo facade Testing Suite action', () => {
  let cashMemoFacade: CashMemoFacade;
  let store: Store<CashMemoState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CashMemoFacade]
    });

    cashMemoFacade = TestBed.inject(CashMemoFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Cash Memo actions', () => {
    it('should call createCashMemo action', () => {
      const action = new CreateCashMemo(cashMemoDetailsRequestPayload);
      cashMemoFacade.createCashMemo(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call viewCashMemo action', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);
      cashMemoFacade.viewCashMemo(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call partialUpdateCashMemo action', () => {
      const action = new PartialUpdateCashMemo(cashMemoDetailsRequestPayload);
      cashMemoFacade.partialUpdateCashMemo(
        cashMemoDetailsRequestPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call updateCashMemo action', () => {
      const action = new UpdateCashMemo(cashMemoDetailsRequestPayload);
      cashMemoFacade.updateCashMemo(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call deleteCashMemo action', () => {
      const action = new DeleteCashMemo(cashMemoDetailsRequestPayload);
      cashMemoFacade.deleteCashMemo(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call updatePriceDetails action', () => {
      const action = new UpdatePriceDetails(cashMemoDetailsRequestPayload);
      cashMemoFacade.updatePriceDetails(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call invokeOrderDetails action', () => {
      const action = new InvokeOrderDetails(cashMemoDetailsRequestPayload);
      cashMemoFacade.invokeOrderDetails(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call resetValues action', () => {
      const action = new ResetValues();
      cashMemoFacade.resetValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadCashMemoHistory action', () => {
      const action = new LoadCashMemoHistory(cashMemoHistoryRequestPayload);
      cashMemoFacade.loadCashMemoHistory(cashMemoHistoryRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call getItemFromCashMemoHistory action', () => {
      const action = new LoadItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );
      cashMemoFacade.getItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updatetHistorySearchParameter action', () => {
      const action = new UpdateHistorySearchParameter(
        cashMemoHistoryRequestPayload
      );
      cashMemoFacade.updatetHistorySearchParameter(
        cashMemoHistoryRequestPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call resetHistory action', () => {
      const action = new ResetHistory();
      cashMemoFacade.resetHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetMaterialPrices action', () => {
      const action = new GetMaterialPrices(metalRatesPayload);
      cashMemoFacade.loadMaterialPrices(metalRatesPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call FileUpload action', () => {
      const action = new FileUpload(fileUploadDownloadPayload);
      cashMemoFacade.loadFileUpload(fileUploadDownloadPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call FileUploadList action', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      cashMemoFacade.loadFileUploadList(fileUploadDownloadPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call FileDownloadUrl action', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      cashMemoFacade.loadFileDownloadUrl(fileDownloadReq);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadTcsDetail action', () => {
      const action = new LoadTcsDetail(cashMemoDetailsRequestPayload);
      cashMemoFacade.loadTcsAmount(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetFocus action', () => {
      const action = new SetFocus(1);
      cashMemoFacade.setFocus(1);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetABInvoked action', () => {
      const action = new SetABInvoked(false);
      cashMemoFacade.setIsABInvoked(false);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

  });

  describe('Access Cash Memo Selectors', () => {
    it('should get getCreateCashMemoResponse data', () => {
      expect(cashMemoFacade.getCreateCashMemoResponse()).toEqual(
        cashMemoFacade['createCashMemoResponse$']
      );
    });

    it('should get getViewCashMemoResponse data', () => {
      expect(cashMemoFacade.getViewCashMemoResponse()).toEqual(
        cashMemoFacade['viewCashMemoResponse$']
      );
    });

    it('should get getPartailUpdateCashMemoResponse data', () => {
      expect(cashMemoFacade.getPartialUpdateCashMemoResponse()).toEqual(
        cashMemoFacade['partialUpdateCashMemoResponse$']
      );
    });

    it('should get getUpdateCashMemoResponse data', () => {
      expect(cashMemoFacade.getUpdateCashMemoResponse()).toEqual(
        cashMemoFacade['updateCashMemoResponse$']
      );
    });

    it('should get getDeleteCashMemoResponse data', () => {
      expect(cashMemoFacade.getDeleteCashMemoResponse()).toEqual(
        cashMemoFacade['deleteCashMemoResponse$']
      );
    });

    it('should get getUpdatePriceDetailsResponse data', () => {
      expect(cashMemoFacade.getUpdatePriceDetailsResponse()).toEqual(
        cashMemoFacade['updatePriceDetailsResponse$']
      );
    });

    it('should get getInvokeOrderDetailsResponse data', () => {
      expect(cashMemoFacade.getInvokeOrderDetailsResponse()).toEqual(
        cashMemoFacade['invokeOrderDetailsResponse$']
      );
    });

    it('should get getIsLoading data', () => {
      expect(cashMemoFacade.getIsLoading()).toEqual(
        cashMemoFacade['isLoading$']
      );
    });

    it('should get getHasError data', () => {
      expect(cashMemoFacade.getHasError()).toEqual(
        cashMemoFacade['hasError$']
      );
    });

    it('should get getHistorySearchParameter data', () => {
      expect(cashMemoFacade.getHistorySearchParameter()).toEqual(
        cashMemoFacade['historySearchParameter$']
      );
    });

    it('should get getItemDetails data', () => {
      expect(cashMemoFacade.getItemDetails()).toEqual(
        cashMemoFacade['itemDetails$']
      );
    });

    it('should get getIsHistoryDetailsLoading data', () => {
      expect(cashMemoFacade.getIsHistoryDetailsLoading()).toEqual(
        cashMemoFacade['isHistoryDetailsLoading$']
      );
    });
    it('should get getCashMemoHistoryTotalElements data', () => {
      expect(cashMemoFacade.getCashMemoHistoryTotalElements()).toEqual(
        cashMemoFacade['cashMemoHistoryTotalElements$']
      );
    });
    it('should get getCashMemoHistory data', () => {
      expect(cashMemoFacade.getCashMemoHistory()).toEqual(
        cashMemoFacade['cashMemoHistory$']
      );
    });

    it('should get getMaterialPrices data', () => {
      expect(cashMemoFacade.getMaterialPrices()).toEqual(
        cashMemoFacade['materialPrices$']
      );
    });

    it('should get getFileUploadRes data', () => {
      expect(cashMemoFacade.getFileUploadRes()).toEqual(
        cashMemoFacade['fileUpload$']
      );
    });

    it('should get getFileUploadListRes data', () => {
      expect(cashMemoFacade.getFileUploadListRes()).toEqual(
        cashMemoFacade['fileUploadList$']
      );
    });

    it('should get getFileDownloadUrl data', () => {
      expect(cashMemoFacade.getFileDownloadUrl()).toEqual(
        cashMemoFacade['fileDownload$']
      );
    });

    it('should get getTcsAmount data', () => {
      expect(cashMemoFacade.getTcsAmount()).toEqual(
        cashMemoFacade['tcsAmountResponse$']
      );
    });

    it('should get getFocus data', () => {
      expect(cashMemoFacade.getFocus()).toEqual(
        cashMemoFacade['getFocus$']
      );
    });

    it('should get getIsABInvoked data', () => {
      expect(cashMemoFacade.getIsABInvoked()).toEqual(
        cashMemoFacade['isABInvoked$']
      );
    });
  });
});
