import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import {
  getPriceGroupMasterUrl,
  ApiService,
  getPriceGroupByPriceGroupCodeUrl,
  getUpdatePriceGroupMasterUrl,
  savePriceGroupUrl
} from '@poss-web/shared/util-api-service';
import { PriceGroupAdaptor } from '@poss-web/shared/util-adaptors';
import { PriceGroupMaster } from '@poss-web/shared/models';

@Injectable()
export class PriceGroupService {
  constructor(private apiService: ApiService) {}

  getPriceGroupMasterList(pageIndex, pageSize) {
    const url = getPriceGroupMasterUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PriceGroupAdaptor.getPriceGroupMasterList(data)));
  }

  getPriceGroupByPriceGroupCode(priceGroup: string) {
    const url = getPriceGroupByPriceGroupCodeUrl(priceGroup);
    return this.apiService
      .get(url)
      .pipe(map(data => PriceGroupAdaptor.getPriceGroupByPriceGroupCode(data)));
  }
  updatePriceGroupByPriceGroupCode(priceGroupCode: string, data: any) {
    const url = getUpdatePriceGroupMasterUrl(priceGroupCode);
    return this.apiService.patch(url, data);
  }
  savePriceGroup(priceGroup: PriceGroupMaster) {
    const url = savePriceGroupUrl();
    return this.apiService.post(url, priceGroup);
  }
  searchPriceGroupList(priceGroup: string) {
    const url = getPriceGroupByPriceGroupCodeUrl(priceGroup);
    return this.apiService
      .get(url)
      .pipe(map(data => PriceGroupAdaptor.getSearchResult(data)));
  }
}
