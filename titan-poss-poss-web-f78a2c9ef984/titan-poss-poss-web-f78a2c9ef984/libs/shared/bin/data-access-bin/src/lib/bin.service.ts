import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LocationList,
  SaveBinCodeFormPayload,
  LocationMappingPostPayload,
  LocationsByBinGroupAndBinCodePayload,
  LoadSearchBinCodeDetails,
  BinCodeListingPayload
} from '@poss-web/shared/models';
import {
  ApiService,
  getBinCodeSaveNewFormDetailsUrl,
  getBinCodesByBinGroupCode,
  getBinCodeEditedFormDetailsUrl,
  getBinDetailsByBinNameUrl,
  getLocationsByBinGroupAndBinCode,
  getLocationMappingUpdateUrl
} from '@poss-web/shared/util-api-service';
import { BinAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class BinService {
  constructor(private apiService: ApiService) {}

  saveBinCodeNewFormDetails(saveForm: SaveBinCodeFormPayload) {
    const url = getBinCodeSaveNewFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  getBinCodesByBinGroupCode(
    payload: BinCodeListingPayload
  ): Observable<LoadSearchBinCodeDetails> {
    const url = getBinCodesByBinGroupCode(
      payload.binGroupCode,
      payload.pageIndex,
      payload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => BinAdaptor.binCodesByBinGroup(data)));
  }

  saveBinCodeEditedFormDetails(saveForm) {
    const editedForm = {
      binGroupCode: saveForm.binGroupCode,
      isActive: saveForm.isActive,
      description: saveForm.description
    };

    const url = getBinCodeEditedFormDetailsUrl(saveForm.binCode);
    return this.apiService.patch(url, editedForm);
  }

  searchBinName(binName: string, binGroupCode: string) {
    const url = getBinDetailsByBinNameUrl(binName, binGroupCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => BinAdaptor.getSearchDetailsListing(data)));
  }

  getLocationsByBinGroupAndBinCode(
    location: LocationsByBinGroupAndBinCodePayload
  ): Observable<LocationList[]> {
    const url = getLocationsByBinGroupAndBinCode(location);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => BinAdaptor.locationsByBinGroupAndCode(data)));
  }

  saveLocationMapping(saveForm: LocationMappingPostPayload) {
    const url = getLocationMappingUpdateUrl(saveForm.binGroup);
    return this.apiService.patch(url, saveForm.data);
  }
}
