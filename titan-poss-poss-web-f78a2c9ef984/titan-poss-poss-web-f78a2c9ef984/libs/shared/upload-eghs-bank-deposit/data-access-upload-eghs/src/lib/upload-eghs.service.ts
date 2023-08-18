import { Injectable } from '@angular/core';
import { PayerBankAdaptor } from '@poss-web/shared/util-adaptors';

import {
  ApiService,
  getUploadEghsFileUploadUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
@Injectable()
export class UploadeGHSService {
  constructor(private apiService: ApiService) {}
  uploadeGHSFile(formData: FormData) {
    const url = getUploadEghsFileUploadUrl();
    return this.apiService
      .postFile(url, formData)
      .pipe(map((data: any) => PayerBankAdaptor.getFileResponse(data)));
    return null;
  }
}
