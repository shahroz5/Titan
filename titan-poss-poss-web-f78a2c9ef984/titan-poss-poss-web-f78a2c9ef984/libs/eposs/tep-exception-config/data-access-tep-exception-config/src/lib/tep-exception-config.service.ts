import { Injectable } from '@angular/core';
import {
  TEPExceptionConfig,
  TEPExceptionConfigEnum,
  TEPExceptionConfigFilter
} from '@poss-web/shared/models';
import { TepExceptionConfigAdaptors } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getTepExceptionConfigDetailsUrl,
  getTepExceptionConfigListUrl,
  getTepExceptionConfigSaveUrl,
  getTepGlobalConfigListUrl,
  searchTepExceptionConfigListUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
@Injectable()
export class TepExceptionConfigService {
  constructor(private apiservice: ApiService) {}

  getMaxFlatTepExchangeValue() {
    const url = getTepGlobalConfigListUrl();

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => TepExceptionConfigAdaptors.getTepGlobalConfig(data)));
  }

  getTepExceptionConfigList(pageIndex: number, pageSize: number) {
    const url = getTepExceptionConfigListUrl(pageIndex, pageSize);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data => TepExceptionConfigAdaptors.getTepExceptionConfigList(data))
      );
  }

  searchTepExceptionConfigList(filter: TEPExceptionConfigFilter) {
    const url = searchTepExceptionConfigListUrl(filter);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data => TepExceptionConfigAdaptors.getTepExceptionConfigList(data))
      );
  }

  getTepExceptionConfigDetails(
    configId: string
  ): Observable<TEPExceptionConfig> {
    if (configId === TEPExceptionConfigEnum.NEW) {
      return of(TepExceptionConfigAdaptors.getTepExceptionConfigDetailsNew());
    }

    const url = getTepExceptionConfigDetailsUrl(configId);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TepExceptionConfigAdaptors.getTepExceptionConfigDetails(data)
        )
      );
  }

  saveTepExceptionConfigDetails(
    formData: TEPExceptionConfig
  ): Observable<TEPExceptionConfig> {
    const url = getTepExceptionConfigSaveUrl();

    return this.apiservice
      .post(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepExceptionConfigAdaptors.getTepExceptionConfigDetails(data)
        )
      );
  }

  updateTepExceptionConfigDetails(
    formData: TEPExceptionConfig
  ): Observable<TEPExceptionConfig> {
    const url = getTepExceptionConfigDetailsUrl(formData.configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(
        map(data =>
          TepExceptionConfigAdaptors.getTepExceptionConfigDetails(data)
        )
      );
  }
}
