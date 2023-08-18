import { Store } from '@ngrx/store';
import { BinGroupFacade } from './bin-group.facade';
import { BinGroupState } from './bin-group.state';
import {
  LoadBinGroupDetails,
  ResetBinGroupDialog,
  SaveBinGroupFormDetails,
  EditBinGroupFormDetails,
  SearchByBinGroupCode,
  LoadBinGroupByBinGroupCode,
  SearchClear
} from './bin-group.actions';
import {
  LoadBinGroupDetailsListingPayload,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Stone Type facade Testing Suite', () => {
  const initialState: BinGroupState = {
    binGroupDetailsListing: null,
    binGroupDetails: null,
    totalBinGroupDetails: 0,
    isLoading: false,
    saveBinGroupResponses: null,
    editBinGroupResponses: null,
    error: null,
    isSearchElements: true
  };

  let binGroupFacade: BinGroupFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BinGroupFacade]
    });

    binGroupFacade = TestBed.inject(BinGroupFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(binGroupFacade.getError()).toEqual(
        binGroupFacade['binGroupError$']
      );
    });
    it('should access  getisLoading() selector action', () => {
      expect(binGroupFacade.getisLoading()).toEqual(
        binGroupFacade['isLoading$']
      );
    });
    it('should access  getBinGroupDetailsListing() selector action', () => {
      expect(binGroupFacade.getBinGroupDetailsListing()).toEqual(
        binGroupFacade['binGroupDetailsListing$']
      );
    });
    it('should access  getBinGroupDetailsByBinGroupCode() selector action', () => {
      expect(binGroupFacade.getBinGroupDetailsByBinGroupCode()).toEqual(
        binGroupFacade['binGroupDetailsByBinGroupCode$']
      );
    });

    it('should access  getBinGroupSaveResponse() selector action', () => {
      expect(binGroupFacade.getBinGroupSaveResponse()).toEqual(
        binGroupFacade['isBinGroupSaved$']
      );
    });
    it('should access  getBinGroupEditResponse() selector action', () => {
      expect(binGroupFacade.getBinGroupEditResponse()).toEqual(
        binGroupFacade['isBinGroupEdited$']
      );
    });
    it('should access  getTotalBinGroupDetails() selector action', () => {
      expect(binGroupFacade.getTotalBinGroupDetails()).toEqual(
        binGroupFacade['totalBinGroupDetails$']
      );
    });
    it('should access  getIsSerchElements() selector action', () => {
      expect(binGroupFacade.getIsSerchElements()).toEqual(
        binGroupFacade['isSearchElements$']
      );
    });
  });

  describe(' loadBinGroupDetailsListing ', () => {
    it('should dispatch LoadBinGroupDetails  action', inject([Store], store => {
      const parameters: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBinGroupDetails(parameters);
      binGroupFacade.loadBinGroupDetailsListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadBinGroupDetailsByBinGroupCode ', () => {
    it('should dispatch LoadBinGroupDetails  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBinGroupByBinGroupCode(parameters);
      binGroupFacade.loadBinGroupDetailsByBinGroupCode(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' saveBinGroupFormDetails ', () => {
    it('should dispatch EditStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveBinGroupFormDetailsPayload = {
          binGroupCode: 'AAA',
          description: 'AAA',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveBinGroupFormDetails(parameters);
        binGroupFacade.saveBinGroupFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' editBinGroupFormDetails ', () => {
    it('should dispatch SaveStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveBinGroupFormDetailsPayload = {
          binGroupCode: 'AAA',
          description: 'AAA',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditBinGroupFormDetails(parameters);
        binGroupFacade.editBinGroupFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' searchBinGroup ', () => {
    it('should dispatch SearchByBinGroupCode  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SearchByBinGroupCode(parameters);
        binGroupFacade.searchBinGroup(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' resetBinGroupDialogData ', () => {
    it('should dispatch ResetBinGroupDialog  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetBinGroupDialog();
      binGroupFacade.resetBinGroupDialogData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' clearSearch ', () => {
    it('should dispatch SearchClear  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchClear();
      binGroupFacade.clearSearch();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
