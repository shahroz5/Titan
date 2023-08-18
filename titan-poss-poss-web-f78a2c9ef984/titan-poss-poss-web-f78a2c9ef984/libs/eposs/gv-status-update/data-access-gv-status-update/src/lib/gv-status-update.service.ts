import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getGVStatusUpdateUrl,
  getGVExtendValidityUrl,
  getGVStatusChangeUrl,
  getFileUploadCommonUrl
} from '@poss-web/shared/util-api-service';

import { GVStatusUpdateAdaptor } from '@poss-web/shared/util-adaptors';
import {
  SortItem,
  GVStatusUpdateList,
  UploadResponse,
  GVStatusListingPayload,
  GVExtendValidity,
  GVStatusChange
} from '@poss-web/shared/models';
@Injectable({
  providedIn: 'root'
})
export class GvStatusUpdateService {
  constructor(private apiService: ApiService) { }
  FileUpload(reqFile: FormData, uploadType: string): Observable<UploadResponse> {
    const UploadUrl = getFileUploadCommonUrl(uploadType);
    return this.apiService
      .postFile(UploadUrl.path, reqFile, UploadUrl.params)
      .pipe(
        map((data: any) =>
          GVStatusUpdateAdaptor.gvStatusUploadFileResponse(data)
        )
      );
  }

  gvStatusList(
    payload: GVStatusListingPayload,
    sortField: SortItem
  ): Observable<GVStatusUpdateList> {
    const url = getGVStatusUpdateUrl(payload, sortField);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => GVStatusUpdateAdaptor.gvStatusUpdateList(data)));
  }

  extendValidity(payload: GVExtendValidity): Observable<any> {
    const url = getGVExtendValidityUrl(payload);
    return this.apiService
      .patch(url.path, url.body)
      .pipe(map((data: any) => GVStatusUpdateAdaptor.gvStatusUpdateList(data)));
  }
  changeStatus(payload: GVStatusChange): Observable<any> {
    const url = getGVStatusChangeUrl(payload);
    return this.apiService
      .put(url.path, url.body)
      .pipe(map((data: any) => GVStatusUpdateAdaptor.gvStatusUpdateList(data)));
  }

}
