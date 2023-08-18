import { Injectable } from '@angular/core';
import { FOCBCLListingPayload } from '@poss-web/shared/models';
import {
  FOCBlockingAtCustomerLevelAdaptor,
  FOCBlockingLocationLevelAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getFocBlockingLocationLevelListUrl,
  getSaveFocBlockingLocationLevelUrl,
  getSchemeIdUrl,
  getSearchLocationCodeUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FOCBCLService {
  constructor(private apiService: ApiService) {}
  saveFOCBCLDetails(savePayload: any) {
    const url = getSaveFocBlockingLocationLevelUrl(savePayload.id);
    return this.apiService.patch(url, savePayload.savePayload);
  }
  searchLocation(searchPayload: { schemeId: string; locationCode: string }) {
    const url = getSearchLocationCodeUrl(
      searchPayload.schemeId,
      searchPayload.locationCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => FOCBlockingAtCustomerLevelAdaptor.SearchLocationCode(data))
      );
  }
  loadFOCBCLDetails(listPayload: FOCBCLListingPayload) {
    const url = getFocBlockingLocationLevelListUrl(
      listPayload.pageIndex,
      listPayload.pageSize,
      listPayload.schemeId
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          FOCBlockingAtCustomerLevelAdaptor.FocBlockingCustomerLevelList(data)
        )
      );
  }
  loadSchemeId(schemeName: string) {
    const url = getSchemeIdUrl(schemeName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FOCBlockingLocationLevelAdaptor.getSchemeId(data)));
  }
  getSelectedLocations(listPayload: FOCBCLListingPayload) {
    const url = getFocBlockingLocationLevelListUrl(
      listPayload.pageIndex,
      listPayload.pageSize,
      listPayload.schemeId
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => FOCBlockingLocationLevelAdaptor.SelectedLocations(data))
      );
  }
}
