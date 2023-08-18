import {
  LoadComplexityPriceGroupListingPayload,
  SaveComplexityPriceGroupFormPayload,
  EditComplexityPriceGroupFormPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { ComplexityPricegroupState } from './complexity-pricegroup-map.state';
import { ComplexityPricegroupFacade } from './complexity-pricegroup-map.facade';

import {
  LoadComplexityPricegroupMappingDetails,
  LoadComplexityPricegroupMappingDetailsById,
  ResetComplexityPricegroupDialog,
  SaveComplexityPricegroupFormDetails,
  EditComplexityPricegroupFormDetails,
  LoadComplexityCode,
  LoadPricegroup
} from './complexity-pricegroup-map.actions';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('ComplexityPriceGroup facade Testing Suite', () => {
  const initialState: ComplexityPricegroupState = {
    error: null,
    complexityPricegroupListing: null,
    complexityPricegroupDetails: null,
    totalComplexityPricegroupDetails: 0,
    isLoading: false,
    savecomplexityPricegroup: null,
    editcomplexityPricegroup: null,
    complexityCode: null,
    pricegroup: null
  };

  let complexityPricegroupFacade: ComplexityPricegroupFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        ComplexityPricegroupFacade
      ]
    });

    complexityPricegroupFacade = TestBed.get(ComplexityPricegroupFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(complexityPricegroupFacade.getError()).toEqual(
        complexityPricegroupFacade['hasError$']
      );
    });
    it('should access  getisLoading() selector action', () => {
      expect(complexityPricegroupFacade.getisLoading()).toEqual(
        complexityPricegroupFacade['isLoading$']
      );
    });
    it('should access  getcomplexityPricegroupDetailsListing() selector action', () => {
      expect(
        complexityPricegroupFacade.getcomplexityPricegroupDetailsListing()
      ).toEqual(complexityPricegroupFacade['complexityPricegroupListing$']);
    });
    it('should access  getcomplexityPricegroupDetailsById() selector action', () => {
      expect(
        complexityPricegroupFacade.getcomplexityPricegroupDetailsById()
      ).toEqual(complexityPricegroupFacade['ComplexityPricegroupDetailsById$']);
    });

    it('should access  getcomplexityPricegroupSaveResponse() selector action', () => {
      expect(
        complexityPricegroupFacade.getcomplexityPricegroupSaveResponse()
      ).toEqual(complexityPricegroupFacade['isComplexityPricegroupSaved$']);
    });
    it('should access  getcomplexityPricegroupEditResponse() selector action', () => {
      expect(
        complexityPricegroupFacade.getcomplexityPricegroupEditResponse()
      ).toEqual(complexityPricegroupFacade['isComplexityPricegroupEdited$']);
    });
    it('should access  getTotalcomplexityPricegroupDetails() selector action', () => {
      expect(
        complexityPricegroupFacade.getTotalcomplexityPricegroupDetails()
      ).toEqual(
        complexityPricegroupFacade['totalcomplexityPricegroupDetails$']
      );
    });
    it('should access  getComplexityCode() selector action', () => {
      expect(complexityPricegroupFacade.getComplexityCode()).toEqual(
        complexityPricegroupFacade['complexityCodeDetails$']
      );
    });
    it('should access  getPriceGroup() selector action', () => {
      expect(complexityPricegroupFacade.getPriceGroup()).toEqual(
        complexityPricegroupFacade['priceGroupDetails$']
      );
    });
  });

  describe('LoadComplexityPricegroupListing ', () => {
    it('should dispatch LoadComplexityPricegroupMappingDetails  action', inject(
      [Store],
      store => {
        const parameters: LoadComplexityPriceGroupListingPayload = {
          pageIndex: 0,
          pageSize: 100
        };
        const param2 = 'aaa';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadComplexityPricegroupMappingDetails(
          parameters,
          param2
        );
        complexityPricegroupFacade.loadcomplexityPricegroupDetailsListing(
          parameters,
          param2
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' LoadComplexityPricegroupMappingDetailsById ', () => {
    it('should dispatch LoadComplexityPricegroupMappingDetailsById  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadComplexityPricegroupMappingDetailsById(
          parameters
        );
        complexityPricegroupFacade.loadComplexityPricegroupDetailsById(
          parameters
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' EditComplexityPriceGroupFormDetails ', () => {
    it('should dispatch EditComplexityPriceGroupFormDetails  action', inject(
      [Store],
      store => {
        const parameters: EditComplexityPriceGroupFormPayload = {
          id: 'ab',
          complexityCode: 'abc',
          priceGroup: 'abc',
          makingChargePunit: 'abc',
          makingChargePgram: 'abc',
          wastagePct: 'abc',
          makingChargePct: 'abc'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditComplexityPricegroupFormDetails(
          parameters
        );
        complexityPricegroupFacade.editComplexityPricegroupFormDetails(
          parameters
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SaveComplexityPriceGroupFormDetails ', () => {
    it('should dispatch SaveComplexityPriceGroupFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveComplexityPriceGroupFormPayload = {
          complexityCode: 'abc',
          priceGroup: 'abc',
          makingChargePunit: 'abc',
          makingChargePgram: 'abc',
          wastagePct: 'abc',
          makingChargePct: 'abc'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveComplexityPricegroupFormDetails(
          parameters
        );
        complexityPricegroupFacade.saveComplexityPricegroupFormDetails(
          parameters
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' loadComplexityCodes ', () => {
    it('should dispatch loadComplexityCodes  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadComplexityCode();
      complexityPricegroupFacade.loadComplexityCodes();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadPricegroups ', () => {
    it('should dispatch loadPricegroups  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPricegroup();
      complexityPricegroupFacade.loadPricegroups();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' ResetComplexityPricegroupDialog ', () => {
    it('should dispatch ResetComplexityPricegroupDialog  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetComplexityPricegroupDialog();
        complexityPricegroupFacade.resetComplexityPricegroupDialogData();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
