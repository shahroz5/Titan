import { Injectable } from '@angular/core';
import {
  ApiService,
  getCnMasterDetailByCnTypeUrl,
  getCnMasterListUrl,
  getSearchCnMasterByCnTypeUrl
} from '@poss-web/shared/util-api-service';
import { CnMasterDetails } from '@poss-web/shared/models';
import { CnMasterAdaptor } from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';

@Injectable()
export class CnMasterService {
  constructor(private apiService: ApiService) {}

  getCnMasterList(pageIndex: number, pageSize: number) {
    const url = getCnMasterListUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CnMasterAdaptor.getCnMasterList(data)));
  }

  searchCnMasterByCnType(configName: string) {
    const url = getSearchCnMasterByCnTypeUrl(configName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CnMasterAdaptor.getCnMasterList(data)));
  }

  getCnMasterDetailByCnType(cnType: string) {
    const url = getCnMasterDetailByCnTypeUrl(cnType);
    return this.apiService
      .get(url)
      .pipe(map(data => CnMasterAdaptor.getCnMasterDetail(data)));
  }

  updateCnMasterDetail(cnType: string, cnMasterDetails: CnMasterDetails) {
    const url = getCnMasterDetailByCnTypeUrl(cnType);
    return this.apiService
      .patch(url, cnMasterDetails)
      .pipe(map(data => CnMasterAdaptor.getCnMasterDetail(data)));
  }
}
