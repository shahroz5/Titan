import { Injectable } from '@angular/core';

import {
  ApiService,
  getVendorMasterUrl,
  getVendorMasterByCodeUrl,
  getSearchVendorMasterUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { VendorMasterAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class VendorMasterService {
  constructor(private apiService: ApiService) {}
  getVendorMasterList(pageIndex, pageSize) {
    const url = getVendorMasterUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.param)
      .pipe(map(data => VendorMasterAdaptor.getVendorMasterList(data)));
  }

  getSearchVendorMasterList(vendorCode) {
    const url = getSearchVendorMasterUrl(vendorCode);
    return this.apiService
      .get(url)
      .pipe(map(data => VendorMasterAdaptor.getSearchedVendorMasterList(data)));
  }

  getVendorMasterByCode(id) {
    const url = getVendorMasterByCodeUrl(id);
    return this.apiService
      .get(url)
      .pipe(map(data => VendorMasterAdaptor.getVendorMasterByCodeData(data)));
  }
}
