import { Injectable } from '@angular/core';
import {
  ApiService,
  getSearchCnDirectUrl,
  getUploadCnDirectUrl,
  getSaveCnActionDirectUrl
} from '@poss-web/shared/util-api-service';
import {
  SearchPayloadReq,
  UploadCNPayloadReq,
  SaveCnActionPayload
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { CnDirectAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class CnDirectService {
  constructor(private apiService: ApiService) {}

  searchCn(searchPayloadReq: SearchPayloadReq) {
    const url = getSearchCnDirectUrl(
      searchPayloadReq.cnNumber,
      searchPayloadReq.fiscalYear,
      searchPayloadReq.locationCode,
      searchPayloadReq.pageEvent.page,
      searchPayloadReq.pageEvent.size
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CnDirectAdaptor.getCnList(data)));
  }

  saveCnAction(saveCnActionPayload: SaveCnActionPayload) {
    const url = getSaveCnActionDirectUrl(
      saveCnActionPayload.cnIds,
      saveCnActionPayload.operation
    );
    return this.apiService.post(url.path, {}, url.params);
  }
  uploadCnSearch(uploadCNPayloadReq: UploadCNPayloadReq) {
    const url = getUploadCnDirectUrl(
      uploadCNPayloadReq.pageEvent.page,
      uploadCNPayloadReq.pageEvent.size
    );
    return this.apiService
      .postFile(url.path, uploadCNPayloadReq.file, url.params)
      .pipe(map(data => CnDirectAdaptor.getCnList(data)));
  }
}
