import { initialState } from './data-upload.reducers';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { DataUploadFacade } from './data-upload.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { DataUploadState } from './data-upload.state';
import {
  FIRFileUpload,
  InvoiceUpload,
  MERFileUpload,
  ResetResponse,
  STNUpload
} from './data-upload.actions';

describe('Data Upload facade Testing Suite action', () => {
  let dataUploadFacade: DataUploadFacade;

  let store: Store<DataUploadState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), DataUploadFacade]
    });

    dataUploadFacade = TestBed.inject(DataUploadFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    const file = new FormData();

    it('should call FIRFileUpload action', () => {
      const action = new FIRFileUpload(file);
      dataUploadFacade.loadFIRFileUpload(file);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call MERFileUpload action', () => {
      const action = new MERFileUpload(file);
      dataUploadFacade.loadMERFileUpload(file);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call InvoiceUpload action', () => {
      const action = new InvoiceUpload();
      dataUploadFacade.loadInvoiceUpload();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call STNUpload action', () => {
      const action = new STNUpload();
      dataUploadFacade.loadSTNUpload();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetResponse action', () => {
      const action = new ResetResponse();
      dataUploadFacade.clearResponse();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access selectHasError selector', () => {
      expect(dataUploadFacade.getError()).toEqual(
        dataUploadFacade['hasError$']
      );
    });

    it('should access selectIsLoading selector', () => {
      expect(dataUploadFacade.getIsLoading()).toEqual(
        dataUploadFacade['isLoading$']
      );
    });

    it('should access selectFIRFileUploadResponse selector', () => {
      expect(dataUploadFacade.getFIRFileUploadResponse()).toEqual(
        dataUploadFacade['FIRFileUploadResponse$']
      );
    });

    it('should access selectMERFileUploadResponse selector', () => {
      expect(dataUploadFacade.getMERFileUploadResponse()).toEqual(
        dataUploadFacade['MERFileUploadResponse$']
      );
    });

    it('should access selectInvoiceUploadResponse selector', () => {
      expect(dataUploadFacade.getInvoiceUploadResponse()).toEqual(
        dataUploadFacade['InvoiceUploadResponse$']
      );
    });

    it('should access selectSTNUploadResponse selector', () => {
      expect(dataUploadFacade.getSTNUploadResponse()).toEqual(
        dataUploadFacade['STNUploadResponse$']
      );
    });
  });
});
