import { Injectable } from '@angular/core';
import {
  TEPValidationConfigListing,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { TepValidationConfigAdaptors } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getTepValidationConfigDetailsUrl,
  getTepValidationConfigListUrl,
  getTepValidationConfigSaveUrl,
  searchTepValidationConfigListUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
@Injectable()
export class TepValidationConfigService {
  constructor(private apiservice: ApiService) {}

  getTepValidationConfigList(
    pageIndex: number,
    pageSize: number
  ): Observable<TEPValidationConfigListing> {
    const url = getTepValidationConfigListUrl(pageIndex, pageSize);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepValidationConfigAdaptors.getTepValidationConfigList(data)
        )
      );
  }

  searchTepValidationConfigList(
    filter: string
  ): Observable<TEPValidationConfigListing> {
    const url = searchTepValidationConfigListUrl(filter);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepValidationConfigAdaptors.getTepValidationConfigList(data)
        )
      );
  }

  getTepValidationConfigDetails(
    configId: string
  ): Observable<TEPValidationConfigResult> {
    if (configId === 'NEW') {
      return of(TepValidationConfigAdaptors.getTepValidationDetailsNew());
    }

    const url = getTepValidationConfigDetailsUrl(configId);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepValidationConfigAdaptors.getTepValidationConfigDetails(data)
        )
      );
  }

  saveTepValidationConfigDetails(
    formData: TEPValidationConfigResult
  ): Observable<TEPValidationConfigResult> {
    const url = getTepValidationConfigSaveUrl();

    return this.apiservice
      .post(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepValidationConfigAdaptors.getTepValidationConfigDetails(data)
        )
      );
  }

  updateTepValidationConfigDetails(
    formData: Partial<TEPValidationConfigResult>
  ): Observable<TEPValidationConfigResult> {
    const url = getTepValidationConfigDetailsUrl(formData.configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepValidationConfigAdaptors.getTepValidationConfigDetails(data)
        )
      );
  }
}
