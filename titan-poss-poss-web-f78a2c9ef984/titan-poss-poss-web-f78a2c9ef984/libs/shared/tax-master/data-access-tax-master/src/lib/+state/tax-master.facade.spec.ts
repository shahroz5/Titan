
import { TaxMasterFacade } from './tax-master.facade';
import { TaxMasterState } from './tax-master.state';
import { provideMockStore } from '@ngrx/store/testing';
import { EditTaxMasterFormDetails, LoadTaxMasterDetailsByTaxCode, LoadTaxMasterListing, SaveTaxMasterFormDetails, SearchTaxMasterCode } from './tax-master.actions';
import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CashPaymentConfiguration, LoadTaxMasterListingPayload, TaxMasterDetails } from '@poss-web/shared/models';

describe('CashPaymentConfigurationFacade', () => {
  let taxMasterFacade: TaxMasterFacade;
  const initialState: TaxMasterState = {
    taxMasterListing: null,
    taxMasterDetails: null,
    totalTaxMasterDetails: 0,
    error: null,
    saveTaxMasterResponses: null,
    editTaxMasterResponses: null,
    isLoading: null
  };



  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TaxMasterFacade]
    });

    taxMasterFacade = TestBed.inject(TaxMasterFacade);
  });


  it('should create facade', () => {
    expect(taxMasterFacade).toBeDefined();
  });

  describe('#getTaxMasterListing', () => {
    it('should get getTaxMasterListing', () => {
      expect(taxMasterFacade.getTaxMasterListing()).toBeTruthy();
    });
  });

  describe('#getTaxMasterDetailsByTaxCode', () => {
    it('should get getTaxMasterDetailsByTaxCode', () => {
      expect(taxMasterFacade.getTaxMasterDetailsByTaxCode()).toBeTruthy();
    });
  });

  describe('#getTaxMasterSaveResponse', () => {
    it('should get getTaxMasterSaveResponse', () => {
      expect(taxMasterFacade.getTaxMasterSaveResponse()).toBeTruthy();
    });
  });

  describe('#getTaxMasterEditResponse', () => {
    it('should get getTaxMasterEditResponse', () => {
      expect(taxMasterFacade.getTaxMasterEditResponse()).toBeTruthy();
    });
  });

  describe('#getTotalTaxMasterDetails', () => {
    it('should get getTotalTaxMasterDetails', () => {
      expect(taxMasterFacade.getTotalTaxMasterDetails()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(taxMasterFacade.getisLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(taxMasterFacade.getError()).toBeTruthy();
    });
  });



  describe('#loadTaxMasterListing', () => {
    it('should loadTaxMasterListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };


      const expectedAction = new LoadTaxMasterListing(payload);
      taxMasterFacade.loadTaxMasterListing(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTaxMasterDetailsByTaxCode', () => {
    it('should loadTaxMasterDetailsByTaxCode', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'test';

      const expectedAction = new LoadTaxMasterDetailsByTaxCode(payload);
      taxMasterFacade.loadTaxMasterDetailsByTaxCode(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editTaxMasterFormDetails', () => {
    it('should editTaxMasterFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'VAT'
      }

      const expectedAction = new EditTaxMasterFormDetails(payload);
      taxMasterFacade.editTaxMasterFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveTaxMasterFormDetails', () => {
    it('should saveTaxMasterFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'VAT'
      }

      const expectedAction = new SaveTaxMasterFormDetails(payload);
      taxMasterFacade.saveTaxMasterFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchTaxMaster', () => {
    it('should searchTaxMaster', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'src';

      const expectedAction = new SearchTaxMasterCode(payload);
      taxMasterFacade.searchTaxMaster(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });



});
