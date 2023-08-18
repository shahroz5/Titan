import { BinState } from './bin.state';
import { BinFacade } from './bin.facade';
import {
  SaveBinCodeFormPayload,
  BinCodeEditedFormPayload,
  LocationsByBinGroupAndBinCodePayload,
  LocationMappingPostPayload,
  LoadBinGroupDetailsListingPayload,
  BinCodeSaveModel
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  SaveBinCodeNewFormDetails,
  ResetBinCodeDialog,
  LoadBinCodeDetails,
  LoadBinCodesByBinGroupCode,
  EditBinCodeFormDetails,
  SearchBinName,
  LoadLocationsByBinGroupAndBinCode,
  SaveLocationMappingDetails
} from './bin.actions';
describe('Bin facade Testing Suite', () => {
  const initialState: BinState = {
    error: null,
    binCodeSaveNewResponses: null,
    binCodeDetailsListing: null,
    totalBinCodeDetails: 0,
    binCodesByBinGroup: null,
    isBinCodeLoading: false,
    editBinCodeResponses: null,
    locationsByBinCodesAndBinGroup: null,
    locationMappingResponse: null,
    isSearchElements: true
  };

  let binFacade: BinFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BinFacade]
    });

    binFacade = TestBed.inject(BinFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(binFacade.getError()).toEqual(binFacade['binCodeError$']);
    });
    it('should access  getBinCodeIsLoading() selector action', () => {
      expect(binFacade.getBinCodeIsLoading()).toEqual(
        binFacade['isBinCodeLoading$']
      );
    });
    it('should access  getBinCodeDetailsListing() selector action', () => {
      expect(binFacade.getBinCodeDetailsListing()).toEqual(
        binFacade['binCodeDetailsListing$']
      );
    });
    it('should access  getBinCodesByBinGroup() selector action', () => {
      expect(binFacade.getBinCodesByBinGroup()).toEqual(
        binFacade['binCodesByBinGroupCode$']
      );
    });

    it('should access  getBinCodeNewSaveResponse() selector action', () => {
      expect(binFacade.getBinCodeNewSaveResponse()).toEqual(
        binFacade['isBinCodeNewSaved$']
      );
    });
    it('should access  getBinCodeEditSaveResponse() selector action', () => {
      expect(binFacade.getBinCodeEditSaveResponse()).toEqual(
        binFacade['isBinCodeEditSaved$']
      );
    });
    it('should access  getTotalBinCodeDetails() selector action', () => {
      expect(binFacade.getTotalBinCodeDetails()).toEqual(
        binFacade['totalBinCodeDetails$']
      );
    });
    it('should access  getLocationsByBinCodesAndBinGroup() selector action', () => {
      expect(binFacade.getLocationsByBinCodesAndBinGroup()).toEqual(
        binFacade['locationsByBinCodesAndBinGroup$']
      );
    });
    it('should access  getLocationMappingResponse() selector action', () => {
      expect(binFacade.getLocationMappingResponse()).toEqual(
        binFacade['isLocationMappingSaved$']
      );
    });
    it('should access  getIsSerchElements() selector action', () => {
      expect(binFacade.getIsSerchElements()).toEqual(
        binFacade['isSearchElements$']
      );
    });
  });

  describe(' loadRegionDetailsListing ', () => {
    it('should dispatch LoadBinCodeDetails  action', inject([Store], store => {
      const parameters: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBinCodeDetails(parameters);
      binFacade.loadBinCodeDetailsListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadBinCodesByBinGroupCode ', () => {
    it('should dispatch LoadBinCodesByBinGroupCode  action', inject(
      [Store],
      store => {
        const parameters = { binGroupCode: 'aaa', pageIndex: 0, pageSize: 10 };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadBinCodesByBinGroupCode(parameters);
        binFacade.loadBinCodesByBinGroupCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' saveBinCodeNewFormDetails ', () => {
    it('should dispatch SaveBinCodeNewFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveBinCodeFormPayload = {
          binCode: 'aaa',
          binGroups: ['AAA'],
          description: 'aaa'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveBinCodeNewFormDetails(parameters);
        binFacade.saveBinCodeNewFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' saveBinCodeEditedFormDetails ', () => {
    it('should dispatch EditBinCodeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: BinCodeSaveModel = {
          binCode: 'aaa',
          binGroups: [{ binGroupCode: 'aaa', isActive: true }],
          description: 'aaa'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditBinCodeFormDetails(parameters);
        binFacade.saveBinCodeEditedFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' searchBinName ', () => {
    it('should dispatch SearchBinName  action', inject([Store], store => {
      const parameters = { binCode: 'ABC', binGroupCode: 'AAA' };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchBinName(parameters);
      binFacade.searchBinName(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' resetBinCodeDialogData ', () => {
    it('should dispatch ResetBinCodeDialog  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetBinCodeDialog();
      binFacade.resetBinCodeDialogData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadLocationsByBinCodesAndBinGroup ', () => {
    it('should dispatch LoadLocationsByBinGroupAndBinCode  action', inject(
      [Store],
      store => {
        const parameters: LocationsByBinGroupAndBinCodePayload = {
          binGroup: 'aaa',
          binCodes: ['aaa']
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadLocationsByBinGroupAndBinCode(
          parameters
        );
        binFacade.loadLocationsByBinCodesAndBinGroup(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' saveLocationMappingDetails ', () => {
    it('should dispatch SaveLocationMappingDetails  action', inject(
      [Store],
      store => {
        const parameters: LocationMappingPostPayload = {
          binGroup: 'aaa',
          data: { addLocations: [], binCodes: [], removeLocations: [] }
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveLocationMappingDetails(parameters);
        binFacade.saveLocationMappingDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
