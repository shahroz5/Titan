import { F2MarginListPayload } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { F2MarginFacade } from './f2-margin.facade';

import { F2MarginState } from './f2-margin.state';

import { LoadF2MarginList, LoadReset } from './f2-margin.action';

describe(' F2MarginFacade Testing Suite', () => {
  const initialState: F2MarginState = {
    f2MarginList: [],
    isLoading: null,
    error: null,
    totalElements: 0
  };

  let f2MarginFacade: F2MarginFacade;
  let store: MockStore<F2MarginFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), F2MarginFacade]
    });
    store = TestBed.inject<any>(Store);
    f2MarginFacade = TestBed.inject<any>(F2MarginFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_F2_MARGIN_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: F2MarginListPayload = {
        cfaCode: '71',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadF2MarginList(payload);
      f2MarginFacade.loadF2MarginList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      f2MarginFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getHasSaved selector action', () => {
        expect(f2MarginFacade.getTotalElements()).toEqual(
          f2MarginFacade['totalElements$']
        );
      });

      it('should access the getError selector action', () => {
        expect(f2MarginFacade.getError()).toEqual(f2MarginFacade['error$']);
      });

      it('should access the getGrnRequestList selector action', () => {
        expect(f2MarginFacade.getF2MarginList()).toEqual(
          f2MarginFacade['f2MarginList$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(f2MarginFacade.getIsloading()).toEqual(
          f2MarginFacade['isLoading$']
        );
      });
    });
  });
});
