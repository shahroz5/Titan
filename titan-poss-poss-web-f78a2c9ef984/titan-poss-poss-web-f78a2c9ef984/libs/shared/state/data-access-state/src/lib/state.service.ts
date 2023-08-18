import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoadStateListingPayload,
  StateData,
  SaveStateDetailsPayload,
  LoadStatesDetailsListingSuccessPayload,
  LoadCountryDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import { StateAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getStateAllListingUrl,
  getStateByStateCodeUrl,
  getSaveStateFormDetailsUrl,
  getStateEditedFormDetailsUrl,
  getCountriesListingUrl,
  getSearchStateUrl
} from '@poss-web/shared/util-api-service';

@Injectable()
export class StateService {
  constructor(private apiService: ApiService) {}

  getStateDetails(
    loadStateDetailsPayload: LoadStateListingPayload
  ): Observable<LoadStatesDetailsListingSuccessPayload> {
    const url = getStateAllListingUrl(
      loadStateDetailsPayload.pageIndex,
      loadStateDetailsPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => StateAdaptor.getStateDetailsListing(data)));
  }

  getCountryDetails(): Observable<LoadCountryDetailsListingSuccessPayload> {
    const url = getCountriesListingUrl();
    return this.apiService
      .get(url.path)
      .pipe(map(data => StateAdaptor.getCountryDetailsListing(data)));
  }

  getStateByCode(stateCode: string): Observable<StateData> {
    const url = getStateByStateCodeUrl(stateCode);
    return this.apiService.get(url);
  }

  saveStateFormDetails(saveForm: SaveStateDetailsPayload) {
    const url = getSaveStateFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editStateFormDetails(editedForm: any) {
    const url = getStateEditedFormDetailsUrl(editedForm.stateId);
    const form = {
      countryCode: editedForm.countryCode,
      isUnionTerritory: editedForm.isUnionTerritory,
      stateCode: editedForm.stateCode,
      description: editedForm.description,
      isActive: editedForm.isActive
    };
    return this.apiService.patch(url, form);
  }

  searchStateByCode(stateName) {
    const url = getSearchStateUrl(stateName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => StateAdaptor.getSearchDetailsListing(data)));
  }

  updateIsActive(stateId, isActive) {
    const url = getStateEditedFormDetailsUrl(stateId);
    return this.apiService.patch(url, { isActive: isActive });
  }
}
