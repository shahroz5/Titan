
import { TaxClassFacade } from './tax-class.facade';
import { TaxClassState } from './tax-class.state';
import { provideMockStore } from '@ngrx/store/testing';
import { EditTaxClassFormDetails, LoadTaxClassDetailsByTaxClassCode, LoadTaxClassListing, SaveTaxClassFormDetails, SearchTaxClassCode } from './tax-class.actions';
import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { LoadTaxClassListingPayload, TaxClassDetails } from '@poss-web/shared/models';

describe('TaxClassFacade', () => {
  let taxClassFacade: TaxClassFacade;
  const initialState: TaxClassState = {
    taxClassListing: null,
    taxClassDetails: null,
    totalTaxClassDetails: 0,
    error: null,
    saveTaxClassResponses: null,
    editTaxClassResponses: null,
    isLoading: null
  };



  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TaxClassFacade]
    });

    taxClassFacade = TestBed.inject(TaxClassFacade);
  });


  it('should create facade', () => {
    expect(taxClassFacade).toBeDefined();
  });

  describe('#getTaxClassListing', () => {
    it('should get getTaxClassListing', () => {
      expect(taxClassFacade.getTaxClassListing()).toBeTruthy();
    });
  });

  describe('#getTaxClassDetailsByTaxClassCode', () => {
    it('should get getTaxClassDetailsByTaxClassCode', () => {
      expect(taxClassFacade.getTaxClassDetailsByTaxClassCode()).toBeTruthy();
    });
  });

  describe('#getTaxClassSaveResponse', () => {
    it('should get getTaxClassSaveResponse', () => {
      expect(taxClassFacade.getTaxClassSaveResponse()).toBeTruthy();
    });
  });

  describe('#getTaxClassEditResponse', () => {
    it('should get getTaxClassEditResponse', () => {
      expect(taxClassFacade.getTaxClassEditResponse()).toBeTruthy();
    });
  });

  describe('#getTotalTaxClassDetails', () => {
    it('should get getTotalTaxClassDetails', () => {
      expect(taxClassFacade.getTotalTaxClassDetails()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(taxClassFacade.getisLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(taxClassFacade.getError()).toBeTruthy();
    });
  });



  describe('#LoadTaxClassListing', () => {
    it('should LoadTaxClassListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };


      const expectedAction = new LoadTaxClassListing(payload);
      taxClassFacade.loadTaxClassListing(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#LoadTaxClassDetailsByTaxClassCode', () => {
    it('should LoadTaxClassDetailsByTaxClassCode', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'test';

      const expectedAction = new LoadTaxClassDetailsByTaxClassCode(payload);
      taxClassFacade.loadTaxClassDetailsByTaxClassCode(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#EditTaxClassFormDetails', () => {
    it('should EditTaxClassFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      }

      const expectedAction = new EditTaxClassFormDetails(payload);
      taxClassFacade.editTaxClassFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SaveTaxClassFormDetails', () => {
    it('should SaveTaxClassFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      }

      const expectedAction = new SaveTaxClassFormDetails(payload);
      taxClassFacade.saveTaxClassFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SearchTaxClassCode', () => {
    it('should SearchTaxClassCode', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'src';

      const expectedAction = new SearchTaxClassCode(payload);
      taxClassFacade.searchTaxClass(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });



});
