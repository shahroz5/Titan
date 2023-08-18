import { Injectable } from '@angular/core';
import {
  TEPExceptionConfig,
  TEPStoneConfig,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigEnum,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';
import {
  TepExceptionConfigAdaptors,
  TepStoneConfigAdaptors
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getTepStoneConfigUrl,
  getTepStoneConfigListUrl,
  getTepStoneConfigDetailsListUrl,
  getRangesUrl,
  getStoneTypeDetailsAllListingUrl,
  getStoneQualitiesDetailsListingUrl,
  updateTepStoneConfigDetailsUrl,
  getTepStoneConfigSaveUrl,
  searchTepStoneConfigListUrl,
  searchTepStoneConfigDetalsListUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
@Injectable()
export class TepStoneConfigService {
  constructor(private apiservice: ApiService) {}

  getTepStoneConfigList(pageIndex: number, pageSize: number) {
    const url = getTepStoneConfigListUrl(pageIndex, pageSize);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getTepStoneConfigList(data)));
  }

  searchTepStoneConfigList(filter: string) {
    const url = searchTepStoneConfigListUrl(filter);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data => TepExceptionConfigAdaptors.getTepExceptionConfigList(data))
      );
  }

  saveTepStoneConfig(formData: TEPStoneConfig): Observable<TEPStoneConfig> {
    const url = getTepStoneConfigSaveUrl();

    return this.apiservice
      .post(url.path, formData, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getTepStoneConfigDetails(data)));
  }

  updateTepStoneConfig(formData: TEPStoneConfig): Observable<TEPStoneConfig> {
    const url = getTepStoneConfigUrl(formData.configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getTepStoneConfigDetails(data)));
  }

  getTepStoneConfig(configId: string): Observable<TEPExceptionConfig> {
    if (configId === TEPStoneConfigEnum.NEW) {
      return of(TepStoneConfigAdaptors.getTepStoneConfigDetailsNew());
    }

    const url = getTepStoneConfigUrl(configId);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getTepStoneConfigDetails(data)));
  }

  getTepStoneConfigDetailsList(configId: string) {
    const url = getTepStoneConfigDetailsListUrl(configId);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data => TepStoneConfigAdaptors.getTepStoneConfigDetailsList(data))
      );
  }

  searchTepStoneConfigDetailsList(configId: string, stoneTypeCode: string) {
    const url = searchTepStoneConfigDetalsListUrl(configId, stoneTypeCode);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data => TepStoneConfigAdaptors.getTepStoneConfigDetailsList(data))
      );
  }

  getStoneQualitiesList() {
    const url = getStoneQualitiesDetailsListingUrl();

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getStoneQualitiesList(data)));
  }

  getStoneTypesList() {
    const url = getStoneTypeDetailsAllListingUrl();

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getStoneTypeList(data)));
  }

  getRangesList() {
    const rangeType = 'TEP_CARAT';
    const url = getRangesUrl(rangeType);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => TepStoneConfigAdaptors.getRangesList(data)));
  }

  addTepStoneConfigDetails(
    configId: string,
    formData: TEPStoneDetailsModify
  ): Observable<TEPStoneConfigDetailsListing> {
    const url = updateTepStoneConfigDetailsUrl(configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(
        map(data => TepStoneConfigAdaptors.getTepStoneConfigDetailsList(data))
      );
  }
  removeTepStoneConfigDetails(
    configId: string,
    formData: TEPStoneDetailsModify
  ): Observable<string[]> {
    const url = updateTepStoneConfigDetailsUrl(configId);

    return this.apiservice
      .patch(url.path, formData, url.params)
      .pipe(
        map(() =>
          TepStoneConfigAdaptors.removeTepStoneConfigDetailsList(formData)
        )
      );
  }
}
