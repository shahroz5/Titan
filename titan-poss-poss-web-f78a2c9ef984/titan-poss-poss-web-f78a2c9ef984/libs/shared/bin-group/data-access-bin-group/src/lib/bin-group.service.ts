import { Injectable } from '@angular/core';
import { BinGroupAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadBinGroupDetailsListingSuccessPayload,
  LoadBinGroupDetailsListingPayload,
  SaveBinGroupFormDetailsPayload,
  BinGroupDetails
} from '@poss-web/shared/models';
import {
  ApiService,
  getBinGroupDetailsListingUrl,
  getBinGroupByBinGroupCode,
  getBinGroupSaveFormDetailsUrl,
  getBinGroupEditedFormDetailsUrl
} from '@poss-web/shared/util-api-service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class BinGroupService {
  constructor(private apiService: ApiService) {}

  getbinGroupDetails(
    loadBinGroupDetailsPayload: LoadBinGroupDetailsListingPayload
  ): Observable<LoadBinGroupDetailsListingSuccessPayload> {
    const url = getBinGroupDetailsListingUrl(
      loadBinGroupDetailsPayload.pageIndex,
      loadBinGroupDetailsPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => BinGroupAdaptor.getBinGroupDetailsListing(data)));
  }

  getBinGroupByBinGroupCode(binGroupCode: string): Observable<BinGroupDetails> {
    const url = getBinGroupByBinGroupCode(binGroupCode);
    return this.apiService.get(url);
  }

  saveBinGroupFormDetails(saveForm: SaveBinGroupFormDetailsPayload) {
    const url = getBinGroupSaveFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editBinGroupFormDetails(editedForm: SaveBinGroupFormDetailsPayload) {
    const url = getBinGroupEditedFormDetailsUrl(editedForm.binGroupCode);
    return this.apiService.patch(url, editedForm);
  }

  searchBinGroupByBinGroupCode(binGroupCode): Observable<any> {
    const url = getBinGroupByBinGroupCode(binGroupCode);
    return this.apiService
      .get(url)
      .pipe(map(data => BinGroupAdaptor.getSearchDetailsListing(data)));
  }
}
