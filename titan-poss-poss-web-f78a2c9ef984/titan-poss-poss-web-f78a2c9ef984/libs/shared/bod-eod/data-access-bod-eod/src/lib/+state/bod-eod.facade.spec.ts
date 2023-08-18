import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { BodEodEnum } from '@poss-web/shared/models';
import {
  LatestBusinessDay,
  LoadEodBusinessDate,
  LoadMetalRatesForBusinessDay,
  LoadOpenBusinessDate,
  Reset
} from './bod-eod.actions';
import { SharedBodEodFacade } from './bod-eod.facade';
import { BodEodState } from './bod-eod.state';

describe('Shared Bod-Eod Facade Testing Suite', () => {
  const initialState: BodEodState = {
    errors: null,
    isLoading: false,
    currentDayBodStatus: BodEodEnum.PENDING,
    openBusinessDate: -1,
    eodBusinessDate: -1,
    latestBusinessDate: -1,
    bodEodStatus: null,
    availableMetalRates: null,
    isGoldRateAvailable: null,
    metalRatesAvailableStatus: BodEodEnum.PENDING,
    fiscalYear: null
  };

  let sharedBodEodFacade: SharedBodEodFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), SharedBodEodFacade]
    });

    sharedBodEodFacade = TestBed.inject(SharedBodEodFacade);
  });

  it('should dispatch LoadOpenBusinessDate action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadOpenBusinessDate();

    sharedBodEodFacade.loadCurrentDayBodStatus();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadMetalRatesForBusinessDay action', inject(
    [Store],
    store => {
      const businessDate = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadMetalRatesForBusinessDay(businessDate);

      sharedBodEodFacade.loadMetalRatesForBusinessDay(businessDate);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadEodBusinessDate action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadEodBusinessDate();

    sharedBodEodFacade.loadEodBusinessDate();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LatestBusinessDay action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LatestBusinessDay();

    sharedBodEodFacade.loadLatestBusinessDay();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch Reset action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new Reset();

    sharedBodEodFacade.resetState();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should access getError() selector action', () => {
    expect(sharedBodEodFacade.getError()).toEqual(sharedBodEodFacade['error$']);
  });
  it('should access getIsLoading() selector action', () => {
    expect(sharedBodEodFacade.getIsLoading()).toEqual(
      sharedBodEodFacade['isLoading$']
    );
  });
  it('should access getCurrentDayBodStatus() selector action', () => {
    expect(sharedBodEodFacade.getCurrentDayBodStatus()).toEqual(
      sharedBodEodFacade['currentDayBodStatus$']
    );
  });
  it('should access getBusinessDayDate() selector action', () => {
    expect(sharedBodEodFacade.getBusinessDayDate()).toEqual(
      sharedBodEodFacade['openBusinessDate$']
    );
  });
  it('should access getBusinessDayDateForGuard() selector action', () => {
    expect(sharedBodEodFacade.getBusinessDayDateForGuard()).toEqual(
      sharedBodEodFacade['openBusinessDateForGuard$']
    );
  });
  it('should access getGoldRate() selector action', () => {
    expect(sharedBodEodFacade.getGoldRate()).toEqual(
      sharedBodEodFacade['goldRate$']
    );
  });
  it('should access getGoldRateAvailablityStatus() selector action', () => {
    expect(sharedBodEodFacade.getGoldRateAvailablityStatus()).toEqual(
      sharedBodEodFacade['isGoldRateAvailable$']
    );
  });
  it('should access getEodBusinessDate() selector action', () => {
    expect(sharedBodEodFacade.getEodBusinessDate()).toEqual(
      sharedBodEodFacade['eodBusinessDate$']
    );
  });
  it('should access getLatestBusinessDate() selector action', () => {
    expect(sharedBodEodFacade.getLatestBusinessDate()).toEqual(
      sharedBodEodFacade['latestBusinessDate$']
    );
  });
  it('should access getBodEodStatus() selector action', () => {
    expect(sharedBodEodFacade.getBodEodStatus()).toEqual(
      sharedBodEodFacade['bodEodStatus$']
    );
  });
  it('should access getFiscalYear() selector action', () => {
    expect(sharedBodEodFacade.getFiscalYear()).toEqual(
      sharedBodEodFacade['fiscalYear$']
    );
  });
});
