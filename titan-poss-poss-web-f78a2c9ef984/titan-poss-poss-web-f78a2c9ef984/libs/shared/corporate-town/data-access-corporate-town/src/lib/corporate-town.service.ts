import { Injectable } from '@angular/core';
import {
  LoadCorporateTownListingPayload,
  LoadCorporateTownListingSuccessPayload,
  SaveTownFormDetailsPayload,
  CorporateTown
} from '@poss-web/shared/models';
import {
  ApiService,
  getCorporateTownListingUrl,
  getTownDetailsByTownCodeUrl,
  getSaveTownFormDetailsUrl,
  getTownEditedFormDetailsUrl,
  getTownSearchData,
} from '@poss-web/shared/util-api-service';
import { CorporateTownAdaptor } from '@poss-web/shared/util-adaptors';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CorporateTownService {
  constructor(private apiService: ApiService) {}

  getCorporateTownDetails(
    loadCorporateTownDetailsPayload: LoadCorporateTownListingPayload
  ): Observable<LoadCorporateTownListingSuccessPayload> {
    const url = getCorporateTownListingUrl(
      loadCorporateTownDetailsPayload.pageIndex,
      loadCorporateTownDetailsPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CorporateTownAdaptor.getCorporateTownDetailsListing(data))
      );
  }

  getTownDetailsByTownCode(townCode: string): Observable<CorporateTown> {
    const url = getTownDetailsByTownCodeUrl(townCode);
    return this.apiService.get(url);
  }

  saveTownFormDetails(saveForm: SaveTownFormDetailsPayload) {
    const url = getSaveTownFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editTownFormDetails(editedForm: SaveTownFormDetailsPayload) {
    // const payload = {
    //   stateName: editedForm.stateName,
    //   description: editedForm.description,
    //   isActive: editedForm.isActive
    // };

    const url = getTownEditedFormDetailsUrl(editedForm.townCode);
    return this.apiService.patch(url, editedForm);
  }

  searchCorporateTown(townName) {
    const url = getTownSearchData(townName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CorporateTownAdaptor.getSearchDetailsListing(data)));
  }
}
