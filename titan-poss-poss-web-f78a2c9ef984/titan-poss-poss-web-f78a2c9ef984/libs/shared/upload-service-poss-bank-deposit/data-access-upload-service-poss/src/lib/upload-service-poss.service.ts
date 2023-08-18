import { Injectable } from '@angular/core';
import { PayerBankAdaptor } from '@poss-web/shared/util-adaptors';

import {
  ApiService,
  getUploadServicePossFileUploadUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
@Injectable()
export class UploadServicePossService {
  constructor(private apiService: ApiService) {}
  uploadServicePossFile(formData: FormData) {
    const url = getUploadServicePossFileUploadUrl();
    return this.apiService
      .postFile(url, formData)
      .pipe(map((data: any) => PayerBankAdaptor.getFileResponse(data)));
    return null;
  }
}