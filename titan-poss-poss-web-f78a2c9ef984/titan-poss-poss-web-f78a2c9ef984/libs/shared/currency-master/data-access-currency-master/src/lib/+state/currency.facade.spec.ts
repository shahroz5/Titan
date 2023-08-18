import { Store } from '@ngrx/store';
import { CurrencyState } from './currency.state';
import { CurrencyFacade } from './currency.facade';
import {
  LoadCurrencyDetails,
  LoadCurrencyDetailsByCurrencyCode,
  SaveCurrencyFormDetails,
  EditCurrencyFormDetails,
  SearchCurrency,
  ResetCurrencyDialog
} from './currency.action';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  LoadCurrencyListingPayload,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';

describe('Country facade Testing Suite', () => {
  const initialState: CurrencyState = {
    error: null,
    currencyListing: null,
    currencyDetails: null,
    totalCurrencyDetails: 0,
    isLoading: false,
    saveCurrency: null,
    editCurrency: null
  };

  let currencyFacade: CurrencyFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CurrencyFacade]
    });

    currencyFacade = TestBed.inject(CurrencyFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(currencyFacade.getError()).toEqual(currencyFacade['hasError$']);
    });
    it('should access  getisLoading() selector action', () => {
      expect(currencyFacade.getisLoading()).toEqual(
        currencyFacade['isLoading$']
      );
    });
    it('should access  getCurrencyDetailsListing() selector action', () => {
      expect(currencyFacade.getCurrencyDetailsListing()).toEqual(
        currencyFacade['currencyListing$']
      );
    });
    it('should access  getCurrencyDetailsByCurrencyCode() selector action', () => {
      expect(currencyFacade.getCurrencyDetailsByCurrencyCode()).toEqual(
        currencyFacade['currencyDetailsByCurrencyCode$']
      );
    });

    it('should access  getCurrencySaveResponse() selector action', () => {
      expect(currencyFacade.getCurrencySaveResponse()).toEqual(
        currencyFacade['isCurrencySaved$']
      );
    });
    it('should access  getCurrencyEditResponse() selector action', () => {
      expect(currencyFacade.getCurrencyEditResponse()).toEqual(
        currencyFacade['isCurrencyEdited$']
      );
    });
    it('should access  getTotalCurrencyDetails() selector action', () => {
      expect(currencyFacade.getTotalCurrencyDetails()).toEqual(
        currencyFacade['totalCurrencyDetails$']
      );
    });
  });

  describe('loadCurrencyDetailsListing ', () => {
    it('should dispatch LoadCurrencyDetails  action', inject([Store], store => {
      const parameters: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCurrencyDetails(parameters);
      currencyFacade.loadCurrencyDetailsListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' LoadCurrencyDetailsByCurrencyCode ', () => {
    it('should dispatch LoadCurrencyDetailsByCurrencyCode  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCurrencyDetailsByCurrencyCode(
          parameters
        );
        currencyFacade.loadCurrencyDetailsByCurrencyCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SearchCurrency ', () => {
    it('should dispatch SearchCurrency  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchCurrency(parameters);
      currencyFacade.searchCurrency(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' EditCurrencyFormDetails ', () => {
    it('should dispatch EditCurrencyFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveCurrencyDetailFormPayload = {
          currencyCode: 'ABC',
          currencySymbol: 'ABC',
          description: 'ABC',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditCurrencyFormDetails(parameters);
        currencyFacade.editCurrencyFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SaveCurrencyFormDetails ', () => {
    it('should dispatch SaveCurrencyFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveCurrencyDetailFormPayload = {
          currencyCode: 'ABC',
          currencySymbol: 'ABC',
          description: 'ABC',
          isActive: true
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveCurrencyFormDetails(parameters);
        currencyFacade.saveCurrencyFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' ResetCurrencyDialog ', () => {
    it('should dispatch ResetCurrencyDialog  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetCurrencyDialog();
      currencyFacade.resetCurrencyDialogData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
