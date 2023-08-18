import { ComplexityListPayload, ComplexityCode } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ComplexityCodeState } from './complexity-code.state';
import { ComplexityCodeFacade } from './complexity-code.facade';
import {
  LoadComplexityCodeList,
  SaveComplexityCode,
  UpdateComplexityByCode,
  LoadComplexityByCode,
  SearchComplexityCode,
  LoadReset
} from './complexity-code.actions';

describe('complexity code  facade Testing Suite', () => {
  const initialState: ComplexityCodeState = {
    compexityCodeList: null,
    totalElements: null,
    error: null,
    complexityCode: null,
    isLoading: null,
    hasUpdated: null,
    hasSaved: null
  };

  let complexityCodeFacade: ComplexityCodeFacade;
  let store: MockStore<ComplexityCodeFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ComplexityCodeFacade]
    });
    store = TestBed.inject<any>(Store);
    complexityCodeFacade = TestBed.inject<any>(ComplexityCodeFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_COMPLEXIETY_CODE_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ComplexityListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadComplexityCodeList(payload);
      complexityCodeFacade.loadComplexityCodeList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_COMPLEXIETY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ComplexityCode = {
        complexityCode: 'ABC',

        description: 'ABC',
        isActive: true
      };
      const action = new SaveComplexityCode(payload);
      complexityCodeFacade.saveComplexityCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_COMPLEXITY_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ComplexityCode = {
        complexityCode: 'ABC',

        description: 'ABC',
        isActive: true
      };
      const action = new UpdateComplexityByCode(payload);
      complexityCodeFacade.updateComplexityCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_COMPLEXITY_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'ABC';
      const action = new LoadComplexityByCode(payload);
      complexityCodeFacade.loadComplexityByCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_COMPLEXIETY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'ABC';
      const action = new SearchComplexityCode(payload);
      complexityCodeFacade.searchComplexityCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      complexityCodeFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getComplexityCodeList selector action', () => {
      expect(complexityCodeFacade.getComplexityCodeList()).toEqual(
        complexityCodeFacade['complexityCodeList$']
      );
    });

    it('should access the getComplexityCode selector action', () => {
      expect(complexityCodeFacade.getComplexityCode()).toEqual(
        complexityCodeFacade['complexityCode$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(complexityCodeFacade.getHasSaved()).toEqual(
        complexityCodeFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(complexityCodeFacade.getHasUpdated()).toEqual(
        complexityCodeFacade['hasUpdated$']
      );
    });

    it('should access the getTotalElements selector action', () => {
      expect(complexityCodeFacade.getTotalElements()).toEqual(
        complexityCodeFacade['totalElements$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(complexityCodeFacade.getIsloading()).toEqual(
        complexityCodeFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(complexityCodeFacade.getError()).toEqual(
        complexityCodeFacade['error$']
      );
    });
  });
});
