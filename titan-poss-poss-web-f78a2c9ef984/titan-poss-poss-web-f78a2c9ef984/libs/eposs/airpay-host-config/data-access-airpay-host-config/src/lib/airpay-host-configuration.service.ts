import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getPaymentHostnameUrl
} from '@poss-web/shared/util-api-service';
import {
  AirpayHostSuccessList,
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';
import { AirpayHostConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class AirpayHostConfigurationService {
  constructor(private apiService: ApiService) {}
  // FileUpload(reqFile: FormData): Observable<any> {
  //   const UploadUrl = getFileUploadCommonUrl(
  //     FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
  //   );
  //   // const UploadUrl = getPaymentHostsUploadUrl();
  //   return this.apiService
  //     .postFile(UploadUrl.path, reqFile, UploadUrl.params)
  //     .pipe(
  //       map((data: any) =>
  //         AirpayHostConfigurationAdaptor.getFileUploadResponse(data)
  //       )
  //     );
  // }

  hostnameList(
    payload: ListingPayload,
    sortField: SortItem,
    locationCode?: string
  ): Observable<AirpayHostSuccessList> {
    const url = getPaymentHostnameUrl(
      payload.pageIndex,
      payload.pageSize,
      'AIRPAY',
      sortField,
      locationCode
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          AirpayHostConfigurationAdaptor.airpayHostNameList(data)
        )
      );
  }
}
