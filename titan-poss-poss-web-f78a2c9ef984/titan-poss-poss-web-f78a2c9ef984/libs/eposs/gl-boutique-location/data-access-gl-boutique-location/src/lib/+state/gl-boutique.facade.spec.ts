import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { GlBoutiqueLocationList, GlBoutiqueLocationListingPayload } from '@poss-web/shared/models';
import { EditGlBoutqueLocationDetails, LoadGlBoutiqueList, LoadGlBoutiqueListByLocationCode, ResetGlBoutiqueDetails, SaveGlBoutqueLocationDetails, SearchByLocationCode } from './gl-botique.action';
import { GlBoutiqueLocationFacade } from './gl-boutique.facade';
import { initialState } from './gl-boutique.reducer';
import { GlBoutiqueLocationState } from './gl-boutique.state';

describe('GlBoutiqueLocation facade Testing suite', () => {
  let glBoutiqueLocationFacade: GlBoutiqueLocationFacade;

  let store: Store<GlBoutiqueLocationState>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GlBoutiqueLocationFacade]
    });

    glBoutiqueLocationFacade = TestBed.inject(GlBoutiqueLocationFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch actions', () => {
    it('should call loadGlBoutiqueLocationByLocationCode action', () => {
      const payload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }
      const action = new LoadGlBoutiqueListByLocationCode('CPD');
      glBoutiqueLocationFacade.loadGlBoutiqueLocationByLocationCode('CPD');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadGlBoutiqueLocationListing action', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadGlBoutiqueList(payload);
      glBoutiqueLocationFacade.loadGlBoutiqueLocationListing(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call editGlBoutiqueLocationDetails action', () => {
      const payload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }
      const action = new EditGlBoutqueLocationDetails(payload);
      glBoutiqueLocationFacade.editGlBoutiqueLocationDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call saveGlBoutiqueLocationDetails action', () => {
      const payload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }
      const action = new SaveGlBoutqueLocationDetails(payload);
      glBoutiqueLocationFacade.saveGlBoutiqueLocationDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call searchGlBoutiqueLocation action', () => {
      const action = new SearchByLocationCode('CPD');
      glBoutiqueLocationFacade.searchGlBoutiqueLocation('CPD');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call resetGlBoutiqueDetails action', () => {
      const action = new ResetGlBoutiqueDetails();
      glBoutiqueLocationFacade.resetGlBoutiqueDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
  })

  describe('Access Selector', () => {
    it('should access isLoading', () => {
      expect(glBoutiqueLocationFacade.getIsLoading()).toEqual(
        glBoutiqueLocationFacade['isLoading$']
      )
    })

    it('should access isSaved', () => {
      expect(glBoutiqueLocationFacade.getIsSaved()).toEqual(
        glBoutiqueLocationFacade['isSaved$']
      )
    })

    it('should access IsEdited', () => {
      expect(glBoutiqueLocationFacade.getIsEdited()).toEqual(
        glBoutiqueLocationFacade['isEdited$']
      )
    })
    it('should access hasError', () => {
      expect(glBoutiqueLocationFacade.getError()).toEqual(
        glBoutiqueLocationFacade['hasError$']
      )
    })
    it('should access getGlBoutiqueLocationSaveResponse', () => {
      expect(glBoutiqueLocationFacade.getGlBoutiqueLocationSaveResponse()).toEqual(
        glBoutiqueLocationFacade['isSaved$']
      )
    })
    it('should access getGlBoutiqueLocationEditResponse', () => {
      expect(glBoutiqueLocationFacade.getGlBoutiqueLocationEditResponse()).toEqual(
        glBoutiqueLocationFacade['isEdited$']
      )
    })
    it('should access getTotalglBoutiqueLocation', () => {
      expect(glBoutiqueLocationFacade.getTotalglBoutiqueLocation()).toEqual(
        glBoutiqueLocationFacade['totalGlBoutiqueLocation$']
      )
    })
    it('should access getGlBoutiqueListingListing', () => {
      expect(glBoutiqueLocationFacade.getGlBoutiqueListingListing()).toEqual(
        glBoutiqueLocationFacade['glBoutiqueListing$']
      )
    })
    it('should access getGlBoutiqueLocationByLocationCode', () => {
      expect(glBoutiqueLocationFacade.getGlBoutiqueLocationByLocationCode()).toEqual(
        glBoutiqueLocationFacade['glBoutiqueLocationByLocationCode$']
      )
    })
  })
})
