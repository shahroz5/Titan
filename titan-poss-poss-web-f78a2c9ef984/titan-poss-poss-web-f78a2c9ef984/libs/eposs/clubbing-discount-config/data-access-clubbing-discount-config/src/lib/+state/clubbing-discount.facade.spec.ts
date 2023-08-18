import { Store } from '@ngrx/store';
import {
  LoadClubbingDiscountConfigList,
  SaveClubbingDiscountConfigList,
  LoadType1Discounts,
  LoadType2Discounts,
  LoadType3Discounts,
  ResetClubbingDiscountConfigList,
  DeleteClubbingDiscountConfigList
} from './clubbing-discount.actions';
import {
  ClubDiscountsList,
  ClubDiscountsListPayload,
  ClubDiscountsSuccessList,
  DiscountTypeBasedCodes,
  SaveRulesPayload
} from '@poss-web/shared/models';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { clubDiscountsAdapter } from './clubbing-discount.entity';
import { ClubDiscountsFacade } from './clubbing-discount.facade';
import { ClubDiscountsState } from './clubbing-discount.state';

describe('Country facade Testing Suite', () => {
  const initialState: ClubDiscountsState = {
    error: null,
    clubbedDiscountList: clubDiscountsAdapter.getInitialState(),
    isLoading: false,
    hasSaved: null,
    totalCount: 0,
    saveclubbedDiscounts: null,
    discountCodesType1: null,
    discountCodesType2: null,
    discountCodesType3: null
  };

  let clubbingDiscountsFacade: ClubDiscountsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ClubDiscountsFacade]
    });

    clubbingDiscountsFacade = TestBed.inject(ClubDiscountsFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(clubbingDiscountsFacade.getError()).toEqual(
        clubbingDiscountsFacade['hasError$']
      );
    });
    it('should access  getIsLoading() selector action', () => {
      expect(clubbingDiscountsFacade.getIsLoading()).toEqual(
        clubbingDiscountsFacade['isLoading$']
      );
    });

    it('should access  getIsSaved() selector action', () => {
      expect(clubbingDiscountsFacade.getIsSaved()).toEqual(
        clubbingDiscountsFacade['isSaved$']
      );
    });
    it('should access  getClubbedDiscountList() selector action', () => {
      expect(clubbingDiscountsFacade.getClubbedDiscountList()).toEqual(
        clubbingDiscountsFacade['glClubbedDiscountList$']
      );
    });
    it('should access  getType1DiscountCodes() selector action', () => {
      expect(clubbingDiscountsFacade.getType1DiscountCodes()).toEqual(
        clubbingDiscountsFacade['discountCodesType1$']
      );
    });
    it('should access  getType2DiscountCodes() selector action', () => {
      expect(clubbingDiscountsFacade.getType2DiscountCodes()).toEqual(
        clubbingDiscountsFacade['discountCodesType2$']
      );
    });
    it('should access  getType3DiscountCodes() selector action', () => {
      expect(clubbingDiscountsFacade.getType3DiscountCodes()).toEqual(
        clubbingDiscountsFacade['discountCodesType3$']
      );
    });
    it('should access  getTotalElements() selector action', () => {
      expect(clubbingDiscountsFacade.getTotalElements()).toEqual(
        clubbingDiscountsFacade['totalElements$']
      );
    });
  });

  describe('loadClubbedDiscountsList ', () => {
    it('should dispatch LoadGlLocationPaymentList  action', inject(
      [Store],
      store => {
        const parameters: ClubDiscountsListPayload = {
          pageIndex: 0,
          pageSize: 100
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadClubbingDiscountConfigList(parameters);
        clubbingDiscountsFacade.loadClubbedDiscountsList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' loadType1DiscountCodes ', () => {
    it('should dispatch loadType1DiscountCodes  action', inject(
      [Store],
      store => {
        const parameter = 'TYPE1';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadType1Discounts(parameter);
        clubbingDiscountsFacade.loadType1DiscountCodes(parameter);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' loadType2DiscountCodes ', () => {
    it('should dispatch loadType2DiscountCodes  action', inject(
      [Store],
      store => {
        const parameter = 'TYPE2';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadType2Discounts(parameter);
        clubbingDiscountsFacade.loadType2DiscountCodes(parameter);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' loadType3DiscountCodes ', () => {
    it('should dispatch loadType3DiscountCodes  action', inject(
      [Store],
      store => {
        const parameter = 'TYPE3';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadType3Discounts(parameter);
        clubbingDiscountsFacade.loadType3DiscountCodes(parameter);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SaveClubbingDiscountConfigList ', () => {
    it('should dispatch SaveClubbingDiscountConfigList  action', inject(
      [Store],
      store => {
        const parameters: SaveRulesPayload = {
          addRules: [
            {
              type1DiscountCode: 'AAA',
              type2DiscountCode: 'BBB',
              type3DiscountCode: 'CCC'
            }
          ],
          removeRules: []
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveClubbingDiscountConfigList(parameters);
        clubbingDiscountsFacade.saveClubbedDiscountList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' ResetClubbingDiscountConfigList ', () => {
    it('should dispatch ResetClubbingDiscountConfigList  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetClubbingDiscountConfigList();
        clubbingDiscountsFacade.resetData();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' DeleteClubbingDiscountConfigList ', () => {
    it('should dispatch DeleteClubbingDiscountConfigList  action', inject(
      [Store],
      store => {
        const id = '345678';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DeleteClubbingDiscountConfigList(id);
        clubbingDiscountsFacade.deleteRowData(id);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
