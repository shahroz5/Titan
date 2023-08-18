import {
  SubBrandListingPayload,
  UpadateIsActivePayload,
  UpdateBrandMasterDetailsPayload,
  SearchPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SubBrandState } from './subbrand.state';
import { SubbrandFacade } from './subbrand.facade';
import {
  LoadSubBrandListing,
  LoadParenBrands,
  LoadSubrandDetailsByBrandCode,
  UpdateIsActive,
  SaveSubBrandMasterDetails,
  UpdateSubBrandMasterDetails,
  SearchSubBrandByBrandCode,
  LoadReset,
  ResetIsActiveToggle
} from './subbrand.actions';

describe('Subbrand facade Testing Suite', () => {
  const initialState: SubBrandState = {
    subBrandList: null,
    subBrandDetails: null,
    isLoading: null,
    error: null,
    totalElements: null,
    hasSaved: null,
    hasUpdated: null,
    isActiveUpdated: null,
    parentBrands: []
  };

  let subbrandFacade: SubbrandFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), SubbrandFacade]
    });

    subbrandFacade = TestBed.inject<any>(SubbrandFacade);
  });

  describe(' loadSubBrandMasterList ', () => {
    it('should dispatch LoadSubBrandListing  action', inject([Store], store => {
      const parameters: SubBrandListingPayload = {
        pageEvent: { pageIndex: 0, pageSize: 100 },
        parentBrandCode: ''
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSubBrandListing(parameters);
      subbrandFacade.loadSubBrandMasterList(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadParentMasterList ', () => {
    it('should dispatch LoadParenBrands  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadParenBrands();
      subbrandFacade.loadParentMasterList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadSubBrandDetailsByBrandCode ', () => {
    it('should dispatch LoadSubrandDetailsByBrandCode  action', inject(
      [Store],
      store => {
        const parameters = 'Titan';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSubrandDetailsByBrandCode(parameters);
        subbrandFacade.loadSubBrandDetailsByBrandCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' upDateIsactive ', () => {
    it('should dispatch UpdateIsActive  action', inject([Store], store => {
      const parameters: UpadateIsActivePayload = {
        brandCode: 'titan',
        isActive: true
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateIsActive(parameters);
      subbrandFacade.upDateIsactive(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' saveSubBrandMasterDetails ', () => {
    it('should dispatch SaveSubBrandMasterDetails  action', inject(
      [Store],
      store => {
        const parameters = {
          brandCode: 'tanishq',
          description: 'ABC',
          parentBrandCode: 'titan',
          configDetails: {},
          orgCode: 'TJ',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveSubBrandMasterDetails(parameters);
        subbrandFacade.saveSubBrandMasterDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' updateSubBrandMasterDetails ', () => {
    it('should dispatch UpdateSubBrandMasterDetails  action', inject(
      [Store],
      store => {
        const parameters: UpdateBrandMasterDetailsPayload = {
          brandCode: 'tanishq',
          data: {
            isActive: false
          }
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new UpdateSubBrandMasterDetails(parameters);
        subbrandFacade.updateSubBrandMasterDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' searchSubBrand ', () => {
    it('should dispatch SearchSubBrandByBrandCode  action', inject(
      [Store],
      store => {
        const parameters: SearchPayload = {
          brandCode: 'tanishq',
          parentBrandCode: 'Titan'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SearchSubBrandByBrandCode(parameters);
        subbrandFacade.searchSubBrand(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' loadReset ', () => {
    it('should dispatch loadReset  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadReset();
      subbrandFacade.loadReset();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' resetIsActiveToggle ', () => {
    it('should dispatch ResetIsActiveToggle  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetIsActiveToggle();
      subbrandFacade.resetIsActiveToggle();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Access Selector action', () => {
    it('should access the getSubBrandMasterList selector action', () => {
      expect(subbrandFacade.getSubBrandMasterList()).toEqual(
        subbrandFacade['subBrandList$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(subbrandFacade.getHasSaved()).toEqual(subbrandFacade['hasSaved$']);
    });

    it('should access the getHasUpdated selector action', () => {
      expect(subbrandFacade.getHasUpdated()).toEqual(
        subbrandFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(subbrandFacade.getIsloading()).toEqual(
        subbrandFacade['isLoading$']
      );
    });

    it('should access the getIsActiveToggle selector action', () => {
      expect(subbrandFacade.getIsActiveToggle()).toEqual(
        subbrandFacade['isActiveToggle$']
      );
    });

    it('should access the getError selector action', () => {
      expect(subbrandFacade.getError()).toEqual(subbrandFacade['hasError$']);
    });

    it('should access the getTotalElements selector action', () => {
      expect(subbrandFacade.getTotalElements()).toEqual(
        subbrandFacade['totalElements$']
      );
    });

    it('should access the getParentBrandList selector action', () => {
      expect(subbrandFacade.getParentBrandList()).toEqual(
        subbrandFacade['parentBrandList$']
      );
    });
  });
});
