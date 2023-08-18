import { VendorMasterListPayload } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { VendorMasterFacade } from './vendor-master.facade';
import { VendorMasterState } from './vendor-master.state';
import {
  LoadVendorMasterList,
  LoadVendorMasterByCode,
  LoadReset,
  SearchVendorMasterByCode
} from './vendor-master.action';

describe(' VendorMasterFacade Testing Suite', () => {
  const initialState: VendorMasterState = {
    vendorMaster: null,
    vendorMasterList: [],
    isLoading: null,
    error: null,

    totalElements: null
  };

  let vendorMasterFacade: VendorMasterFacade;
  let store: MockStore<VendorMasterFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), VendorMasterFacade]
    });
    store = TestBed.inject<any>(Store);
    vendorMasterFacade = TestBed.inject<any>(VendorMasterFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_VENDOR_MASTER_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: VendorMasterListPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadVendorMasterList(payload);
      vendorMasterFacade.loadVendorMasterList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VENDOR_MASTER_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'EMAIL';

      const action = new LoadVendorMasterByCode(payload);
      vendorMasterFacade.loadVendorMasterByCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_VENDOR_MASTER_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'EMAIL';

      const action = new SearchVendorMasterByCode(payload);
      vendorMasterFacade.searchVendorMaster(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      vendorMasterFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getError selector action', () => {
        expect(vendorMasterFacade.getError()).toEqual(
          vendorMasterFacade['error$']
        );
      });

      it('should access the getVendorMasterList selector action', () => {
        expect(vendorMasterFacade.getVendorMasterList()).toEqual(
          vendorMasterFacade['vendorMasterList$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(vendorMasterFacade.getIsloading()).toEqual(
          vendorMasterFacade['isLoading$']
        );
      });
      it('should access the getTotalElements selector action', () => {
        expect(vendorMasterFacade.getTotalElements()).toEqual(
          vendorMasterFacade['totalElements$']
        );
      });

      it('should access the getVendorMaster selector action', () => {
        expect(vendorMasterFacade.getVendorMaster()).toEqual(
          vendorMasterFacade['vendorMaster$']
        );
      });
    });
  });
});
