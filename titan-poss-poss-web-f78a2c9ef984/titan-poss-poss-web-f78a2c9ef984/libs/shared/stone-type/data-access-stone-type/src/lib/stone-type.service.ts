import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@poss-web/shared/util-api-service';
import {
  LoadStoneTypeListingPayload,
  LoadStoneTypeListingSuccessPayload,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';
import {
  getStoneTypeDetailsListingUrl,
  getStoneTypeDetailsBystoneTypeCodeUrl,
  getStoneTypeSaveFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import { StoneTypeAdaptor } from '@poss-web/shared/util-adaptors';
import { StoneTypeDetails } from '@poss-web/shared/models';

@Injectable()
export class StoneTypeService {
  constructor(private apiService: ApiService) {}

  getStoneTypeDetails(
    loadStoneTypeListingPayload: LoadStoneTypeListingPayload
  ): Observable<LoadStoneTypeListingSuccessPayload> {
    const url = getStoneTypeDetailsListingUrl(
      loadStoneTypeListingPayload.pageIndex,
      loadStoneTypeListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => StoneTypeAdaptor.getStoneTypeDetailsListing(data)));
  }
  getStoneTypeDetailsByStoneTypeCode(
    stoneTypeCode: string
  ): Observable<StoneTypeDetails> {
    const url = getStoneTypeDetailsBystoneTypeCodeUrl(stoneTypeCode);
    return this.apiService.get(url);
  }

  saveStoneTypeFormDetails(saveForm: SaveStoneTypeFormDetailsPayload) {
    const url = getStoneTypeSaveFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editStoneTypeFormDetails(editedForm: SaveStoneTypeFormDetailsPayload) {
    const url = getStoneTypeDetailsBystoneTypeCodeUrl(editedForm.stoneTypeCode);
    return this.apiService.patch(url, editedForm);
  }
  getStoneTypeSearchResult(
    stoneTypeCode: string
  ): Observable<StoneTypeDetails[]> {
    const url = getStoneTypeDetailsBystoneTypeCodeUrl(stoneTypeCode);
    return this.apiService
      .get(url)
      .pipe(map(data => StoneTypeAdaptor.getStoneTypeDetailsSearch(data)));
  }
}
