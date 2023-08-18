import { Injectable } from '@angular/core';

import {
  ApiService,
  getUcpMarketCodeUrl,
  getUcpMarketCodeFactorByCodeUrl,
  getSaveUcpMarketCodeFactorUrl,
  getMarketCodeUrl,
  getUcpProductGroupUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { UcpMarketCodeFactorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class UcpMarketCodeFactorService {
  constructor(private apiService: ApiService) {}
  getUcpMarketCodeFactorList(pageIndex, pageSize, searhValue) {
    const url = getUcpMarketCodeUrl(pageIndex, pageSize, searhValue);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => UcpMarketCodeFactorAdaptor.getUcpMarketCodeFactorList(data))
      );
  }

  getUcpMarketCodeFactorByCode(id) {
    const url = getUcpMarketCodeFactorByCodeUrl(id);
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          UcpMarketCodeFactorAdaptor.getUcpMarketCodeFactorByCodeData(data)
        )
      );
  }

  updateUcpMarketCodeFactorByCode(ucpMarketCodeFactor) {
    const url = getUcpMarketCodeFactorByCodeUrl(ucpMarketCodeFactor.id);
    return this.apiService.put(url, ucpMarketCodeFactor.data);
  }

  saveUcpMarketCodeFactor(ucpMarketCodeFactor) {
    const url = getSaveUcpMarketCodeFactorUrl();
    return this.apiService.post(url, ucpMarketCodeFactor);
  }

  getMarketCode() {
    const url = getMarketCodeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => UcpMarketCodeFactorAdaptor.getMarketCodeData(data)));
  }
  getUcpProductGroup() {
    const url = getUcpProductGroupUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => UcpMarketCodeFactorAdaptor.getUcpProductGroupData(data))
      );
  }
}
