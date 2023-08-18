
import { TransactionTypeMasterFacade } from './transaction-type-master.facade';
import { TransactionTypeMasterState } from './transaction-type-master.state';
import { provideMockStore } from '@ngrx/store/testing';
import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { LoadTransactionTypeMasterListingPayload, SaveProductCategoryFormDetailsPayload, TransactionTypeMasterDetails } from '@poss-web/shared/models';
import { EditTransactionTypeMasterFormDetails, LoadTransactionTypeMasterByCode, LoadTransactionTypeMasterListing, SaveTransactionTypeMasterFormDetails, SearchTransactionTypeMasterCode } from './transaction-type-master.actions';

describe('CashPaymentConfigurationFacade', () => {
  let transactionTypeMasterFacade: TransactionTypeMasterFacade;
  const initialState: TransactionTypeMasterState = {
    transactionTypeMasterListing: null,
    transactionTypeMasterDetails: null,
    totalTransactionTypeMasterDetails: 0,
    error: null,
    saveResponses: null,
    editResponses: null,
    isLoading: null
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TransactionTypeMasterFacade]
    });

    transactionTypeMasterFacade = TestBed.inject(TransactionTypeMasterFacade);
  });


  it('should create facade', () => {
    expect(transactionTypeMasterFacade).toBeDefined();
  });

  describe('#getTransactionTypeMasterListing', () => {
    it('should get getTransactionTypeMasterListing', () => {
      expect(transactionTypeMasterFacade.getTransactionTypeMasterListing()).toBeTruthy();
    });
  });

  describe('#getTransactionTypeMasterDetails', () => {
    it('should get getTransactionTypeMasterDetails', () => {
      expect(transactionTypeMasterFacade.getTransactionTypeMasterDetails()).toBeTruthy();
    });
  });

  describe('#getTransactionTypeMasterSaveResponse', () => {
    it('should get getTransactionTypeMasterSaveResponse', () => {
      expect(transactionTypeMasterFacade.getTransactionTypeMasterSaveResponse()).toBeTruthy();
    });
  });

  describe('#getTotalDetails', () => {
    it('should get getTotalDetails', () => {
      expect(transactionTypeMasterFacade.getTotalDetails()).toBeTruthy();
    });
  });

  describe('#getisLoading', () => {
    it('should get getisLoading', () => {
      expect(transactionTypeMasterFacade.getisLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(transactionTypeMasterFacade.getError()).toBeTruthy();
    });
  });



  describe('#loadTransactionTypeMasterListing', () => {
    it('should loadTransactionTypeMasterListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload2: LoadTransactionTypeMasterListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }


      const expectedAction = new LoadTransactionTypeMasterListing(payload2);
      transactionTypeMasterFacade.loadTransactionTypeMasterListing(payload2);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTransactionTypeMasterByCode', () => {
    it('should loadTransactionTypeMasterByCode', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadTransactionTypeMasterByCode('');
      transactionTypeMasterFacade.loadTransactionTypeMasterByCode('');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveFormDetails', () => {
    it('should saveFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload2: TransactionTypeMasterDetails = {
        code: 'code',
        isActive: true,
        value: 'value'
      };

      const expectedAction = new SaveTransactionTypeMasterFormDetails(payload2);
      transactionTypeMasterFacade.saveFormDetails(payload2);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editFormDetails', () => {
    it('should editFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload2: TransactionTypeMasterDetails = {
        code: 'code',
        isActive: true,
        value: 'value'
      };

      const expectedAction = new EditTransactionTypeMasterFormDetails(payload2);
      transactionTypeMasterFacade.editFormDetails(payload2);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchTransactionTypeMaster', () => {
    it('should searchTransactionTypeMaster', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new SearchTransactionTypeMasterCode('');
      transactionTypeMasterFacade.searchTransactionTypeMaster('');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });



});
