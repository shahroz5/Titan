import { Injectable } from '@angular/core';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  LocationPriceGroupMapping,
  LocationPriceGroupMappingList,
  LovMasterEnum
} from '@poss-web/shared/models';
import {
  PriceGroupAdaptor,
  PriceGroupMappingAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getLocationPriceGroupMappingUrl,
  getPriceGroupMasterAllUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
@Injectable()
export class PriceGroupMappingService {
  constructor(
    private apiService: ApiService,
    private lovService: LovDataService
  ) {}

  getPriceGroupMasterList() {
    const url = getPriceGroupMasterAllUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PriceGroupAdaptor.getPriceGroupMasterList(data)));
  }

  getPriceGroupTypeList() {
    return this.lovService.getProductLovs(LovMasterEnum.PRICINGGROUPTYPE);
  }

  getLocationPriceGroupMappingDetails(locationCode: string) {
    if (locationCode === '') {
      return of([]);
    }
    const url = getLocationPriceGroupMappingUrl(locationCode);

    return this.apiService
      .get(url.path)
      .pipe(
        map(data => PriceGroupMappingAdaptor.getPriceGroupMappingList(data))
      );
  }

  saveLocationPriceGroupMappingDetails(
    locationCode: string,
    locationPriceGroupMapping: LocationPriceGroupMapping
  ): Observable<LocationPriceGroupMappingList[]> {
    const url = getLocationPriceGroupMappingUrl(locationCode);

    return this.apiService.patch(url.path, locationPriceGroupMapping);
  }
}
