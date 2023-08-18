import { initialState } from './view-tcs.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { ViewTcsFacade } from './view-tcs.facade';
import { provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
import { ViewTcsState } from './view-tcs.state';
import { LoadTcsDetails } from './view-tcs.actions';
import { PaginatePayload, TcsRequestParam } from '@poss-web/shared/models';

describe('View TCS facade Testing Suite action', () => {
  let viewTcsFacade: ViewTcsFacade;

  let store: Store<ViewTcsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ViewTcsFacade]
    });

    viewTcsFacade = TestBed.inject(ViewTcsFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call LoadTcsDetails action', () => {
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };

      const action = new LoadTcsDetails(requestBody);
      viewTcsFacade.loadTcsDetails(requestBody);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should access Error selector', () => {
      expect(viewTcsFacade.getError()).toEqual(viewTcsFacade['error$']);
    });

    it('should access isLoading selector', () => {
      expect(viewTcsFacade.getIsLoading()).toEqual(viewTcsFacade['isLoading$']);
    });

    it('should access TcsDetails selector', () => {
      expect(viewTcsFacade.getTcsDetails()).toEqual(
        viewTcsFacade['tcsDetails$']
      );
    });
  });
});
