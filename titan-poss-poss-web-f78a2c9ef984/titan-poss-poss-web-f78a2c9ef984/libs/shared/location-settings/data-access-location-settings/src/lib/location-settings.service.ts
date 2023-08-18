import { Injectable } from '@angular/core';
import {
  getMasterCountryByCodeUrl,
  getMasterLocationSummaryUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { LocationSettingDetails } from '@poss-web/shared/models';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LocationSettingsAdpator } from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class LocationSettingsService {
  constructor(private apiService: CacheableApiService) {}

  loadLocationSettings(requestInput: {
    isBTQUser: boolean;
    countryName: string;
  }): Observable<LocationSettingDetails> {
    const url = getMasterLocationSummaryUrl();
    const masterCountryByCodeUrl = getMasterCountryByCodeUrl('IND');

    return this.apiService.get(url).pipe(
      mergeMap(data =>
        !!requestInput.isBTQUser
          ? of(data)
          : this.apiService.get(masterCountryByCodeUrl).pipe(
              map(countrydetails => {
                if (!!countrydetails) {
                  data.country = countrydetails;
                }
                return data;
              }),
              catchError(err => of(data))
            )
      ),
      map(data => LocationSettingsAdpator.loadLocationSettings(data))
    );
  }

  //Below method is used to get the location settings by country name/description

  // loadLocationSettings(requestInput: {
  //   isBTQUser: boolean;
  //   countryName: string;
  // }): Observable<LocationSettingDetails> {
  //   const url = getMasterLocationSummaryUrl();
  //   let countryMasterUrl;

  //   if (!requestInput.isBTQUser) {
  //     countryMasterUrl = getCountryDetailsListingUrl(
  //       0,
  //       0,
  //       requestInput.countryName
  //     );
  //   }

  //   return this.apiService.get(url).pipe(
  //     mergeMap(data =>
  //       !!requestInput.isBTQUser
  //         ? of(LocationSettingsAdpator.loadLocationSettings(data))
  //         : this.apiService
  //             .get(countryMasterUrl.path, countryMasterUrl.params)
  //             .pipe(
  //               map(countrydetails => {
  //                 if (
  //                   !!countrydetails &&
  //                   !!countrydetails.results &&
  //                   countrydetails.results.length > 0
  //                 ) {
  //                   data.country = countrydetails.results[0];
  //                 }

  //                 return LocationSettingsAdpator.loadLocationSettings(data);
  //               })
  //             )
  //     )
  //   );

  //   // return this.apiService
  //   //   .get(url)
  //   //   .pipe(map(data => LocationSettingsAdpator.loadLocationSettings(data)));
  // }
}
