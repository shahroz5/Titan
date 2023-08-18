import { Injectable } from '@angular/core';
import {
  FOCBlockingLocationLevelListPayload,
  FOCBlockingLocationLevelSavePayload
} from '@poss-web/shared/models';
import { FOCBlockingLocationLevelAdaptor } from '@poss-web/shared/util-adaptors';
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
export class FOCBLLService {
  constructor(private apiService: ApiService) {}
  saveFOCBLLDetails(payload: FOCBlockingLocationLevelSavePayload) {
    const url = getSaveFocBlockingLocationLevelUrl(payload.id);
    return this.apiService.patch(url, payload.savePayload);
  }
  searchLocation(searchPayload: { schemeId: string; locationCode: string }) {
    const url = getSearchLocationCodeUrl(
      searchPayload.schemeId,
      searchPayload.locationCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => FOCBlockingLocationLevelAdaptor.SearchLocationCode(data))
      );
  }
  loadFOCBLLDetails(listPayload: FOCBlockingLocationLevelListPayload) {
    const url = getFocBlockingLocationLevelListUrl(
      listPayload.pageIndex,
      listPayload.pageSize,
      listPayload.id
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          FOCBlockingLocationLevelAdaptor.FocBlockingLocationLevelList(data)
        )
      );
  }

  loadSchemeId(schemeName: string) {
    const url = getSchemeIdUrl(schemeName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FOCBlockingLocationLevelAdaptor.getSchemeId(data)));
  }
  getSelectedLocations(listPayload: FOCBlockingLocationLevelListPayload) {
    const url = getFocBlockingLocationLevelListUrl(
      listPayload.pageIndex,
      listPayload.pageSize,
      listPayload.id
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => FOCBlockingLocationLevelAdaptor.SelectedLocations(data))
      );
  }
}
