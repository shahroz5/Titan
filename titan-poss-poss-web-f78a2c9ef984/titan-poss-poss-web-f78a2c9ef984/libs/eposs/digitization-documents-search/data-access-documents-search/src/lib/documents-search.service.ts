import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  documentsSearchEndPointUrl,
  getDownloadDocFromEpossUrl
} from '@poss-web/shared/util-api-service';
import {
  InvoiceListPayload,
  InvoiceListResponse,
  responseTypeEnum
} from '@poss-web/shared/models';

@Injectable()
export class DocumentsSearchService {
  constructor(private apiService: ApiService) {}

  getInvoiceList(
    requestPayload: InvoiceListPayload,
    txnType?: string,
    page?: number,
    size?: number
  ): Observable<InvoiceListResponse> {
    const urlObj = documentsSearchEndPointUrl(txnType, page, size);
    return this.apiService
      .post(urlObj.path, requestPayload, urlObj.params)
      .pipe(map((data: InvoiceListResponse) => data));
  }

  getDocumentDownloadResponse(fileData) {
    const downLoadUrl = getDownloadDocFromEpossUrl(
      fileData.id,
      fileData.locationCode
    );
    this.apiService.ResponseContentType = responseTypeEnum.BLOB;
    return this.apiService.get(downLoadUrl.path, downLoadUrl.params).pipe(
      map((data: any) => {
        this.downloadPdfFile(data, fileData.name);
        return true;
      })
    );
  }

  downloadPdfFile(data: any, filename: string) {
    const blob: Blob = new Blob([data], { type: 'application/pdf' });
    const fileName: string = filename;

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    // a.target = '_blank';

    a.download = fileName;

    // a.title = fileName;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
