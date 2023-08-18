import { Injectable } from '@angular/core';
import { BrandMasterAdaptors } from '@poss-web/shared/util-adaptors';
import {
  BrandEnum,
  BrandMasterDetails
} from '@poss-web/shared/models';
import {
  getBrandListUrl,
  ApiService,
  getSaveBrandUrl,
  getUpdateBrandUrl,
  getBrandDetailsByBrandCode,
  getSearchBrandByBrandCode,
  getCurrencyUrl
} from '@poss-web/shared/util-api-service';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable()
export class BrandMasterService {
  constructor(private apiservice: ApiService) { }

  getBrandMasterList(pageIndex: number, pageSize: number) {
    const url = getBrandListUrl(pageIndex, pageSize);

    return this.apiservice
      .get(url.path, url.params)
      .pipe(map(data => BrandMasterAdaptors.getBrandMasterList(data)));
  }

  getBrandDetailsByBrandCode(
    brandCode: string
  ): Observable<BrandMasterDetails> {
    if (brandCode === BrandEnum.NEW) {
      return of(BrandMasterAdaptors.getAllBrandDetailsByBrandCode(null));
    }
    const url = getBrandDetailsByBrandCode(brandCode);
    return this.apiservice
      .get(url.path)
      .pipe(
        map(data => BrandMasterAdaptors.getAllBrandDetailsByBrandCode(data))
      );
  }

  saveBrandMasterDetails(brandDetails: BrandMasterDetails) {
    const url = getSaveBrandUrl();
    return this.apiservice.post(url.path, brandDetails).pipe(
      map(data => BrandMasterAdaptors.getAllBrandDetailsByBrandCode(data))
    );
  }

  updateBrandMasterDetails(brandDetails: BrandMasterDetails) {
    const url = getUpdateBrandUrl(brandDetails.brandCode);
    return this.apiservice.patch(url.path, brandDetails).pipe(
      map(data => BrandMasterAdaptors.getAllBrandDetailsByBrandCode(data))
    );
  }

  // below not req
  updateIsActive(brandCode, isActive) {
    const url = getUpdateBrandUrl(brandCode);

    return this.apiservice.patch(url.path, { isActive: isActive });
  }

  getNewBrandDetails() {
    const data = BrandMasterAdaptors.getAllBrandDetailsByBrandCode(false);
    return data;
  }

  searchBrandByBrandCode(brandCode: string) {
    const url = getSearchBrandByBrandCode(brandCode);
    return this.apiservice
      .get(url.path)
      .pipe(
        map(data => BrandMasterAdaptors.getsearchBrandByBrandCodeData(data))
      );
  }

  getSupportedCurrencyCode() {
    const url = getCurrencyUrl();
    return this.apiservice
      .get(url.path, url.params)
      .pipe(
        map(data => BrandMasterAdaptors.getCurrencyData(data))
      );

  }
}
