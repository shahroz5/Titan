import {
  PurityListPayload,
  CreatePurityPayload,
  UpdatePurityPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PurityState } from './purity.state';
import { PurityFacade } from './purity.facade';
import {
  LoadPurityList,
  LoadReset,
  CreatePurity,
  UpdatePurity,
  LoadPurityByMaterialCodeAndPurity
} from './purity.actions';

import { purityAdaptor } from './purity.entity';

describe(' payment master facade Testing Suite', () => {
  const initialState: PurityState = {
    purityList: purityAdaptor.getInitialState(),
    error: null,
    isLoading: false,
    totalElements: null,
    metalType: null,
    purity: null,
    hasSaved: null,
    hasUpdated: null,
    isActiveUpdated: null
  };
  let purityFacade: PurityFacade;
  let store: MockStore<PurityFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PurityFacade]
    });
    store = TestBed.inject<any>(Store);
    purityFacade = TestBed.inject<any>(PurityFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_PURITY_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PurityListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadPurityList(payload);
      purityFacade.loadPurityList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CREATE_PURITY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CreatePurityPayload = {
        purity: '90',
        offset: '1',
        itemTypeCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };

      const action = new CreatePurity(payload);
      purityFacade.savePurity(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_PURITY_DETAIL action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdatePurityPayload = {
        id: 1,
        data: {
          isActive: false
        }
      };
      const action = new UpdatePurity(payload);
      purityFacade.updatePurityDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'J';
      const action = new LoadPurityByMaterialCodeAndPurity(payload);
      purityFacade.loadPurityByMaterialCodeAndPurity(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      purityFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getPurityList selector action', () => {
      expect(purityFacade.getPurityList()).toEqual(purityFacade['purityList$']);
    });

    it('should access the getMetalTypes selector action', () => {
      expect(purityFacade.getMetalTypes()).toEqual(purityFacade['metalTypes$']);
    });

    it('should access the getHasSaved selector action', () => {
      expect(purityFacade.getHasSaved()).toEqual(purityFacade['hasSaved$']);
    });

    it('should access the getHasUpdated selector action', () => {
      expect(purityFacade.getHasUpdated()).toEqual(purityFacade['hasUpdated$']);
    });

    it('should access the getIsloading selector action', () => {
      expect(purityFacade.getIsloading()).toEqual(purityFacade['isLoading$']);
    });

    it('should access the getError selector action', () => {
      expect(purityFacade.getError()).toEqual(purityFacade['error$']);
    });

    it('should access the getTotalElements selector action', () => {
      expect(purityFacade.getTotalElements()).toEqual(
        purityFacade['totalElements$']
      );
    });

    it('should access the getIsActiveUpdated selector action', () => {
      expect(purityFacade.getIsActiveUpdated()).toEqual(
        purityFacade['isActiveUpdated$']
      );
    });
  });
});
