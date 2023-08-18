import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LocationMappingSelectors } from './location-mapping.selectors';
import * as LocationMappingActions from './location-mapping.actions';
import {
  SelectedLocationFilters,
  LoadActiveConfigsPayload,
  UpdateLocationMappingPayload,
  LoadMappedLocationsPayload
} from '@poss-web/shared/models';
import { LocationMappingState } from './location-mapping.state';

@Injectable()
export class LocationMappingFacade {
  private location$ = this.store.select(
    LocationMappingSelectors.selectLocations
  );
  private brands$ = this.store.select(LocationMappingSelectors.selectBrands);
  private regions$ = this.store.select(LocationMappingSelectors.selectRegions);
  private levels$ = this.store.select(LocationMappingSelectors.selectLevels);
  private countries$ = this.store.select(
    LocationMappingSelectors.selectCountries
  );
  private states$ = this.store.select(LocationMappingSelectors.selectStates);
  private towns$ = this.store.select(LocationMappingSelectors.selectTowns);
  private activeConfigs$ = this.store.select(
    LocationMappingSelectors.selectActiveConfigs
  );

  private updateStatus$ = this.store.select(
    LocationMappingSelectors.selectUpdateStatus
  );

  private mappedLocations$ = this.store.select(
    LocationMappingSelectors.selectMappedLocations
  );

  private error$ = this.store.select(LocationMappingSelectors.selectError);

  constructor(private store: Store<LocationMappingState>) {}

  /**
   * Access for the State selectors
   */
  getActiveConfigs() {
    return this.activeConfigs$;
  }

  getMappedLocations() {
    return this.mappedLocations$;
  }

  getUpdateStatus() {
    return this.updateStatus$;
  }

  getLocations() {
    return this.location$;
  }

  getBrands() {
    return this.brands$;
  }

  getRegions() {
    return this.regions$;
  }

  getLevels() {
    return this.levels$;
  }

  getCountries() {
    return this.countries$;
  }
  getStates() {
    return this.states$;
  }
  getTowns() {
    return this.towns$;
  }

  getError() {
    return this.error$;
  }

  loadBrands() {
    this.store.dispatch(new LocationMappingActions.LoadBrands());
  }
  loadRegions() {
    this.store.dispatch(new LocationMappingActions.LoadRegions());
  }
  loadLevels() {
    this.store.dispatch(new LocationMappingActions.LoadLevels());
  }

  loadCountries() {
    this.store.dispatch(new LocationMappingActions.LoadCountries());
  }

  loadStates(payload: { countryCode: string; regionCodes: string[] }) {
    this.store.dispatch(new LocationMappingActions.LoadStates(payload));
  }
  loadTowns(townCode: string) {
    this.store.dispatch(new LocationMappingActions.LoadTowns(townCode));
  }

  clear() {
    this.store.dispatch(new LocationMappingActions.Clear());
  }

  searchLocations(filter: SelectedLocationFilters) {
    this.store.dispatch(new LocationMappingActions.SearchLocations(filter));
  }

  loadActiveConfigs(payload: LoadActiveConfigsPayload) {
    this.store.dispatch(new LocationMappingActions.LoadActiveConfigs(payload));
  }

  updateLocationMapping(payload: UpdateLocationMappingPayload) {
    this.store.dispatch(
      new LocationMappingActions.UpdateLocationMapping(payload)
    );
  }

  loadMappedLocations(payload: LoadMappedLocationsPayload) {
    this.store.dispatch(
      new LocationMappingActions.LoadMappedLocations(payload)
    );
  }

  resetMappedLocations() {
    this.store.dispatch(new LocationMappingActions.ResetMappedLocations());
  }
  resetMappedConfigs() {
    this.store.dispatch(new LocationMappingActions.ResetActiveConfigs());
  }
}
