import { LoadStoneListingPayload, StoneFilter } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { StoneState } from './stone.state';
import { StoneFacade } from './stone.facade';
import { FilterStone, ResetFilter, SearchStoneCode } from './stone.actions';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Stone  facade Testing Suite', () => {
  const initialState: StoneState = {
    stoneListing: null,
    totalStoneDetails: 0,
    isLoading: false,
    error: null,
    stonefilter: null
  };

  let stoneFacade: StoneFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), StoneFacade]
    });

    stoneFacade = TestBed.inject(StoneFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(stoneFacade.getError()).toEqual(stoneFacade['hasError$']);
    });
    it('should access  getisLoading() selector action', () => {
      expect(stoneFacade.getisLoading()).toEqual(stoneFacade['isLoading$']);
    });
    it('should access  getStoneDetailsListing() selector action', () => {
      expect(stoneFacade.getStoneDetailsListing()).toEqual(
        stoneFacade['stoneListing$']
      );
    });
    it('should access  getTotalStoneDetails() selector action', () => {
      expect(stoneFacade.getTotalStoneDetails()).toEqual(
        stoneFacade['totalStoneDetails$']
      );
    });
    it('should access  getStoneFilter() selector action', () => {
      expect(stoneFacade.getStoneFilter()).toEqual(stoneFacade['stoneFilter$']);
    });
  });

  describe(' loadStoneListing ', () => {
    it('should dispatch FilterStone  action', inject([Store], store => {
      const parameters: StoneFilter = {
        payloadData: {
          color: 'AAA',
          fromStdValue: 10,
          quality: 'AAA',
          ratePerCarat: 10,
          stoneCode: 'AAA',
          stoneTypeCode: 'AAA',
          toStdValue: 10
        },
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new FilterStone(parameters);
      stoneFacade.loadFilteredStoneList(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' ResetFilter ', () => {
    it('should dispatch ResetFilter  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetFilter();
      stoneFacade.loadResetFilter();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
