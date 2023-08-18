import { Observable } from 'rxjs';
import { CacheableApiService } from '../cacheable-api.service';
import { HttpParams } from '@angular/common/http';
import { CachingStrategySetting } from '@poss-web/shared/models';
export class CacheInvalidateStrategyNow {
  configObject: CachingStrategySetting;

  constructor(
    private cacheableApiService: CacheableApiService,
    configObj: CachingStrategySetting
  ) {
    this.configObject = configObj;
  }

  getData(
    url: string,
    params: HttpParams,
    hashKey: string,
    apiType: string,
    body: Object = {}
  ): Observable<any> {
    if (this.configObject.category === 'cache') {
      this.cacheableApiService.clearCache();
      return this.cacheableApiService.getDataFromApi(
        url,
        params,
        hashKey,
        apiType,
        body
      );
    }
  }
}
