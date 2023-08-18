import {
  IbtConfigurationListPayload,
  IbtConfiguration
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import {
  LoadReset,
  LoadIbtConfigurationList,
  SaveIbtConfiguration,
  UpdateIbtConfiguration,
  LoadIbtConfigurationByConfigId,
  LoadNewIbtConfigurationByConfigId,
  SearchConfigByConfigName
} from './ibt-configuration.actions';

import { IbtConfigurationState } from './ibt-configuration.state';
import { IbtConfigurationFacade } from './ibt-configuration.facade';

describe('ibt config facade Testing Suite', () => {
  const initialState: IbtConfigurationState = {
    ibtConfigList: null,
    isLoading: null,
    error: null,
    ibtConfiguration: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null
  };
  let ibtConfigurationFacade: IbtConfigurationFacade;
  let store: MockStore<IbtConfigurationFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), IbtConfigurationFacade]
    });
    store = TestBed.inject<any>(Store);
    ibtConfigurationFacade = TestBed.inject<any>(IbtConfigurationFacade);
  });

  describe('Dispatch Actions action', () => {
    const ibtConfigurationListPayload: IbtConfigurationListPayload = {
      pageIndex: 0,
      pageSize: 100,
      length: 0
    };
    const ibtConfiguration: IbtConfiguration = {
      description: 'ibtconfig',
      ruleDetails: {
        data: {
          maxProductsPerStn: '',
          maxReqPerMonth: '',
          maxValPerStn: '',
          validRequestTime: ''
        },
        type: 'IBT_CONIG'
      },
      isActive: true
    };

    it('should call LOAD_IBT_CONFIGURATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadIbtConfigurationList(ibtConfigurationListPayload);
      ibtConfigurationFacade.loadIbtConfigurationList(
        ibtConfigurationListPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_IBT_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveIbtConfiguration(ibtConfiguration);
      ibtConfigurationFacade.saveIbtConfiguration(ibtConfiguration);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_IBT_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateIbtConfiguration(ibtConfiguration);
      ibtConfigurationFacade.updateIbtConfiguration(ibtConfiguration);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_IBT_CONFIGURATION_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadIbtConfigurationByConfigId(payload);
      ibtConfigurationFacade.loadIbtConfigurationByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_CONFIG_BY_CONFIG_NAME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'ibtconfig';
      const action = new SearchConfigByConfigName(payload);
      ibtConfigurationFacade.searchConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      ibtConfigurationFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  it('should call LOAD_NEW_IBT_CONFIGURATION_BY_CONFIG_ID action', () => {
    spyOn(store, 'dispatch').and.returnValue({});
    const action = new LoadNewIbtConfigurationByConfigId();

    ibtConfigurationFacade.loadNewIbtConfigurationByConfigId();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('Access Selector action', () => {
    it('should access the getIbtConfigurationList selector action', () => {
      expect(ibtConfigurationFacade.getIbtConfigurationList()).toEqual(
        ibtConfigurationFacade['ibtConfigList$']
      );
    });

    it('should access the getIbtConfiguration selector action', () => {
      expect(ibtConfigurationFacade.getIbtConfiguration()).toEqual(
        ibtConfigurationFacade['ibtConfiguration$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(ibtConfigurationFacade.getHasSaved()).toEqual(
        ibtConfigurationFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(ibtConfigurationFacade.getHasUpdated()).toEqual(
        ibtConfigurationFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(ibtConfigurationFacade.getIsloading()).toEqual(
        ibtConfigurationFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(ibtConfigurationFacade.getError()).toEqual(
        ibtConfigurationFacade['error$']
      );
    });

    it('should access the getTotalElement selector action', () => {
      expect(ibtConfigurationFacade.getTotalElement()).toEqual(
        ibtConfigurationFacade['totalElements$']
      );
    });
  });
});
