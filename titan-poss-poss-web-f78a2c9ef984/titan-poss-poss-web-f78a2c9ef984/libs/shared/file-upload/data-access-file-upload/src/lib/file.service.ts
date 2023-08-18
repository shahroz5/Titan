import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  deleteDocumentUrl,
  getDocumentsUrl,
  getDocumentsUrlByIdUrl,
  getDownloadDocUrl,
  getErrorLogUrl,
  getFileStatusUrl,
  getFileUploadCommonUrl,
  getUploadEghsFileUploadUrl,
  getUploadServicePossFileUploadUrl,
  uploadFormUrl
} from '@poss-web/shared/util-api-service';
import {
  DocumentUploadPayload,
  LoadFileStatusListPayload,
  LoadFileStatusListSuccessPayload,
  responseTypeEnum,
  DocumentListPayload,
  DocumentListResponse
} from '@poss-web/shared/models';
import {
  FileUploadAdaptor,
  PayerBankAdaptor
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class FileService {
  constructor(private apiService: ApiService) {}
  getFileStatusList(
    loadStoneTypeListingPayload: LoadFileStatusListPayload
  ): Observable<LoadFileStatusListSuccessPayload> {
    const url = getFileStatusUrl(
      loadStoneTypeListingPayload.pageIndex,
      loadStoneTypeListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FileUploadAdaptor.getFileStatusList(data)));
  }

  FileUpload(
    reqFile: FormData,
    fileGroup: string,
    param?: string,
    appType?: string,
    isServicePoss: boolean = false,
  ): Observable<any> {
    if (appType && appType === 'POSS' && !isServicePoss) {
      const url = getUploadEghsFileUploadUrl();
      return this.apiService
        .postFile(url, reqFile)
        .pipe(map((data: any) => PayerBankAdaptor.getFileResponse(data)));
    } if (appType && appType === 'POSS' && isServicePoss) {
      const url = getUploadServicePossFileUploadUrl();
      return this.apiService
        .postFile(url, reqFile)
        .pipe(map((data: any) => PayerBankAdaptor.getFileResponse(data)));
    } else {
      const UploadUrl = getFileUploadCommonUrl(fileGroup, param);
      // const UploadUrl = getPaymentHostsUploadUrl();
      return this.apiService
        .postFile(UploadUrl.path, reqFile, UploadUrl.params)
        .pipe(
          map((data: any) => FileUploadAdaptor.getFileUploadResponse(data))
        );
    }
  }
  upload(data: DocumentUploadPayload): Observable<any> {
    const url = uploadFormUrl(
      data.customerId,
      data.fileType,
      data.docType,
      data.id
    );

    return this.apiService
      .postImage(url.path, data.file, 'text', url.params)
      .pipe(map((data: any) => data));
  }
  getDocuments(
    payload: DocumentListPayload
  ): Observable<DocumentListResponse[]> {
    const url = getDocumentsUrl(
      payload.customerId,
      payload.docType,
      payload.fileType,
      payload.id,
      payload.locationCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FileUploadAdaptor.getDocumets(data)));
  }
  getDocumentUrlById(fileId: string, locationCode?: string): Observable<any> {
    const url = getDocumentsUrlByIdUrl(fileId, locationCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.url));
  }
  deleteDocument(fileId: string): Observable<any> {
    const api = deleteDocumentUrl(fileId);
    return this.apiService.delete(api.path, api.params);
  }
  getErrorResponse(fileId: string, fileGroup: string) {
    const downLoadUrl = getErrorLogUrl(fileId, fileGroup);
    this.apiService.ResponseContentType = responseTypeEnum.BLOB;
    return this.apiService.get(downLoadUrl.path, downLoadUrl.params).pipe(
      map((data: any) => {
        this.downloadFile(data, fileId);
        return true;
      })
    );
  }
  getPdfFileResponse(fileData){
    const downLoadUrl = getDownloadDocUrl(fileData.id, fileData.locationCode);
    this.apiService.ResponseContentType = responseTypeEnum.BLOB;
    return this.apiService.getBlobResponse(downLoadUrl.path, downLoadUrl.params).pipe(
      map((data: any) => {
        this.downloadPdfFile(data, fileData.name);
        return true;
      })
    );
  }

  downloadFile(data: any, filename) {
    const blob: Blob = new Blob([data], { type: 'text/csv' });
    const fileName: string = filename + '.csv';

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  downloadPdfFile(data: any, filename:string) {
    const blob: Blob = new Blob([data], { type: 'application/pdf' });
    const fileName: string = filename;

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.target = "_blank";
    a.title = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
