import { UpdateFieldValuePayload } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { InventoryGlobalConfigFacade } from './inventory-global-config.facade';
import {
  LoadReset,
  LoadInvGlobalConfigurationList,
  LoadInvGlobalConfigurationFiledValue,
  UpdateInvGlobalConfigurationFieldValue,
  SaveInvGlobalConfiguration
} from './inventory-global-config.actions';

import { InvGlobalConfigurationState } from './inventory-global-config.state';

describe(' InventoryGlobalConfigFacade  Testing Suite', () => {
  const initialState: InvGlobalConfigurationState = {
    invglobalConfigurationFiledValue: null,
    isLoading: null,
    error: null,
    hasUpdated: null,
    invglobalConfigurationList: null
  };

  let inventoryGlobalConfigFacade: InventoryGlobalConfigFacade;
  let store: MockStore<InventoryGlobalConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        InventoryGlobalConfigFacade
      ]
    });
    store = TestBed.inject<any>(Store);
    inventoryGlobalConfigFacade = TestBed.inject<any>(
      InventoryGlobalConfigFacade
    );
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_INV_GLOBAL_CONFIGURATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadInvGlobalConfigurationList();
      inventoryGlobalConfigFacade.loadInvGlobalConfigurationList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadInvGlobalConfigurationFiledValue(payload);
      inventoryGlobalConfigFacade.loadInvGlobalConfigurationFieldValue(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_INV_GLOBAL_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateFieldValuePayload = {
        configId: '1',
        ruleDetails: {
          data: {
            maxTimeToMoveTranscToHistory: '250'
          },
          type: 'HISTROY_TIME_CONFIG'
        }
      };
      const action = new UpdateInvGlobalConfigurationFieldValue(payload);
      inventoryGlobalConfigFacade.updateInvGlobalConfigurationFiledValue(
        payload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_INV_GLOBAL_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveInvGlobalConfiguration();
      inventoryGlobalConfigFacade.saveGlobalConfiguration();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      inventoryGlobalConfigFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getInvGlobalConfigurationList selector action', () => {
      expect(
        inventoryGlobalConfigFacade.getInvGlobalConfigurationList()
      ).toEqual(inventoryGlobalConfigFacade['globalConfigurationList$']);
    });

    it('should access the getInvGlobalConfigurationFieldValue selector action', () => {
      expect(
        inventoryGlobalConfigFacade.getInvGlobalConfigurationFieldValue()
      ).toEqual(inventoryGlobalConfigFacade['globalConfiguration$']);
    });

    it('should access the getHasUpdated selector action', () => {
      expect(inventoryGlobalConfigFacade.getHasUpdated()).toEqual(
        inventoryGlobalConfigFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(inventoryGlobalConfigFacade.getIsloading()).toEqual(
        inventoryGlobalConfigFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(inventoryGlobalConfigFacade.getError()).toEqual(
        inventoryGlobalConfigFacade['error$']
      );
    });
  });
});
