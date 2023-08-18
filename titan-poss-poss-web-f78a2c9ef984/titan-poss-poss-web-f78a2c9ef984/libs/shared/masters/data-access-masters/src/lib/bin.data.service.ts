import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getMasterBinByCodeUrl,
  getMasterBinDetailsUrl
} from '@poss-web/shared/util-api-service';
import { BinDataAdaptor } from '@poss-web/shared/util-adaptors';
import { BinCode,Bin } from '@poss-web/shared/models';
import { BinCodeHelper } from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class BinDataService {
  constructor(private apiService: CacheableApiService) {}

  getBinByCode(binCode: string): Observable<Bin> {
    const url = getMasterBinByCodeUrl(binCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => BinDataAdaptor.binFromJson(data)));
  }

  getBinDetails(
    binGroupCode: string,
    isPageable?: boolean,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[]
  ): Observable<BinCode[]> {
    const url = getMasterBinDetailsUrl(
      binGroupCode,
      isPageable,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => BinCodeHelper.getBinCodes(data.results)));
  }
  getBinCount(binGroupCode: string, isPageable?: boolean): Observable<number> {
    const url = getMasterBinDetailsUrl(binGroupCode, isPageable);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }
}
