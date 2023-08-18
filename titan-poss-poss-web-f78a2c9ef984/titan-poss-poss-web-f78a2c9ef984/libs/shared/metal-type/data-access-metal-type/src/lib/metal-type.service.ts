import { Injectable } from '@angular/core';
import {
  getMetalTypeListUrl,
  getSearchMetalTypeByMaterialCode,
  getSaveMetalTypeUrl,
  getUpdateMetalTypeUrl,
  getLoadMetalTypeByMaterialCodeUrl,
  ApiService
} from '@poss-web/shared/util-api-service';

import { UpdateMetalTypePayload, MaterialType } from '@poss-web/shared/models';
import { MetalTypeAdaptor } from '@poss-web/shared/util-adaptors';

import { map } from 'rxjs/operators';
@Injectable()
export class MetalTypeService {
  constructor(public apiService: ApiService) {}

  getAllMetalTypeList(pageIndex: number, pageSize: number) {
    const url = getMetalTypeListUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => MetalTypeAdaptor.getMetalTypeListData(data)));
  }

  loadMetalTypeByMaterialCode(materialCode: string) {
    const url = getLoadMetalTypeByMaterialCodeUrl(materialCode);
    return this.apiService
      .get(url)
      .pipe(
        map(data => MetalTypeAdaptor.getLoadMetalTypeByMaterialCodeData(data))
      );
  }
  searchMetalTypeList(searchValue: string) {
    const url = getSearchMetalTypeByMaterialCode(searchValue);
    return this.apiService
      .get(url)
      .pipe(map(data => MetalTypeAdaptor.getSearchMetalTypeListData(data)));
  }

  saveMetalType(metalType: MaterialType) {
    const url = getSaveMetalTypeUrl();
    return this.apiService.post(url, metalType);
  }

  updateMetalTypeDetail(metalType: UpdateMetalTypePayload) {
    const url = getUpdateMetalTypeUrl(metalType.materialTypeCode);
    return this.apiService
      .patch(url, metalType.data)
      .pipe(map(data => MetalTypeAdaptor.getUpdatedMetalType(data)));
  }
}
