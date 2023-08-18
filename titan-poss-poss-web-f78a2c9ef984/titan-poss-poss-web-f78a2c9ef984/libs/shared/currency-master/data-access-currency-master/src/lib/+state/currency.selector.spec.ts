import {
  CurrencyDetails,
  CurrencyFormDetails,
  CustomErrors,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';
import { CurrencyState } from './currency.state';
import { initialState } from './currency.reducer';
import * as selectors from './currency.selector';
import * as moment from 'moment';

describe('Currency selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing Currency master related Selectors', () => {
    it('Should return the list of Countries ', () => {
      const listing: CurrencyDetails[] = [
        {
          currencyCode: 'ABC',
          currencySymbol: 'ABC',
          description: 'ABC',
          isActive: true,
          unicode: 'ABC',
          lastModifiedDate: moment()
        }
      ];
      const state: CurrencyState = {
        ...initialState,
        currencyListing: listing
      };

      expect(
        selectors.CurrencySelectors.selectCurrencyDetailsListing.projector(
          state
        )
      ).toEqual(listing);
    });
    it('Should return the true or false', () => {
      const state: CurrencyState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CurrencySelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: CurrencyState = {
        ...initialState,
        totalCurrencyDetails: 0
      };
      expect(
        selectors.CurrencySelectors.selectTotalCurrencyDetailsCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: CurrencyState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.CurrencySelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the Currency object', () => {
      const currencyDetails: CurrencyFormDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const state: CurrencyState = {
        ...initialState,
        currencyDetails: currencyDetails
      };

      expect(
        selectors.CurrencySelectors.selectCurrencyDetailsByCurrencyCode.projector(
          state
        )
      ).toEqual(currencyDetails);
    });

    it('Should save the Currency', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const state: CurrencyState = {
        ...initialState,
        saveCurrency: payload
      };
      expect(
        selectors.CurrencySelectors.selectSaveCurrencyFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should edit the Currency', () => {
      const payload: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const state: CurrencyState = {
        ...initialState,
        editCurrency: payload
      };
      expect(
        selectors.CurrencySelectors.selectEditCurrencyFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });
});
