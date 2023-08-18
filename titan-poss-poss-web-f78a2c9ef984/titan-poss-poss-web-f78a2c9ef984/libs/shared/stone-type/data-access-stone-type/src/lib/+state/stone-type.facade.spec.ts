import {
  LoadStoneTypeListingPayload,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { StoneTypeState } from './stone-type.state';
import { StoneTypeFacade } from './stone-type.facade';
import {
  LoadStoneTypeDetails,
  LoadStoneTypeByStoneTypeCode,
  ResetStoneTypeDialog,
  SaveStoneTypeFormDetails,
  EditStoneTypeFormDetails,
  SearchStoneTypeCode
} from './stone-type.actions';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Stone Type facade Testing Suite', () => {
  const initialState: StoneTypeState = {
    stoneTypeListing: null,
    stoneTypeDetails: null,
    totalStoneTypeDetails: 0,
    isLoading: false,
    error: null,
    saveStoneTypeResponses: null,
    editStoneTypeResponses: null
  };

  let stoneTypeFacade: StoneTypeFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), StoneTypeFacade]
    });

    stoneTypeFacade = TestBed.inject<any>(StoneTypeFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(stoneTypeFacade.getError()).toEqual(stoneTypeFacade['hasError$']);
    });
    it('should access  getisLoading() selector action', () => {
      expect(stoneTypeFacade.getisLoading()).toEqual(
        stoneTypeFacade['isLoading$']
      );
    });
    it('should access  getstoneTypeDetailsListing() selector action', () => {
      expect(stoneTypeFacade.getstoneTypeDetailsListing()).toEqual(
        stoneTypeFacade['stoneTypeListing$']
      );
    });
    it('should access  getstoneTypeDetailsBystoneTypeCode() selector action', () => {
      expect(stoneTypeFacade.getstoneTypeDetailsBystoneTypeCode()).toEqual(
        stoneTypeFacade['StoneTypeDetailsByStoneTypeCode$']
      );
    });

    it('should access  getstoneTypeSaveResponse() selector action', () => {
      expect(stoneTypeFacade.getstoneTypeSaveResponse()).toEqual(
        stoneTypeFacade['isstoneTypeSaved$']
      );
    });
    it('should access  getstoneTypeEditResponse() selector action', () => {
      expect(stoneTypeFacade.getstoneTypeEditResponse()).toEqual(
        stoneTypeFacade['isstoneTypeEdited$']
      );
    });
    it('should access  getTotalstoneTypeDetails() selector action', () => {
      expect(stoneTypeFacade.getTotalstoneTypeDetails()).toEqual(
        stoneTypeFacade['totalstoneTypeDetails$']
      );
    });
  });

  describe(' loadStoneTypeListing ', () => {
    it('should dispatch LoadStoneTypeDetails  action', inject(
      [Store],
      store => {
        const parameters: LoadStoneTypeListingPayload = {
          pageIndex: 0,
          pageSize: 100
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadStoneTypeDetails(parameters);
        stoneTypeFacade.loadStoneTypeDetailsListing(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' LoadStoneTypeByStoneTypeCode ', () => {
    it('should dispatch LoadStoneTypeByStoneTypeCode  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadStoneTypeByStoneTypeCode(parameters);
        stoneTypeFacade.loadStoneTypeDetailsBystoneTypeCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' EditStoneTypeFormDetails ', () => {
    it('should dispatch EditStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveStoneTypeFormDetailsPayload = {
          stoneTypeCode: 'ABC',
          description: 'ABC',
          configDetails: { karatageWeightPrint: 'ABC' },
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditStoneTypeFormDetails(parameters);
        stoneTypeFacade.editstoneTypeFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SaveStoneTypeFormDetails ', () => {
    it('should dispatch SaveStoneTypeFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveStoneTypeFormDetailsPayload = {
          stoneTypeCode: 'ABC',
          description: 'ABC',
          configDetails: { karatageWeightPrint: 'ABC' },
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveStoneTypeFormDetails(parameters);
        stoneTypeFacade.savestoneTypeFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SearchStoneTypeCode ', () => {
    it('should dispatch SearchStoneTypeCode  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchStoneTypeCode(parameters);
      stoneTypeFacade.searchStoneType(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' ResetStoneTypeDialog ', () => {
    it('should dispatch ResetStoneTypeDialog  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetStoneTypeDialog();
        stoneTypeFacade.resetstoneTypeDialogData();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
