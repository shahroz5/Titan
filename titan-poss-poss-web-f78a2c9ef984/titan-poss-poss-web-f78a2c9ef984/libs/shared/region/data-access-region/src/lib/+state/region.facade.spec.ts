import { Store } from '@ngrx/store';
import { RegionFacade } from './region.facade';
import { RegionsState } from './region.state';
import {
  LoadRegionByCode,
  ResetRegionDialog,
  SaveRegionFormDetails,
  EditRegionDetails,
  SearchRegion,
  LoadRegionDetails
} from './region.actions';
import {
  LoadRegionListingPayload,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Region facade Testing Suite', () => {
  const initialState: RegionsState = {
    regionDetailsListing: null,
    totalRegionDetails: 0,
    error: null,
    isLoading: false,
    regionDetailsByRegionCode: null,
    saveRegionDetailsResponse: null,
    editRegionDetailsResponse: null
  };

  let regionFacade: RegionFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RegionFacade]
    });

    regionFacade = TestBed.inject(RegionFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(regionFacade.getError()).toEqual(regionFacade['regionError$']);
    });
    it('should access  getIsRegionListingLoading() selector action', () => {
      expect(regionFacade.getIsRegionListingLoading()).toEqual(
        regionFacade['isRegionLoading$']
      );
    });
    it('should access  getRegionDetailsListing() selector action', () => {
      expect(regionFacade.getRegionDetailsListing()).toEqual(
        regionFacade['regionListing$']
      );
    });
    it('should access  getRegionByRegionCode() selector action', () => {
      expect(regionFacade.getRegionByRegionCode()).toEqual(
        regionFacade['regionDetailsByRegionCode$']
      );
    });

    it('should access  getRegionDetailsSaveResponse() selector action', () => {
      expect(regionFacade.getRegionDetailsSaveResponse()).toEqual(
        regionFacade['isRegionDetailsSaved$']
      );
    });
    it('should access  getRegionDetailsEditResponse() selector action', () => {
      expect(regionFacade.getRegionDetailsEditResponse()).toEqual(
        regionFacade['isRegionDetailsEdited$']
      );
    });
    it('should access  getTotalRegionDetails() selector action', () => {
      expect(regionFacade.getTotalRegionDetails()).toEqual(
        regionFacade['totalRegionDetails$']
      );
    });
  });

  describe(' loadRegionDetailsListing ', () => {
    it('should dispatch LoadRegionDetails  action', inject([Store], store => {
      const parameters: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRegionDetails(parameters);
      regionFacade.loadRegionDetailsListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadRegionByRegionCode ', () => {
    it('should dispatch LoadRegionByCode  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRegionByCode(parameters);
      regionFacade.loadRegionByRegionCode(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' saveRegionFormDetails ', () => {
    it('should dispatch EditStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveRegionDetailsPayload = {
          regionCode: 'AAA',
          description: 'AAA',
          orgCode: 'AAA',
          configDetails: {},
          parentRegionCode: 'AAA',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveRegionFormDetails(parameters);
        regionFacade.saveRegionFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' editRegionFormDetails ', () => {
    it('should dispatch SaveStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: EditRegionDetailsPayload = {
          regionCode: 'AAA',
          description: 'AAA',
          configDetails: {},
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditRegionDetails(parameters);
        regionFacade.editRegionFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' searchRegion ', () => {
    it('should dispatch SearchRegion  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchRegion(parameters);
      regionFacade.searchRegion(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' resetRegionDialogData ', () => {
    it('should dispatch ResetRegionDialog  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetRegionDialog();
      regionFacade.resetRegionDialogData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
