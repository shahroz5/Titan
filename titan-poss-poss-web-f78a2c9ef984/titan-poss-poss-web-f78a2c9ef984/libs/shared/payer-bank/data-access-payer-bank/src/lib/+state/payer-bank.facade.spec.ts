import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { PayerBankFacade } from './payer-bank.facade';
import { initialState } from './payer-bank.reducer';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PayerBanksPayload } from '@poss-web/shared/models';
import {
  ErrorLogDownload,
  FileUpload,
  LoadPayerBanks,
  LoadPayerBanksSuccess,
  ResetFileData,
  SearchPayerBank
} from './payer-bank.actions';

describe('PayerBank Facade Testing Suite', () => {
  let payerBankFacade: PayerBankFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PayerBankFacade]
    });
    payerBankFacade = TestBed.inject(PayerBankFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_PAYER_BANKS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const listPayload: PayerBanksPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPayerBanks(listPayload);
      payerBankFacade.loadPayerBanks(listPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_FILE_DATA', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetFileData();
      payerBankFacade.resetFileData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_FILE_DATA', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetFileData();
      payerBankFacade.resetFileData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call FILE_UPLOAD', () => {
      const payload: FormData = null;
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new FileUpload(payload);
      payerBankFacade.uploadFile(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_PAYER_BANK', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchPayerBank('Axis');
      payerBankFacade.searchPayerBank('Axis');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ERROR_LOG_DOWNLOAD', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ErrorLogDownload('123');
      payerBankFacade.loadErrorLog('123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector Action', () => {
    it('should access the payerbanks listing', () => {
      expect(payerBankFacade.getBankDetails()).toEqual(
        payerBankFacade['selectBankDetails$']
      );
    });
    it('should access the totalelements', () => {
      expect(payerBankFacade.getTotalElements()).toEqual(
        payerBankFacade['selectTotalElements$']
      );
    });
    it('should access the fileresponse', () => {
      expect(payerBankFacade.getFileResponse()).toEqual(
        payerBankFacade['selectFileResponse$']
      );
    });
    it('should access the error', () => {
      expect(payerBankFacade.getError()).toEqual(
        payerBankFacade['selectErorr$']
      );
    });
    it('should access the isloading', () => {
      expect(payerBankFacade.getIsLoading()).toEqual(
        payerBankFacade['selectIsLoading$']
      );
    });
    it('should access the errorlog', () => {
      expect(payerBankFacade.getErrorLog()).toEqual(
        payerBankFacade['selectErrorLog$']
      );
    });
  });
});
