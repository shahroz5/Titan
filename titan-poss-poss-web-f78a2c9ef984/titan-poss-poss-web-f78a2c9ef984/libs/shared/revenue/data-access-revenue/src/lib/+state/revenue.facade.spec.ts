import { initialState } from './revenue.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { RevenueFacade } from './revenue.facade';
import { provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
import { RevenueState } from './revenue.state';
import {
  GetGhsRevenueList,
  GetTodayRevenueList,
  LoadRevenueList,
  ResetError
} from './revenue.actions';
import { PaginatePayload } from '@poss-web/shared/models';

describe('Revenue facade Testing Suite action', () => {
  let revenueFacade: RevenueFacade;

  let store: Store<RevenueState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RevenueFacade]
    });

    revenueFacade = TestBed.inject(RevenueFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call LoadRevenueList action', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };

      const action = new LoadRevenueList(payload, requestBody);
      revenueFacade.loadDayWiseReveune(payload, requestBody);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetTodayRevenueList action', () => {
      const payload = '';
      const businessDate = '';

      const action = new GetTodayRevenueList(payload);
      revenueFacade.loadTodayReveune(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetGhsRevenueList action', () => {
      const payload = '';

      const action = new GetGhsRevenueList(payload);
      revenueFacade.loadGhsReveune(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetError action', () => {
      const action = new ResetError();
      revenueFacade.resetError();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access DayWiseRevenueList selector', () => {
      expect(revenueFacade.getDayWiseRevenueList()).toEqual(
        revenueFacade['dayWiseRevenueList$']
      );
    });

    it('should access TodayRevenueList selector', () => {
      expect(revenueFacade.getTodayRevenueList()).toEqual(
        revenueFacade['todayRevenueList$']
      );
    });

    it('should access GhsRevenueList selector', () => {
      expect(revenueFacade.getGhsRevenueList()).toEqual(
        revenueFacade['ghsRevenueList$']
      );
    });

    it('should access Error selector', () => {
      expect(revenueFacade.getError()).toEqual(revenueFacade['error$']);
    });

    it('should access isLoading selector', () => {
      expect(revenueFacade.getIsLoading()).toEqual(revenueFacade['isLoading$']);
    });
  });
});
