import { Store } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MetalRatesState } from './metal-rates.state';
import { MetalRatesFacade } from './metal-rates.facade';
import {
  LoadAvailableMetalRates,
  LoadBodBusinessDate,
  LoadEodBusinessDate,
  ResetState,
  SaveMetalRates
} from './metal-rates.actions';
import { MetalRateUpdateRequestPayload } from '@poss-web/shared/models';

describe('Metal Rates Update Facade Testing Suite', () => {
  const initialState: MetalRatesState = {
    errors: null,
    isLoading: false,
    goldRateAvailableForBusinessDay: false,
    bodBusinessDate: null,
    eodBusinessDate: null,
    metalRatesUpdatedInBoutique: false
  };

  let metalRatesFacade: MetalRatesFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), MetalRatesFacade]
    });

    metalRatesFacade = TestBed.inject(MetalRatesFacade);
  });

  it('should dispatch SaveMetalRates action', inject([Store], store => {
    const payload: MetalRateUpdateRequestPayload = {
      applicableDate: '123456789',
      metalRates: {
        additionalProp1: {
          metalTypeCode: 'J',
          ratePerUnit: 5000
        },
        additionalProp2: {
          metalTypeCode: 'L',
          ratePerUnit: 4500
        },
        additionalProp3: {
          metalTypeCode: 'P',
          ratePerUnit: 899
        }
      },
      password: 'password'
    };

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new SaveMetalRates(payload);

    metalRatesFacade.saveMetalRates(payload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch ResetState action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new ResetState();

    metalRatesFacade.ResetState();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadAvailableMetalRates action', inject(
    [Store],
    store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadAvailableMetalRates(123456789);

      metalRatesFacade.loadAvailableMetalRates(123456789);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadBodBusinessDate action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadBodBusinessDate();

    metalRatesFacade.loadBodBusinessDate();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadEodBusinessDate action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadEodBusinessDate();

    metalRatesFacade.loadEodBusinessDate();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should access  getError() selector action', () => {
    expect(metalRatesFacade.getError()).toEqual(metalRatesFacade['error$']);
  });
  it('should access  getIsLoading() selector action', () => {
    expect(metalRatesFacade.getIsLoading()).toEqual(
      metalRatesFacade['isLoading$']
    );
  });
  it('should access  isGoldRateAvailableForBusinessDay() selector action', () => {
    expect(metalRatesFacade.isGoldRateAvailableForBusinessDay()).toEqual(
      metalRatesFacade['goldRateAvailableForBusinessDay$']
    );
  });
  it('should access  getBodBusinessDate() selector action', () => {
    expect(metalRatesFacade.getBodBusinessDate()).toEqual(
      metalRatesFacade['bodBusinessDate$']
    );
  });
  it('should access  getEodBusinessDate() selector action', () => {
    expect(metalRatesFacade.getEodBusinessDate()).toEqual(
      metalRatesFacade['eodBusinessDate$']
    );
  });
  it('should access  isMetalRatesUpdatedInBoutique() selector action', () => {
    expect(metalRatesFacade.isMetalRatesUpdatedInBoutique()).toEqual(
      metalRatesFacade['isMetalRatesUpdatedInBoutique$']
    );
  });
});
