import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getPaymentHostnameUrl,
  getFileUploadCommonUrl
} from '@poss-web/shared/util-api-service';

import { RazorpayAccessMappingAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RazorpayConfigurationList,
  ConfigListingPayload,
  SortItem,
  FileGroupEnum,
  VendorCodeEnum
} from '@poss-web/shared/models';

@Injectable()
export class RazorpayConfigurationService {
  constructor(private apiService: ApiService) {}
  FileUpload(reqFile: FormData): Observable<any> {
    const UploadUrl = getFileUploadCommonUrl(
      FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
    );
    return this.apiService
      .postFile(UploadUrl.path, reqFile, UploadUrl.params)
      .pipe(
        map((data: any) =>
          RazorpayAccessMappingAdaptor.razorpayUploadFileResponse(data)
        )
      );
  }

  accessList(
    payload: ConfigListingPayload,
    sortField: SortItem,
    locationCode?: string
  ): Observable<RazorpayConfigurationList> {
    const url = getPaymentHostnameUrl(
      payload.pageIndex,
      payload.pageSize,
      VendorCodeEnum.RAZORPAY,
      sortField,
      locationCode
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          RazorpayAccessMappingAdaptor.razorpayAccessList(data)
        )
      );
  }
}
