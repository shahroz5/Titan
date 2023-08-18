import { Injectable } from '@angular/core';

import {
  getBrandDetailsByBrandCode,
  getUpdateBrandUrl,
  getSaveBrandUrl,
  ApiService,
  getSubBrandListUrl,
  getSearchSubbrandBySubbrandCode
} from '@poss-web/shared/util-api-service';
import { SubBrandMasterAdaptors } from '@poss-web/shared/util-adaptors';
import { BrandMaster } from '@poss-web/shared/models';

import { map } from 'rxjs/operators';

@Injectable()
export class SubbrandService {
  constructor(private apiservice: ApiService) { }
  getSubBrandMasterList(pageIndex, pageSize, parentBrandCode) {
    const url = getSubBrandListUrl(pageIndex, pageSize, parentBrandCode);
    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => SubBrandMasterAdaptors.getSubBrandMasterList(data)));
  }

  saveSubBrandMasterDetails(brandDetails: BrandMaster) {
    const url = getSaveBrandUrl();
    return this.apiservice.post(url.path, brandDetails);
  }

  updateSubBrandMasterDetails(brandDetails: BrandMaster, brandCode: string) {
    const url = getUpdateBrandUrl(brandCode);
    return this.apiservice.patch(url.path, brandDetails);
  }

  updateIsActive(brandCode, isActive) {
    const url = getUpdateBrandUrl(brandCode);
    return this.apiservice.patch(url.path, {
      isActive: isActive,
      parentBrandCode: brandCode
    });
  }

  getSubBrandDetailsBySubBrandCode(brandCode: string) {
    const url = getBrandDetailsByBrandCode(brandCode);
    return this.apiservice
      .get(url.path)
      .pipe(
        map(data =>
          SubBrandMasterAdaptors.getAllSubBrandDetailsBySubBrandCode(data)
        )
      );
  }
  searchSubBrandByBrandCode(brandCode: string, parentBrandCode: string) {
    const url = getSearchSubbrandBySubbrandCode(brandCode, parentBrandCode);
    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data =>
          SubBrandMasterAdaptors.getSearchSubBrandByBrandCodeData(data)
        )
      );
  }
}
