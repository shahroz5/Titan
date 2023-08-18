import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getFIRFileUploadUrl,
  getMERFileUploadUrl,
  getInvoiceJobTriggerUrl,
  getSTNJobTriggerUrl
} from '@poss-web/shared/util-api-service';
import { FileUploadAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class DataUploadService {
  constructor(private apiService: ApiService) {}
  FIRFileUpload(file: FormData): Observable<any> {
    const FIRFileUploadUrl = getFIRFileUploadUrl();
    return this.apiService
      .postFile(FIRFileUploadUrl, file)
      .pipe(map((data: any) =>  FileUploadAdaptor.getFileUploadResponse(data)));
  }

  MERFileUpload(file: FormData): Observable<any> {
    const MERFileUploadUrl = getMERFileUploadUrl();
    return this.apiService
      .postFile(MERFileUploadUrl, file)
      .pipe(map((data: any) => FileUploadAdaptor.getFileUploadResponse(data)));
  }

  InvoiceUpload() {
    const InvoiceUploadUrl = getInvoiceJobTriggerUrl();
    return this.apiService
      .postFile(InvoiceUploadUrl)
      .pipe(map((data: any) => data));
  }

  STNUpload() {
    const STNUploadUrl = getSTNJobTriggerUrl();
    return this.apiService
      .postFile(STNUploadUrl)
      .pipe(map((data: any) => data));
  }
}
