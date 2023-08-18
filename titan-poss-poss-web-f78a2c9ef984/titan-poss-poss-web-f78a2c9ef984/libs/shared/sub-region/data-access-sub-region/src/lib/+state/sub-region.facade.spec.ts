import { Store } from '@ngrx/store';
import { SubRegionFacade } from './sub-region.facade';
import { SubRegionState } from './sub-region.state';
import {
  LoadSubRegionByCode,
  ResetSubRegionDialog,
  SaveSubRegionFormDetails,
  EditSubRegionDetails,
  SearchSubRegion,
  LoadRegionDetails,
  LoadSubRegionDetails
} from './sub-region.actions';
import {
  LoadSubRegionDetailsListingPayload,
  EditSubRegionDetailsPayload,
  EditRegionDetailsPayload,
  SaveSubRegionDetailsPayload
} from '@poss-web/shared/models';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Stone Type facade Testing Suite', () => {
  const initialState: SubRegionState = {
    regionDetailsListing: null,
    subRegionDetailsListing: null,
    totalSubRegionDetails: 0,
    error: null,
    isLoading: false,
    subRegionDetailsBySubRegionCode: null,
    saveSubRegionDetailsResponse: null,
    editSubRegionDetailsResponse: null,
    isSearchElements: true
  };

  let subRegionFacade: SubRegionFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), SubRegionFacade]
    });

    subRegionFacade = TestBed.inject(SubRegionFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(subRegionFacade.getError()).toEqual(
        subRegionFacade['regionError$']
      );
    });
    it('should access  getIsRegionListingLoading() selector action', () => {
      expect(subRegionFacade.getIsRegionListingLoading()).toEqual(
        subRegionFacade['isRegionLoading$']
      );
    });
    it('should access  getRegionDetailsListing() selector action', () => {
      expect(subRegionFacade.getRegionDetailsListing()).toEqual(
        subRegionFacade['regionListing$']
      );
    });
    it('should access  getSubRegionDetailsListing() selector action', () => {
      expect(subRegionFacade.getSubRegionDetailsListing()).toEqual(
        subRegionFacade['subRegionListing$']
      );
    });
    it('should access  getRegionByRegionCode() selector action', () => {
      expect(subRegionFacade.getRegionByRegionCode()).toEqual(
        subRegionFacade['regionDetailsByRegionCode$']
      );
    });

    it('should access  getRegionDetailsSaveResponse() selector action', () => {
      expect(subRegionFacade.getRegionDetailsSaveResponse()).toEqual(
        subRegionFacade['isRegionDetailsSaved$']
      );
    });
    it('should access  getRegionDetailsEditResponse() selector action', () => {
      expect(subRegionFacade.getRegionDetailsEditResponse()).toEqual(
        subRegionFacade['isRegionDetailsEdited$']
      );
    });
    it('should access  getTotalRegionDetails() selector action', () => {
      expect(subRegionFacade.getTotalRegionDetails()).toEqual(
        subRegionFacade['totalRegionDetails$']
      );
    });
    it('should access  getIsSerchElements() selector action', () => {
      expect(subRegionFacade.getIsSerchElements()).toEqual(
        subRegionFacade['isSearchElements$']
      );
    });
  });

  describe(' loadRegionDetailsListing ', () => {
    it('should dispatch LoadRegionDetails  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRegionDetails();
      subRegionFacade.loadRegionDetailsListing();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadSubRegionDetailsListing ', () => {
    it('should dispatch LoadRegionDetails  action', inject([Store], store => {
      const parameters: LoadSubRegionDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100,
        parentRegionCode: 'AAA'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSubRegionDetails(parameters);
      subRegionFacade.loadSubRegionDetailsListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadRegionByRegionCode ', () => {
    it('should dispatch LoadSubRegionByCode  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSubRegionByCode(parameters);
      subRegionFacade.loadRegionByRegionCode(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' saveRegionFormDetails ', () => {
    it('should dispatch EditStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveSubRegionDetailsPayload = {
          regionCode: 'AAA',
          description: 'AAA',
          orgCode: 'AAA',
          configDetails: {},
          parentRegionCode: 'AAA',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveSubRegionFormDetails(parameters);
        subRegionFacade.saveRegionFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' editRegionFormDetails ', () => {
    it('should dispatch SaveStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: EditSubRegionDetailsPayload = {
          regionCode: 'AAA',
          description: 'AAA',
          configDetails: {},
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditSubRegionDetails(parameters);
        subRegionFacade.editRegionFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' searchSubRegion ', () => {
    it('should dispatch SearchSubRegion  action', inject([Store], store => {
      const parameters = { regionCode: 'ABC', parentRegionCode: 'AAA' };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchSubRegion(parameters);
      subRegionFacade.searchSubRegion(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' resetRegionDialogData ', () => {
    it('should dispatch ResetSubRegionDialog  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetSubRegionDialog();
        subRegionFacade.resetRegionDialogData();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
