import {
  SearchPayloadReq,
  SaveCnActionPayload,
  UploadCNPayloadReq
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CnDirectFacade } from './cn-direct.facade';
import { CnDirectState } from './cn-direct.state';
import {
  SearchCnDirectList,
  SaveCnDirectAction,
  LoadReset,
  UploadCn
} from './cn-direct.action';

describe(' CnDirectFacade Testing Suite', () => {
  const initialState: CnDirectState = {
    cnList: [],
    error: null,
    isLoading: null,
    hasUpdated: null,
    totalElements: null
  };

  let cnDirectFacade: CnDirectFacade;
  let store: MockStore<CnDirectFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CnDirectFacade]
    });
    store = TestBed.inject<any>(Store);
    cnDirectFacade = TestBed.inject<any>(CnDirectFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call SEARCH_CN_DIRECT_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SearchPayloadReq = {
        fiscalYear: '2020',
        cnNumber: 11,
        locationCode: 'CPD',
        pageEvent: {
          page: 0,
          size: 10
        }
      };

      const action = new SearchCnDirectList(payload);
      cnDirectFacade.searchCn(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_CN_DIRECT_ACTION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveCnActionPayload = {
        cnIds: ['1'],
        operation: 'SUSPEND'
      };

      const action = new SaveCnDirectAction(payload);
      cnDirectFacade.saveCnStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPLOAD_CN action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UploadCNPayloadReq = {
        file: null,
        pageEvent: {
          page: 1,
          size: 10
        }
      };
      const action = new UploadCn(payload);
      cnDirectFacade.uploadCn(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      cnDirectFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getError selector action', () => {
        expect(cnDirectFacade.getError()).toEqual(cnDirectFacade['error$']);
      });

      it('should access the getCnList selector action', () => {
        expect(cnDirectFacade.getCnList()).toEqual(
          cnDirectFacade['selectCnList$']
        );
      });
      it('should access the getTotalElements selector action', () => {
        expect(cnDirectFacade.getTotalElements()).toEqual(
          cnDirectFacade['selectTotalElements$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(cnDirectFacade.getIsloading()).toEqual(
          cnDirectFacade['isLoading$']
        );
      });
      it('should access the getHasUpdated selector action', () => {
        expect(cnDirectFacade.getHasUpdated()).toEqual(
          cnDirectFacade['hasUpdated$']
        );
      });
    });
  });
});
