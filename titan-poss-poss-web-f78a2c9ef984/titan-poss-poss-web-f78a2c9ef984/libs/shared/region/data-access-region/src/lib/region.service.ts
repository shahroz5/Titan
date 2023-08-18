import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoadRegionListingPayload,
  LoadRegionDetailsListingSuccessPayload,
  RegionsData,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';
import { RegionsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getRegionAllListingUrl,
  getRegionByRegionCodeUrl,
  getSaveRegionFormDetailsUrl,
  getRegionEditedFormDetailsUrl
} from '@poss-web/shared/util-api-service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  constructor(private apiService: ApiService) {}

  getRegionDetails(
    loadRegionDetailsPayload: LoadRegionListingPayload
  ): Observable<LoadRegionDetailsListingSuccessPayload> {
    const url = getRegionAllListingUrl(
      loadRegionDetailsPayload.pageIndex,
      loadRegionDetailsPayload.pageSize,
      'REGION'
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => RegionsAdaptor.getRegionDetailsListing(data)));
  }

  getRegionByCode(regionCode: string): Observable<RegionsData> {
    const url = getRegionByRegionCodeUrl(regionCode);
    return this.apiService.get(url.path, url.params);
  }

  saveRegionFormDetails(saveForm: SaveRegionDetailsPayload) {
    const url = getSaveRegionFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editRegionFormDetails(editedForm: EditRegionDetailsPayload) {
    const url = getRegionEditedFormDetailsUrl(editedForm.regionCode);
    const form = {
      description: editedForm.description,
      configDetails: {},
      isActive: editedForm.isActive
    };
    return this.apiService.patch(url, form);
  }

  searchRegionByCode(townCode) {
    const url = getRegionByRegionCodeUrl(townCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => RegionsAdaptor.getSearchDetailsListing(data)));
  }
}
