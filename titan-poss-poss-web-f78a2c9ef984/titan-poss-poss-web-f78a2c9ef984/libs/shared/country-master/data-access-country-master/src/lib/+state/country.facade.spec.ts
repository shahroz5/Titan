import {
  LoadCountryListingPayload,
  SaveCountryFormDetailsPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import { CountryState } from './country.state';
import { CountryFacade } from './country.facade';
import {
  LoadCountryDetails,
  LoadCountryByCountryCode,
  ResetCountryDialog,
  SaveCountryFormDetails,
  EditCountryFormDetails,
  SearchCountryCode,
  // LoadCountryName,
  LoadCurrencyCode,
  LoadTimeFormats,
  LoadDateFormats
} from './country.action';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Country facade Testing Suite', () => {
  const initialState: CountryState = {
    error: null,
    countryListing: null,
    countryDetails: null,
    totalCountryDetails: 0,
    isLoading: false,
    saveCountryResponses: null,
    editCountryResponses: null,
    countryName: null,
    currencyCode: null,
    timeFormats: null,
    dateFormats: null
  };

  let countryFacade: CountryFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CountryFacade]
    });

    countryFacade = TestBed.inject(CountryFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(countryFacade.getError()).toEqual(countryFacade['hasError$']);
    });
    it('should access  getisLoading() selector action', () => {
      expect(countryFacade.getisLoading()).toEqual(countryFacade['isLoading$']);
    });
    it('should access  getCountryDetailsListing() selector action', () => {
      expect(countryFacade.getCountryDetailsListing()).toEqual(
        countryFacade['countryListing$']
      );
    });
    it('should access  getCountryDetailsByCountryCode() selector action', () => {
      expect(countryFacade.getCountryDetailsByCountryCode()).toEqual(
        countryFacade['CountryDetailsByCountryCode$']
      );
    });

    it('should access  getCountrySaveResponse() selector action', () => {
      expect(countryFacade.getCountrySaveResponse()).toEqual(
        countryFacade['isCountrySaved$']
      );
    });
    it('should access  getCountryEditResponse() selector action', () => {
      expect(countryFacade.getCountryEditResponse()).toEqual(
        countryFacade['isCountryEdited$']
      );
    });
    it('should access  getTotalCountryDetails() selector action', () => {
      expect(countryFacade.getTotalCountryDetails()).toEqual(
        countryFacade['totalCountryDetails$']
      );
    });
    it('should access  getTimeFormats() selector action', () => {
      expect(countryFacade.getTimeFormats()).toEqual(
        countryFacade['timeFormats$']
      );
    });
    it('should access  getDateFormats() selector action', () => {
      expect(countryFacade.getDateFormats()).toEqual(
        countryFacade['dateFormats$']
      );
    });
    it('should access  getCurrencyCode() selector action', () => {
      expect(countryFacade.getCurrencyCode()).toEqual(
        countryFacade['currencyCode$']
      );
    });
  });

  describe('loadCountryDetailsListing ', () => {
    it('should dispatch LoadCountryDetails  action', inject([Store], store => {
      const parameters: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCountryDetails(parameters);
      countryFacade.loadCountryDetailsListing(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' LoadCountryByCountryCode ', () => {
    it('should dispatch LoadCountryByCountryCode  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCountryByCountryCode(parameters);
        countryFacade.loadCountryDetailsByCountryCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SearchCountryCode ', () => {
    it('should dispatch SearchCountryCode  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchCountryCode(parameters);
      countryFacade.searchCountry(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' EditCountryFormDetails ', () => {
    it('should dispatch EditCountryFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveCountryFormDetailsPayload = {
          countryCode: 'ABC',
          description: 'ABC',
          currencyCode: 'ABC',
          dateFormat: 'ABC',
          fiscalYearStart: 'ABC',
          isdCode: 'ABC',
          phoneLength: 'ABC',
          fiscalYear: 2020,
          weightUnit: 'gms',
          stoneWeightUnit: 'karat',
          locale: 'ABC',
          timeFormat: 'ABC',
          isActive: false
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditCountryFormDetails(parameters);
        countryFacade.editCountryFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SaveCountryFormDetails ', () => {
    it('should dispatch SaveCountryFormDetails  action', inject(
      [Store],
      store => {
        const parameters: SaveCountryFormDetailsPayload = {
          countryCode: 'ABC',
          description: 'ABC',
          currencyCode: 'ABC',
          dateFormat: 'ABC',
          fiscalYearStart: 'ABC',
          isdCode: 'ABC',
          phoneLength: 'ABC',
          locale: 'ABC',
          fiscalYear: 2020,
          weightUnit: 'gms',
          stoneWeightUnit: 'karat',
          timeFormat: 'ABC',
          isActive: false
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveCountryFormDetails(parameters);
        countryFacade.saveCountryFormDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' LoadTimeFormats ', () => {
    it('should dispatch LoadTimeFormats  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadTimeFormats();
      countryFacade.loadTimeFormats();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' LoadDateFormats ', () => {
    it('should dispatch LoadDateFormats  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadDateFormats();
      countryFacade.loadDateFormats();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' LoadCurrencyCode ', () => {
    it('should dispatch LoadCurrencyCode  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCurrencyCode();
      countryFacade.loadCurrencyCode();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' ResetCountryDialog ', () => {
    it('should dispatch ResetCountryDialog  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetCountryDialog();
      countryFacade.resetCountryDialogData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
