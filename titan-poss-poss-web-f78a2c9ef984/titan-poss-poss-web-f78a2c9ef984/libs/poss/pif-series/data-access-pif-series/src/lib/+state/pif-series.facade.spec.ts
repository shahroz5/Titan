import { PIFSeriesState } from './pif-series.state';
import { PIFSeriesFacade } from './pif-series.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  PIFSeriesPayload,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import {
  LoadPIFSeries,
  ResetPIFSeries,
  SavePIFSeries
} from './pif-series.actions';
describe('PIFSeries Facade Testing Suite', () => {
  const initialState: PIFSeriesState = {
    pifSeries: null,
    error: null,
    hasSaved: false,
    isLoading: false,
    totalElements: 0
  };
  let pifSeriesFacade: PIFSeriesFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PIFSeriesFacade]
    });
    pifSeriesFacade = TestBed.inject(PIFSeriesFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_PIF_SERIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const listPayload: PIFSeriesPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPIFSeries(listPayload);
      pifSeriesFacade.loadPIFSeries(listPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_PIF_SERIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const savePayload: SavePIFSeriesPayload[] = [
        {
          fromNo: 120,
          id: 'ABC',
          toNo: 121
        }
      ];
      const action = new SavePIFSeries(savePayload);
      pifSeriesFacade.savePIFSeries(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_PIF_SERIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetPIFSeries();
      pifSeriesFacade.resetPIFSeries();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selectors', () => {
    it('should access the get pif series listing', () => {
      expect(pifSeriesFacade.getPIFSeries()).toEqual(
        pifSeriesFacade['pifSeriess$']
      );
    });
    it('should access the get error', () => {
      expect(pifSeriesFacade.getError()).toEqual(pifSeriesFacade['error$']);
    });
    it('should access the get isLoading', () => {
      expect(pifSeriesFacade.getIsLoading()).toEqual(
        pifSeriesFacade['isLoading$']
      );
    });
    it('should access the get hasSaved', () => {
      expect(pifSeriesFacade.getHasSaved()).toEqual(
        pifSeriesFacade['hasSaved$']
      );
    });
    it('should access the get totalElements', () => {
      expect(pifSeriesFacade.getTotalElements()).toEqual(
        pifSeriesFacade['totalElements$']
      );
    });
  });
});
