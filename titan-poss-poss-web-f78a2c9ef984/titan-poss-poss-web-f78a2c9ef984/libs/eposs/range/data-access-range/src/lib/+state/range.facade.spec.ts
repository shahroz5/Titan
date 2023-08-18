import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { RangeFacade } from './range.facade';
import { initialState } from './range.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { LoadRanges, ResetRanges, SaveRanges } from './range.actions';
import { ConfigurationRanges } from '@poss-web/shared/models';
describe('Range Facade Testing Suite', () => {
  let rangeFacade: RangeFacade;
  let store: Store;
  const ranges: ConfigurationRanges[] = [
    {
      fromRange: '70',
      toRange: '80',
      id: 'abc123',
      rowId: 1,
      isActive: true
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RangeFacade]
    });
    rangeFacade = TestBed.inject(RangeFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadRanges('GEP_CONFIG');
      rangeFacade.loadRanges('GEP_CONFIG');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_RANGES', () => {
      const savePayload = {
        rangeType: 'GEP_PURITY',
        savePayload: { fromRange: '12', toRange: '13', rowId: '1' }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveRanges(savePayload);
      rangeFacade.saveRanges(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetRanges();
      rangeFacade.resetRanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selectors', () => {
    it('should access the get error', () => {
      expect(rangeFacade.getError()).toEqual(rangeFacade['error$']);
    });
    it('should access the get isloading', () => {
      expect(rangeFacade.getIsLoading()).toEqual(rangeFacade['isLoading$']);
    });

    it('should access the get hasaved', () => {
      expect(rangeFacade.getHasSaved()).toEqual(rangeFacade['hasSaved$']);
    });

    it('should access the get ranges', () => {
      expect(rangeFacade.getRanges()).toEqual(rangeFacade['ranges$']);
    });
  });
});
