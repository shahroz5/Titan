import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from './location-mapping.reducer';

import { LocationMappingFacade } from './location-mapping.facade';
import { LocationMappingState } from './location-mapping.state';
import {
  Clear,
  LoadActiveConfigs,
  LoadBrands,
  LoadCountries,
  LoadLevels,
  LoadMappedLocations,
  LoadRegions,
  LoadStates,
  LoadTowns,
  ResetMappedLocations,
  SearchLocations,
  UpdateLocationMapping
} from './location-mapping.actions';
import {
  ConfigTypeEnum,
  LoadActiveConfigsPayload,
  LoadMappedLocationsPayload,
  SelectedLocationFilters,
  UpdateLocationMappingPayload
} from '@poss-web/shared/models';

describe('Location Mapping facade Testing Suite   ', () => {
  let locationMappingFacade: LocationMappingFacade;

  let store: Store<LocationMappingState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), LocationMappingFacade]
    });

    locationMappingFacade = TestBed.inject(LocationMappingFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions  ', () => {
    it('should call loadBrands action  ', () => {
      const action = new LoadBrands();
      locationMappingFacade.loadBrands();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadRegions action  ', () => {
      const action = new LoadRegions();
      locationMappingFacade.loadRegions();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadLevels action  ', () => {
      const action = new LoadLevels();
      locationMappingFacade.loadLevels();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCountries action  ', () => {
      const action = new LoadCountries();
      locationMappingFacade.loadCountries();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadStates action  ', () => {
      const payload: { countryCode: string; regionCodes: string[] } = {
        countryCode: 'Country 1',
        regionCodes: ['Region 1']
      };
      const action = new LoadStates(payload);
      locationMappingFacade.loadStates(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadTowns action  ', () => {
      const payload = 'State1';
      const action = new LoadTowns(payload);
      locationMappingFacade.loadTowns(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call clear action  ', () => {
      const action = new Clear();
      locationMappingFacade.clear();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call searchLocations action  ', () => {
      const payload: SelectedLocationFilters = {
        brands: ['BRAND1'],
        regions: ['REGION1'],
        levels: ['LEVEL1'],
        countries: ['COUNTRY1'],
        states: ['STATE1'],
        towns: ['TOWNS1']
      };
      const action = new SearchLocations(payload);
      locationMappingFacade.searchLocations(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadActiveConfigs action  ', () => {
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };
      const action = new LoadActiveConfigs(payload);
      locationMappingFacade.loadActiveConfigs(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updateLocationMapping action  ', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };
      const action = new UpdateLocationMapping(payload);
      locationMappingFacade.updateLocationMapping(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadMappedLocations action  ', () => {
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID'
      };
      const action = new LoadMappedLocations(payload);
      locationMappingFacade.loadMappedLocations(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call resetMappedLocations action  ', () => {
      const action = new ResetMappedLocations();
      locationMappingFacade.resetMappedLocations();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector selector ', () => {
    it('should access active configs selector ', () => {
      expect(locationMappingFacade.getActiveConfigs()).toEqual(
        locationMappingFacade['activeConfigs$']
      );
    });

    it('should access mapped locations selector ', () => {
      expect(locationMappingFacade.getMappedLocations()).toEqual(
        locationMappingFacade['mappedLocations$']
      );
    });

    it('should access update status selector ', () => {
      expect(locationMappingFacade.getUpdateStatus()).toEqual(
        locationMappingFacade['updateStatus$']
      );
    });

    it('should access locations selector ', () => {
      expect(locationMappingFacade.getLocations()).toEqual(
        locationMappingFacade['location$']
      );
    });

    it('should access brands selector ', () => {
      expect(locationMappingFacade.getBrands()).toEqual(
        locationMappingFacade['brands$']
      );
    });

    it('should access regions selector ', () => {
      expect(locationMappingFacade.getRegions()).toEqual(
        locationMappingFacade['regions$']
      );
    });

    it('should access levels selector ', () => {
      expect(locationMappingFacade.getLevels()).toEqual(
        locationMappingFacade['levels$']
      );
    });

    it('should access countries selector ', () => {
      expect(locationMappingFacade.getCountries()).toEqual(
        locationMappingFacade['countries$']
      );
    });

    it('should access states selector ', () => {
      expect(locationMappingFacade.getStates()).toEqual(
        locationMappingFacade['states$']
      );
    });

    it('should access towns selector ', () => {
      expect(locationMappingFacade.getTowns()).toEqual(
        locationMappingFacade['towns$']
      );
    });

    it('should access error selector ', () => {
      expect(locationMappingFacade.getError()).toEqual(
        locationMappingFacade['error$']
      );
    });
  });
});
