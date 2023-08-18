import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getGlBoutiqueLocationListingUrl,
  getGlBoutiqueLocationByLocationCodeUrl,
  getGlBoutiqueLocationSaveDetailsUrl,
  getGlBoutiqueLocationEditDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  GlBoutiqueLocationListingPayload,
  GlBoutiqueLocationSuccessPayload,
  GlBoutiqueLocationList
} from '@poss-web/shared/models';
import { GlBoutiqueLocationAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class GlBoutiqueLocationService {
  constructor(private apiService: ApiService) {}

  getGlBoutiqueLocationList(
    loadGlBoutiqueLocationListingPayload: GlBoutiqueLocationListingPayload
  ): Observable<GlBoutiqueLocationSuccessPayload> {
    const url = getGlBoutiqueLocationListingUrl(
      loadGlBoutiqueLocationListingPayload.pageIndex,
      loadGlBoutiqueLocationListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          GlBoutiqueLocationAdaptor.getGlBoutiqueLocationListing(data)
        )
      );
  }
  getGlBoutiqueLocationDetailsByLocationCode(
    locationCode: string
  ): Observable<GlBoutiqueLocationList> {
    if (locationCode === 'new') {
      return of(GlBoutiqueLocationAdaptor.getGlBoutiqueByLocation());
    } else {
      const url = getGlBoutiqueLocationByLocationCodeUrl(locationCode);
      return this.apiService.get(url);
    }
  }

  saveGlBoutiqueLocationDetails(saveDetails: GlBoutiqueLocationList) {
    console.log(saveDetails);
    const url = getGlBoutiqueLocationSaveDetailsUrl();
    return this.apiService.post(url, saveDetails);
  }

  editGlBoutiqueLocationDetails(editDetails: GlBoutiqueLocationList) {
    console.log(editDetails);
    const url = getGlBoutiqueLocationEditDetailsUrl(editDetails.locationCode);
    return this.apiService.patch(url, editDetails);
  }
  getGlBoutiqueLocationSearchResult(
    locationCode: string
  ): Observable<GlBoutiqueLocationList[]> {
    const url = getGlBoutiqueLocationByLocationCodeUrl(locationCode);
    return this.apiService
      .get(url)
      .pipe(
        map(data => GlBoutiqueLocationAdaptor.getGlBoutiqueLocationSearch(data))
      );
  }
}
