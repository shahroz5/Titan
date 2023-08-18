import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { WalkInsRecordFacade } from './walk-ins-record.facade';
import { WalkInsRecordState } from './walk-ins-record.state';

import {
  LoadWalkInDetailsForBusinessDay,
  LoadSaveWalkInDetails,
  SetWalkInsCount,
  ResetValues,
  LoadWalkInsHistoryData,
  ClearValues
} from './walk-ins-record.actions';
import {
  SaveWalkInDetailsRequestPayload,
  WalkInsCountRequestPayload
} from '@poss-web/shared/models';

describe('Walk Ins Record Facade Testing Suite', () => {
  const initialState: WalkInsRecordState = {
    errors: null,
    isLoading: false,
    walkInsCount: 0,
    walkInsHistoryData: null,
    saveWalkInDetailsResponse: null,
    purchasersCount: 0,

    numberOfInvoices: 0,

    walkInsDate: 123456789
  };

  let walkInsRecordFacade: WalkInsRecordFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), WalkInsRecordFacade]
    });

    walkInsRecordFacade = TestBed.inject(WalkInsRecordFacade);
  });

  describe('Set Walk ins Count', () => {
    it('should dispatch SetWalkInsCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetWalkInsCount(10);
      walkInsRecordFacade.setWalksInCount(10);
      walkInsRecordFacade.getWalksInCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Walk-in Details', () => {
    it('should dispatch loadWalkInDetails action', inject([Store], store => {
      const payload: WalkInsCountRequestPayload = {
        businessDate: 123456789
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadWalkInDetailsForBusinessDay(payload);
      walkInsRecordFacade.loadWalkInDetails(payload);
      walkInsRecordFacade.getWalkInsDate();
      walkInsRecordFacade.getPurchasersCount();
      walkInsRecordFacade.getNumberOfInvoices();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Walk-in Details', () => {
    it('should dispatch loadWalkInsHistoryDate action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadWalkInsHistoryData();
        walkInsRecordFacade.loadWalkInsHistoryDate();

        walkInsRecordFacade.getWalkInsHistoryData();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Save Walk In Details', () => {
    it('should dispatch Save Walk In Details action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const mockRequestPayload: SaveWalkInDetailsRequestPayload = {
        businessDate: 123456789,
        noOfInvoice: 2,
        nonPurchaserCount: 2,
        purchaserCount: 3,
        walkins: 5
      };
      const expectedAction = new LoadSaveWalkInDetails(mockRequestPayload);
      walkInsRecordFacade.saveWalkInDetails(mockRequestPayload);
      walkInsRecordFacade.getSaveWalkInDetailsResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Clear Walk in Details', () => {
    it('should dispatch clear Walk in Details action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearValues();
        walkInsRecordFacade.clearWalkInDetails();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Reset Walk in Details', () => {
    it('should dispatch Reset Walk in Details action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetValues();
        walkInsRecordFacade.resetWalkInDetails();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('getError and getIsLoading Testing', () => {
    it('should get Error and isLoading observable', () => {
      walkInsRecordFacade.getError();
      walkInsRecordFacade.getIsLoading();
    });
  });
});
