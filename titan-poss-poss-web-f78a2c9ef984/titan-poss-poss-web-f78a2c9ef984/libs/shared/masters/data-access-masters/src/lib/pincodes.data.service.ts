import { Injectable } from '@angular/core';
import {
  getMasterPinCodesSummaryUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { Pincode } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { PincodeDataAdaptor } from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class PinCodeDataService {
  constructor(private apiService: CacheableApiService) {}

  getPincodesSummary(
    countryCode: string,
    pincode: string,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<Pincode[]> {
    const url = getMasterPinCodesSummaryUrl(
      countryCode,
      pincode,
      pageIndex,
      pageSize,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => PincodeDataAdaptor.pincodeDataSummaryFromJson(data))
      );
  }
}
