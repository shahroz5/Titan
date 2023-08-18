import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourierDetailsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getSaveCourierDetailsUrl,
  getCourierDetailsBasedOnCourierNameUrl,
  getUpdateCourierDetailsUrl,
  getSelectedLocationsUrl,
  getCountriesUrl,
  getStatesUrl,
  getCourierDetailsListingUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadCourierDetailsListingPayload,
  LoadCourireDetailsListingSuccessPayload,
  UpdateCourierDetailsPayload,
  LocationMappingPayload,
  CourierMaster
} from '@poss-web/shared/models';
import { HttpParams } from '@angular/common/http';
@Injectable()
export class CourierDetailsService {
  constructor(private apiService: ApiService) {}
  getCourierDetails(
    loadCourierDetailsPayload: LoadCourierDetailsListingPayload
  ): Observable<LoadCourireDetailsListingSuccessPayload> {
    const url = getCourierDetailsListingUrl(
      loadCourierDetailsPayload.pageIndex,
      loadCourierDetailsPayload.pageSize
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CourierDetailsAdaptor.getCourierDetailsListing(data)));
  }
  getCourierDetailsBasedOnCourierName(
    courierName: string
  ): Observable<CourierMaster> {
    if (courierName === 'new') {
      return of(CourierDetailsAdaptor.getCourierDetailsBasedOnCourierName());
    } else {
      const url = getCourierDetailsBasedOnCourierNameUrl(courierName);
      return this.apiService.get(url);
    }
  }
  searchCourierName(courierName: string) {
    const url = getCourierDetailsBasedOnCourierNameUrl(courierName);

    return this.apiService
      .get(url)
      .pipe(map(data => CourierDetailsAdaptor.getCourierDetails(data)));
  }
  saveCourierDetails(
    saveCourierDetails: CourierMaster
  ): Observable<CourierMaster> {
    const url = getSaveCourierDetailsUrl();
    return this.apiService.post(url, saveCourierDetails);
  }
  updateCourierDetails(
    updateCourierDetails: UpdateCourierDetailsPayload
  ): Observable<CourierMaster> {
    const url = getUpdateCourierDetailsUrl(updateCourierDetails.courierName);
    return this.apiService.patch(url, updateCourierDetails.data);
  }
  updateCourierStatus(updateStatus: {
    courierName: string;
    isActive: boolean;
  }): Observable<CourierMaster> {
    const url = getUpdateCourierDetailsUrl(updateStatus.courierName);
    return this.apiService.patch(url, { isActive: updateStatus.isActive });
  }
  selectedLocations(courierName: string) {
    const url = getSelectedLocationsUrl(courierName);
    return this.apiService
      .get(url)
      .pipe(map(data => CourierDetailsAdaptor.getSelectedLocations(data)));
  }
  getCountry() {
    let url: { path: string; params: HttpParams };
    url = getCountriesUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CourierDetailsAdaptor.getCountry(data)));
  }
  getStates(countryId: string) {
    let url: { path: string; params: HttpParams };
    url = getStatesUrl(countryId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CourierDetailsAdaptor.getStates(data)));
  }

  locationMapping(locationMappingPayload: LocationMappingPayload) {
    const url = getSelectedLocationsUrl(locationMappingPayload.courierName);
    return this.apiService.post(url, locationMappingPayload.locationMapping);
  }
}
