import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BgrConfigFacade } from './bgr-config.facade';
import { BgrConfigState } from './bgr-config.state';

import {
  EditBgrConfigDetails,
  LoadBgrConfigDetails,
  LoadBgrConfigListing,
  SaveBgrConfigDetails,
  SearchBgrConfigListing
} from './bgr-config.actions';
import {
  BgrConfigListingParams,
  BgrConfigListingRequestPayload,
  BgrConfigDetails
} from '@poss-web/shared/models';

describe('Max Flat TEP Config Facade Testing Suite', () => {
  const initialState: BgrConfigState = {
    bgrConfigListing: [],
    bgrConfigDetails: null,
    bgrConfigDetailsSaved: null,
    bgrConfigDetailsEdited: null,
    bgrTotalConfig: 1234,
    error: null,
    isLoading: false
  };

  let bgrConfigFacade: BgrConfigFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BgrConfigFacade]
    });

    bgrConfigFacade = TestBed.inject(BgrConfigFacade);
    store = TestBed.inject(Store);
  });

  describe('Load Bgr Config Listing Config', () => {
    it('should dispatch loadBgrConfigListing action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const params: BgrConfigListingParams = {
        pageIndex: 0,
        pageSize: 10
      };
      const requestPayload: BgrConfigListingRequestPayload = {
        ruleType: 'BGR_CONFIG'
      };
      const expectedAction = new LoadBgrConfigListing(params, requestPayload);
      bgrConfigFacade.loadBgrConfigListing(params, requestPayload);
      bgrConfigFacade.getBgrConfigListing();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Search Bgr Config Listing Config', () => {
    it('should dispatch searchBgrConfigListing action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchBgrConfigListing('');
      bgrConfigFacade.searchBgrConfigListing('');
      bgrConfigFacade.getBgrConfigListing();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Load Bgr Config Details Config', () => {
    it('should dispatch LoadBgrConfigListing action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBgrConfigDetails('');
      bgrConfigFacade.loadBgrConfigDetails('');
      bgrConfigFacade.getBgrConfigDetails();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Save Bgr Config Details Config', () => {
    it('should dispatch SaveBgrConfigListing action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: BgrConfigDetails = {
        ruleType: 'BGR_CONFIG',
        ruleId: 1234
      };
      const expectedAction = new SaveBgrConfigDetails(payload, null);
      bgrConfigFacade.saveBgrConfigDetails(payload, null);
      bgrConfigFacade.getBgrConfigDetailsSaved();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Edit Bgr Config Details Config', () => {
    it('should dispatch EditBgrConfigListing action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: BgrConfigDetails = {
        ruleType: 'BGR_CONFIG',
        ruleId: 1234
      };
      const expectedAction = new EditBgrConfigDetails(payload);
      bgrConfigFacade.editBgrConfigDetails(payload);
      bgrConfigFacade.getBgrConfigDetailsEdited();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('getError and getIsLoading Testing', () => {
    it('should get Error and isLoading observable', () => {
      bgrConfigFacade.getError();
      bgrConfigFacade.getIsLoading();
    });
  });
});
