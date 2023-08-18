import {
  MetalTypePayload,
  CreateMetalTypePayload,
  UpdateMetalTypePayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { MetalTypeState } from './metal-type.state';
import { MetalTypeFacade } from './metal-type.facade';
import {
  LoadMetalTypeList,
  CreateMetalType,
  UpdateMetalTypeDeatil,
  LoadMetalTypeDetailByMaterialCode,
  LoadMaterialTypeLov,
  LoadReset
} from './metal-type.actions';

describe('Metal type facade Testing Suite', () => {
  const initialState: MetalTypeState = {
    metalTypeList: null,
    totalElements: null,
    error: null,
    metalType: null,
    isLoading: null,
    materialTypeLov: null,
    hasUpdated: null,
    hasSaved: null
  };

  let metalTypeFacade: MetalTypeFacade;
  let store: MockStore<MetalTypeFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), MetalTypeFacade]
    });
    store = TestBed.inject<any>(Store);
    metalTypeFacade = TestBed.inject<any>(MetalTypeFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_METAL_TYPE_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: MetalTypePayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadMetalTypeList(payload);
      metalTypeFacade.loadMetalTypeList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CREATE_METAL_TYPE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CreateMetalTypePayload = {
        materialTypeCode: 'J',

        description: 'Gold',
        isActive: true,
        orgCode: 'TJ'
      };
      const action = new CreateMetalType(payload);
      metalTypeFacade.saveMetalType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_METAL_TYPE_DETAIL action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateMetalTypePayload = {
        materialTypeCode: 'J',
        data: {
          isActive: true
        }
      };
      const action = new UpdateMetalTypeDeatil(payload);
      metalTypeFacade.updateMetalTypeDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'j';
      const action = new LoadMetalTypeDetailByMaterialCode(payload);
      metalTypeFacade.loadMetalTypeDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_MATERIAL_TYPE_LOV action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadMaterialTypeLov();
      metalTypeFacade.loadMaterialTypeLov();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      metalTypeFacade.loadreset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getMetalTypeList selector action', () => {
      expect(metalTypeFacade.getMetalTypeList()).toEqual(
        metalTypeFacade['metalTypeList$']
      );
    });

    it('should access the getMaterialTypeLov selector action', () => {
      expect(metalTypeFacade.getMaterialTypeLov()).toEqual(
        metalTypeFacade['materialTypeLov$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(metalTypeFacade.getHasSaved()).toEqual(
        metalTypeFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(metalTypeFacade.getHasUpdated()).toEqual(
        metalTypeFacade['hasUpdated$']
      );
    });

    it('should access the getMetalType selector action', () => {
      expect(metalTypeFacade.getMetalType()).toEqual(
        metalTypeFacade['metalType$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(metalTypeFacade.getIsloading()).toEqual(
        metalTypeFacade['isLoading$']
      );
    });

    it('should access the getHasError selector action', () => {
      expect(metalTypeFacade.getHasError()).toEqual(
        metalTypeFacade['hasError$']
      );
    });

    it('should access the getTotalElements selector action', () => {
      expect(metalTypeFacade.getTotalElements()).toEqual(
        metalTypeFacade['totalElements$']
      );
    });
  });
});
