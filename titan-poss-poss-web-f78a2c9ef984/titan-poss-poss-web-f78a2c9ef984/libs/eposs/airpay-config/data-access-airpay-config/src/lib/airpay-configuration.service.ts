import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getVendorListUrl
} from '@poss-web/shared/util-api-service';
import {
  SortItem,
  ListPayload,
  AirpayVendorSuccessList,
  VendorCodeEnum
} from '@poss-web/shared/models';
import { AirpayConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AirpayConfigurationService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  vendorList(
    payload: ListPayload,
    sortField: SortItem,
    locationCode?: string
  ): Observable<AirpayVendorSuccessList> {
    const url = getVendorListUrl(
      payload.pageIndex,
      payload.pageSize,
      VendorCodeEnum.AIRPAY,
      sortField,
      locationCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => AirpayConfigurationAdaptor.getVendorList(data)));
  }
}
