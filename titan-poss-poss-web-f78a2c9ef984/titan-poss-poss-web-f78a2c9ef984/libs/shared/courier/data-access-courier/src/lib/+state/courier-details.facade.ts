import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CourierDetailsActions from './courier-details.actions';
import { CourierDetailsSelectors } from './courier-details.selectors';
import { CourierDetailsState } from './courier-details.state';
import {
  LoadCourierDetailsListingPayload,
  UpdateCourierDetailsPayload,
  LocationMappingPayload,
  CourierMaster
} from '@poss-web/shared/models';
@Injectable()
export class CourierDetailsFacade {
  constructor(private store: Store<CourierDetailsState>) {}
  private courierDetailsListing$ = this.store.select(
    CourierDetailsSelectors.selectCourierDetailsListing
  );
  private totalCourierDetails$ = this.store.select(
    CourierDetailsSelectors.selectTotalCourierDetailsCount
  );
  private courierDetailsBasedOnCourierName$ = this.store.select(
    CourierDetailsSelectors.selectCourierDetailsBasedOnCourierName
  );
  private hasSaved$ = this.store.select(CourierDetailsSelectors.selectHasSaved);
  private hasUpdated$ = this.store.select(
    CourierDetailsSelectors.selectHasUpdated
  );
  private error$ = this.store.select(CourierDetailsSelectors.selectError);

  private hasSearched$ = this.store.select(
    CourierDetailsSelectors.selectHasSearched
  );
  private selectedLocations$ = this.store.select(
    CourierDetailsSelectors.selectSelectedLocations
  );
  private hasLocationsUpdated$ = this.store.select(
    CourierDetailsSelectors.selectHasLocationsUpdated
  );
  private isLoading$ = this.store.select(
    CourierDetailsSelectors.selecIsLoadingCourierDetails
  );
  private country$ = this.store.select(CourierDetailsSelectors.selectCountry);
  private states$ = this.store.select(CourierDetailsSelectors.selectStates);

  getCourierDetailsListing() {
    return this.courierDetailsListing$;
  }
  getTotalCourierDetails() {
    return this.totalCourierDetails$;
  }
  getCourierDetailsBasedOnCourierName() {
    return this.courierDetailsBasedOnCourierName$;
  }

  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getError() {
    return this.error$;
  }

  getHasSearched() {
    return this.hasSearched$;
  }
  getSelectedLocations() {
    return this.selectedLocations$;
  }
  getHasLocationsUpdated() {
    return this.hasLocationsUpdated$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getStates() {
    return this.states$;
  }

  loadCourierDetailsListing(
    loadCourierDetailsListingPayload: LoadCourierDetailsListingPayload
  ) {
    this.store.dispatch(
      new CourierDetailsActions.LoadCourierDetails(
        loadCourierDetailsListingPayload
      )
    );
  }
  loadCourierDetailsBasedOnCourierName(courierName: string) {
    this.store.dispatch(
      new CourierDetailsActions.LoadCourierDetailsBasedOnCourierName(
        courierName
      )
    );
  }
  searchCourierName(courierName: string) {
    this.store.dispatch(
      new CourierDetailsActions.SearchCourierName(courierName)
    );
  }
  resetCourierDetails() {
    this.store.dispatch(new CourierDetailsActions.ResetCourierDetails());
  }
  saveCourierDetails(saveCourierDetailsPayload: CourierMaster) {
    this.store.dispatch(
      new CourierDetailsActions.SaveCourierDetails(saveCourierDetailsPayload)
    );
  }
  updateCourierDetails(updateCourierDetails: UpdateCourierDetailsPayload) {
    this.store.dispatch(
      new CourierDetailsActions.UpdateCourierDetails(updateCourierDetails)
    );
  }
  updateCourierStatus(updateCourierStatus: {
    courierName: string;
    isActive: boolean;
  }) {
    this.store.dispatch(
      new CourierDetailsActions.UpdateCourierStatus(updateCourierStatus)
    );
  }
  loadSelectedLocations(courierName: string) {
    this.store.dispatch(
      new CourierDetailsActions.SelectedLocations(courierName)
    );
  }
  saveLocationMapping(locationMappingPayload: LocationMappingPayload) {
    this.store.dispatch(
      new CourierDetailsActions.LocationMapping(locationMappingPayload)
    );
  }
  loadCountries() {
    this.store.dispatch(new CourierDetailsActions.LoadCountry());
  }
  loadStates(countryId: string) {
    this.store.dispatch(new CourierDetailsActions.LoadStates(countryId));
  }
  getCountry() {
    return this.country$;
  }
}
