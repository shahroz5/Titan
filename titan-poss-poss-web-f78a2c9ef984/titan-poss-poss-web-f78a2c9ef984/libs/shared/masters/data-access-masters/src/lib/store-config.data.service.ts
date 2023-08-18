import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getMasterStoreBinsUrl } from '@poss-web/shared/util-api-service';
import { StoreBin } from '@poss-web/shared/models';
import { StoreConfigHelper } from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
@Injectable({
  providedIn: 'root'
})
export class StoreConfigDataService {
  constructor(private apiService: CacheableApiService) {}

  getStoreBins(binType: string): Observable<StoreBin[]> {
    const url = getMasterStoreBinsUrl(binType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StoreConfigHelper.getbins(data.results)));
  }
}
