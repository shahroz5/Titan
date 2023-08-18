import { initialState } from './gst-mapping.reducer';
import { GSTMappingFacade } from './gst-mapping.facade';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import {
  GSTMappingPayload,
  LoadGSTMappingListPayload
} from '@poss-web/shared/models';
import { GSTMappingState } from './gst-mapping.state';
import {
  AddGSTMapping,
  EditGSTMapping,
  LoadGSTMappingList,
  LoadTaxes,
  LoadTransactionTypes,
  ResetData
} from './gst-mapping.action';

describe('GST  Mapping facade Testing Suite   ', () => {
  let gstMappingFacade: GSTMappingFacade;

  let store: Store<GSTMappingState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GSTMappingFacade]
    });

    gstMappingFacade = TestBed.inject(GSTMappingFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions  ', () => {
    it('should call LoadGSTMappingList action  ', () => {
      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };

      const action = new LoadGSTMappingList(payload);
      gstMappingFacade.loadGSTMappingList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddGSTMapping action  ', () => {
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const action = new AddGSTMapping(payload);
      gstMappingFacade.addGSTMapping(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call EditGSTMapping action  ', () => {
      const payload = {
        data: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx',
          applicableTax: 'GST',
          destLocationApplicableTax: 'GST',
          isSameState: false,
          srcLocationApplicableTax: 'GST',
          srcTaxApplicable: false
        },
        configId: 'TEST ID'
      };

      const action = new EditGSTMapping(payload);
      gstMappingFacade.editGSTMapping(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadTransactionTypes action  ', () => {
      const action = new LoadTransactionTypes();
      gstMappingFacade.loadTransactionTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadTaxes action  ', () => {
      const action = new LoadTaxes();
      gstMappingFacade.loadTaxes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetData action  ', () => {
      const action = new ResetData();
      gstMappingFacade.resetData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector selector ', () => {
    it('should access Reload Status selector ', () => {
      expect(gstMappingFacade.getReloadStatus()).toEqual(
        gstMappingFacade['reloadStatus$']
      );
    });
    it('should access Transaction type selector ', () => {
      expect(gstMappingFacade.getTxnTypes()).toEqual(
        gstMappingFacade['txnTypes$']
      );
    });

    it('should access tax selector ', () => {
      expect(gstMappingFacade.getTaxes()).toEqual(gstMappingFacade['taxes$']);
    });

    it('should access loading status selector ', () => {
      expect(gstMappingFacade.getIsLoading()).toEqual(
        gstMappingFacade['isLoading$']
      );
    });

    it('should access error selector ', () => {
      expect(gstMappingFacade.getError()).toEqual(gstMappingFacade['error$']);
    });

    it('should access gst mapping list selector ', () => {
      expect(gstMappingFacade.getGSTMappingList()).toEqual(
        gstMappingFacade['gstMappingList$']
      );
    });

    it('should access total element selector ', () => {
      expect(gstMappingFacade.getTotalElements()).toEqual(
        gstMappingFacade['totalElements$']
      );
    });
  });
});
