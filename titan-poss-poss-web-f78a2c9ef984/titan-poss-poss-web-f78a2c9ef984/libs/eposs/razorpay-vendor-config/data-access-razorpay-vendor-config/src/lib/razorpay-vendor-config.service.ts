import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getFileUploadCommonUrl,
  getVendorListUrl
} from '@poss-web/shared/util-api-service';

import {
  RazorpayAccessMappingAdaptor,
  RazorpayVendorConfigurationAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  SortItem,
  FileGroupEnum,
  VendorCodeEnum,
  ListPayload,
  RazorpayVendorSuccessList
} from '@poss-web/shared/models';

@Injectable()
export class RazorpayVendorConfigurationService {
  constructor(private apiService: ApiService) {}
  FileUpload(reqFile: FormData): Observable<any> {
    const UploadUrl = getFileUploadCommonUrl(FileGroupEnum.RAZORPAY_CONFIG);
    return this.apiService
      .postFile(UploadUrl.path, reqFile, UploadUrl.params)
      .pipe(
        map((data: any) =>
          RazorpayAccessMappingAdaptor.razorpayUploadFileResponse(data)
        )
      );
  }

  vendorList(
    payload: ListPayload,
    sortField: SortItem,
    locationCode?: string
  ): Observable<RazorpayVendorSuccessList> {
    const url = getVendorListUrl(
      payload.pageIndex,
      payload.pageSize,
      VendorCodeEnum.PAYMENT_RAZORPAY,
      sortField,
      locationCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          RazorpayVendorConfigurationAdaptor.getVendorList(data)
        )
      );
  }
}
