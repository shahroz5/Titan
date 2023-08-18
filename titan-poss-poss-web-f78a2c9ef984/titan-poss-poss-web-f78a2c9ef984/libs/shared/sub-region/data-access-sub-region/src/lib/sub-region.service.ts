import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getRegionByRegionCodeUrl,
  getSaveRegionFormDetailsUrl,
  getSubRegionListingUrl,
  getRegionEditedFormDetailsUrl,
  getRegionLiteDataUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadSubRegionListingSuccessPayload,
  LoadSubRegionDetailsListingPayload,
  RegionsData,
  SaveSubRegionDetailsPayload,
  EditSubRegionDetailsPayload,
  LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import { SubRegionAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class SubRegionService {
  constructor(private apiService: ApiService) {}

  getRegionDetails(): Observable<LoadRegionDetailsListingSuccessPayload> {
    const url = getRegionLiteDataUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => SubRegionAdaptor.getRegionDetailsListing(data)));
  }

  getSubRegionDetails(
    subRegionPayload: LoadSubRegionDetailsListingPayload
  ): Observable<LoadSubRegionListingSuccessPayload> {
    const url = getSubRegionListingUrl(
      subRegionPayload.pageIndex,
      subRegionPayload.pageSize,
      subRegionPayload.parentRegionCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => SubRegionAdaptor.getSubRegionDetailsListing(data)));
  }

  getSubRegionByCode(regionCode: string): Observable<RegionsData> {
    const url = getRegionByRegionCodeUrl(regionCode);
    return this.apiService.get(url.path, url.params);
  }

  saveSubRegionFormDetails(saveForm: SaveSubRegionDetailsPayload) {
    const url = getSaveRegionFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editSubRegionFormDetails(editedForm: EditSubRegionDetailsPayload) {
    const url = getRegionEditedFormDetailsUrl(editedForm.regionCode);
    const form = {
      description: editedForm.description,
      configDetails: {},
      isActive: editedForm.isActive
    };
    return this.apiService.patch(url, form);
  }

  searchSubRegionByCode(subRegionCode: string, parentRegionCode: string) {
    const url = getRegionByRegionCodeUrl(subRegionCode, parentRegionCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => SubRegionAdaptor.getSearchDetailsListing(data)));
  }
}
