import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MaxFlatTepConfigFacade } from './max-flat-tep-config.facade';
import { MaxFlatTepConfigState } from './max-flat-tep-config.state';

import {
  LoadMaxFlatTepConfig,
  UpdateMaxFlatTepConfig,
  ResetData,
  UpdateMaxFlatTepConfigSuccess
} from './max-flat-tep-config.actions';
import {
  MaxFlatValuePatchPayload,
  MaxFlatTepConfigDetails
} from '@poss-web/shared/models';

describe('Max Flat TEP Config Facade Testing Suite', () => {
  const initialState: MaxFlatTepConfigState = {
    errors: null,
    isLoading: false,
    maxFlatTepConfigDetails: null,
    updateMaxFlatTepConfigResponse: null
  };

  let maxFlatTepConfigFacade: MaxFlatTepConfigFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), MaxFlatTepConfigFacade]
    });

    maxFlatTepConfigFacade = TestBed.inject(MaxFlatTepConfigFacade);
    store = TestBed.inject(Store);
  });

  describe('Load Max Flat Tep Config', () => {
    it('should dispatch LoadMaxFlatTepConfig action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadMaxFlatTepConfig();
      maxFlatTepConfigFacade.loadMaxFlatTepConfig();
      maxFlatTepConfigFacade.getLoadMaxFlatTepConfig();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Update Max Flat Tep Config', () => {
    it('should dispatch UpdateMaxFlatTepConfig action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = {
        configDetails: {
          type: 'MAX_FLAT_CONFIG',
          data: {
            maxFlatTepExchangeValue: '1200'
          },
          configId: '1234-abcd'
        }
      };
      const expectedAction = new UpdateMaxFlatTepConfig('', payload);
      maxFlatTepConfigFacade.updateMaxFlatTepConfig('', payload);
      maxFlatTepConfigFacade.getUpdateMaxFlatTepConfigResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Reset Grf', () => {
    it('should dispatch Reset action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetData();
      maxFlatTepConfigFacade.resetData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('getError and getIsLoading Testing', () => {
    it('should get Error and isLoading observable', () => {
      maxFlatTepConfigFacade.getError();
      maxFlatTepConfigFacade.getIsLoading();
    });
  });
});
