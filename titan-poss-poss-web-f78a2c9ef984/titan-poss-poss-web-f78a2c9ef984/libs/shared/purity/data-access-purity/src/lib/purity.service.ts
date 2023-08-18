import { Injectable } from '@angular/core';
import {
  getPurityListUrl,
  getLoadMetalTypeUrl,
  ApiService,
  getSavePurityUrl,
  getloadPurityByCodeUrl,
  getUpdatePurityUrl
} from '@poss-web/shared/util-api-service';
import { PurityAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CreatePurityPayload,
  UpdatePurityPayload
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
@Injectable()
export class PurityService {
  constructor(public apiService: ApiService) {}

  getPurityList(pageIndex: number, pageSize: number, searchValue?: string) {
    const url = getPurityListUrl(pageIndex, pageSize, searchValue);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PurityAdaptor.getPurityListData(data)));
  }

  loadMetalTypes() {
    const url = getLoadMetalTypeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PurityAdaptor.getMetalTypes(data)));
  }

  loadPurityByMaterialCodeAndPurity(materialCode: string, purity) {
    const url = getloadPurityByCodeUrl(materialCode, purity);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PurityAdaptor.getPurityByMaterialCodeAndPurity(data)));
  }

  savePurity(purity: CreatePurityPayload) {
    const url = getSavePurityUrl();
    return this.apiService.post(url, purity);
  }

  updatePurity(purity: UpdatePurityPayload) {
    const url = getUpdatePurityUrl();
    return this.apiService.patch(url, purity.data);
  }
}
