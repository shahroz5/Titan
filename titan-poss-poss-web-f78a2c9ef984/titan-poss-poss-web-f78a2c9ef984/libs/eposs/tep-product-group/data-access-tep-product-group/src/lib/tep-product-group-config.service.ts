import { Injectable } from '@angular/core';
import {
  AddTEPProductGroupsMapping,
  TEPProductGroupConfigDetails,
  TEPProductGroupMappingListing
} from '@poss-web/shared/models';
import { TepProductGroupConfigAdaptors } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getTepProductGroupConfigDetailsUrl,
  getTepProductGroupConfigListUrl,
  getTepProductGroupConfigSaveUrl,
  getTepProductGroupMappingListUrl,
  getTepProductGroupMappingSaveUrl,
  searchTepProductGroupConfigListUrl,
  searchTepProductGroupMappingListUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
@Injectable()
export class TepProductGroupConfigService {
  constructor(private apiservice: ApiService) {}

  getTepProductGroupConfigList(
    pageIndex: number, 
    pageSize: number,
    description?: string
  ) {
    const url = getTepProductGroupConfigListUrl(pageIndex, pageSize, description);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupConfigList(data)
        )
      );
  }

  searchTepProductGroupConfigList(filter: string) {
    const url = searchTepProductGroupConfigListUrl(filter);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupConfigList(data)
        )
      );
  }

  getTepProductGroupConfigDetails(
    configId: string
  ): Observable<TEPProductGroupConfigDetails> {
    if (configId === 'NEW') {
      return of(
        TepProductGroupConfigAdaptors.getTepExceptionConfigDetailsNew()
      );
    }

    const url = getTepProductGroupConfigDetailsUrl(configId);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupConfigDetails(data)
        )
      );
  }

  saveTepProductGroupConfigDetails(
    formData: TEPProductGroupConfigDetails
  ): Observable<TEPProductGroupConfigDetails> {
    const url = getTepProductGroupConfigSaveUrl();

    return this.apiservice
      .post(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupConfigDetails(data)
        )
      );
  }

  updateTepProductGroupConfigDetails(
    formData: Partial<TEPProductGroupConfigDetails>
  ): Observable<TEPProductGroupConfigDetails> {
    const url = getTepProductGroupConfigDetailsUrl(formData.configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupConfigDetails(data)
        )
      );
  }

  getTepProductGroupMappingList(
    configId: string,
    pageIndex: number,
    pageSize: number,
    sort?: string[]
  ): Observable<TEPProductGroupMappingListing> {
    const url = getTepProductGroupMappingListUrl(configId, pageIndex, pageSize, sort);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupMappingList(data)
        )
      );
  }

  searchTepProductGroupMappingList(configId: string, productGroup: string) {
    const url = searchTepProductGroupMappingListUrl(configId, productGroup);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupMappingList(data)
        )
      );
  }

  saveTepExceptionMappingDetails(
    configId: string,
    formData: AddTEPProductGroupsMapping
  ): Observable<TEPProductGroupMappingListing> {
    const url = getTepProductGroupMappingSaveUrl(configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepProductGroupConfigAdaptors.getTepProductGroupMappingList(data)
        )
      );
  }
}
