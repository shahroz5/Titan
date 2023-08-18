import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ItemDetailsPopupFacade } from './item-details-popup.facade';
import { ItemDetailsPopupState } from './item-details-popup.state';

import { initialState } from './item-details-popup.reducer';
import {
  Clear,
  LoadPcDesc,
  LoadPgDesc,
  LoadStoneDetails
} from './item-details-popup.actions';

describe('Item Detail Popup Testing Suite   ', () => {
  let itemDetailsPopupFacade: ItemDetailsPopupFacade;

  let store: Store<ItemDetailsPopupState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ItemDetailsPopupFacade]
    });

    itemDetailsPopupFacade = TestBed.inject(ItemDetailsPopupFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions  ', () => {
    it('should call load Stone Details action  ', () => {
      const payload: { itemCode: string; lotNumber: string | number } = {
        itemCode: '512115DVAABAP5',
        lotNumber: '2BA000002'
      };
      const action = new LoadStoneDetails(payload);
      itemDetailsPopupFacade.loadStoneDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call load Pc Desc action  ', () => {
      const action = new LoadPcDesc();
      itemDetailsPopupFacade.loadPcDesc();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call load Pg Desc action  ', () => {
      const action = new LoadPgDesc();
      itemDetailsPopupFacade.loadPgDesc();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call load clear action  ', () => {
      const action = new Clear();
      itemDetailsPopupFacade.clear();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector selector ', () => {
    it('should access Stone details selector ', () => {
      expect(itemDetailsPopupFacade.getStoneDetails()).toEqual(
        itemDetailsPopupFacade['stoneDetails$']
      );
    });

    it('should access loading status  selector ', () => {
      expect(itemDetailsPopupFacade.getIsLoading()).toEqual(
        itemDetailsPopupFacade['isLoading$']
      );
    });

    it('should access error  selector ', () => {
      expect(itemDetailsPopupFacade.getError()).toEqual(
        itemDetailsPopupFacade['error$']
      );
    });

    it('should access pcDesc  selector ', () => {
      expect(itemDetailsPopupFacade.getPcDesc()).toEqual(
        itemDetailsPopupFacade['pcDesc$']
      );
    });
    it('should access pgDesc  selector ', () => {
      expect(itemDetailsPopupFacade.getPgDesc()).toEqual(
        itemDetailsPopupFacade['pgDesc$']
      );
    });

    it('should access isDescLoaded  selector ', () => {
      expect(itemDetailsPopupFacade.getIsDescLoaded()).toEqual(
        itemDetailsPopupFacade['isDescLoaded$']
      );
    });
  });
});
