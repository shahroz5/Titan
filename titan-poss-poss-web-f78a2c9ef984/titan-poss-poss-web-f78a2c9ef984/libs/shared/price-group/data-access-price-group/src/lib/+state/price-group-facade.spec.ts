import {
  PriceGroupListPayload,
  UpdatePriceGroupMasterPayload,
  SavePriceGroupMasterPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { PriceGroupState } from './price-group-state';
import { PriceGroupFacade } from './price-group-facade';
import {
  LoadPriceGroup,
  LoadPriceGroupByPriceGroupCode,
  UpdatePricGroupByPriceGroupCode,
  SavePriceGroup,
  SearchPriceGroupList,
  LoadReset
} from './price-group-actions';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Price Group facade Testing Suite', () => {
  const initialState: PriceGroupState = {
    priceGroupList: null,
    priceGroup: null,
    isloading: null,
    error: null,
    totalElements: null,
    hasSaved: null,
    hasUpdated: null
  };

  let priceGroupFacade: PriceGroupFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PriceGroupFacade]
    });

    priceGroupFacade = TestBed.inject<any>(PriceGroupFacade);
  });

  describe(' loadPriceGroupMasterListing ', () => {
    it('should dispatch LoadPriceGroup  action', inject([Store], store => {
      const parameters: PriceGroupListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPriceGroup(parameters);
      priceGroupFacade.loadPriceGroupMasterListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadPriceGroupByPriceGroupCode ', () => {
    it('should dispatch loadPriceGroupByPriceGroupCode  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadPriceGroupByPriceGroupCode(parameters);
        priceGroupFacade.loadPriceGroupByPriceGroupCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' updatePriceGroupByPriceGroupCode ', () => {
    it('should dispatch updatePriceGroupByPriceGroupCode  action', inject(
      [Store],
      store => {
        const parameters: UpdatePriceGroupMasterPayload = {
          priceGroup: 'ABC',
          data: {
            isActive: true
          }
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new UpdatePricGroupByPriceGroupCode(parameters);
        priceGroupFacade.updatePriceGroupByPriceGroupCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' savePriceGroup ', () => {
    it('should dispatch LoadPriceGroup  action', inject([Store], store => {
      const parameters: SavePriceGroupMasterPayload = {
        priceGroup: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SavePriceGroup(parameters);
      priceGroupFacade.savePriceGroup(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' searchPriceGroupList ', () => {
    it('should dispatch searchPriceGroupList  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SearchPriceGroupList(parameters);
        priceGroupFacade.searchPriceGroupList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' loadReset ', () => {
    it('should dispatch loadReset  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadReset();
      priceGroupFacade.loadReset();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
