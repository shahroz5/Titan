import { Observable, of } from 'rxjs';
import { CachingEnum } from '@poss-web/shared/models';
import { CachingStrategySetting } from '@poss-web/shared/models';
import { switchMap } from 'rxjs/operators';
import { CacheableApiService } from '../cacheable-api.service';
import { HttpParams } from '@angular/common/http';

export class CacheInvalidateStrategyByAge {
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
    return this.cacheableApiService.getDataFromCache(hashKey).pipe(
      switchMap(response => {
        if (response !== undefined && response !== null) {
          if (this.configObject.category === 'key') {
            const keyExpired = this.checkIfKeyExpired(
              this.configObject,
              response
            );

            if (keyExpired) {
              this.cacheableApiService.deleteCachedKey(hashKey);
              return this.cacheableApiService.getDataFromApi(
                url,
                params,
                hashKey,
                apiType,
                body
              );
            } else {
              this.cacheableApiService.updateCacheRequestCount(
                CachingEnum.TOTAL_COUNT
              );
              this.cacheableApiService.updateCacheRequestCount(
                CachingEnum.SESSION_COUNT
              );
              // .then(() => {
              //   this.cacheableApiService.updateCacheRequestCount(
              //     'totalCount'
              //   );
              // });
              return of(response.apiData);
            }
          }
        } else {
          return this.cacheableApiService.getDataFromApi(
            url,
            params,
            hashKey,
            apiType,
            body
          );
        }
      })
    );
  }

  checkIfKeyExpired(
    configObj: CachingStrategySetting,
    cachedResponse
  ): boolean {
    let keyExpired: boolean;
    let cacheAgeInSeconds: number;
    const currentTime: string = this.getCurrentTime();
    const cacheExpirySetting: string = configObj.options.age;
    const startTimeInSeconds: number = this.getTimeinSeconds(
      cachedResponse.currentTime
    );
    const currentTimeInSeconds: number = this.getTimeinSeconds(currentTime);
    const configuredAgeInSeconds: number = this.getTimeinSeconds(
      cacheExpirySetting
    );

    cacheAgeInSeconds = currentTimeInSeconds - startTimeInSeconds;

    if (cacheAgeInSeconds > configuredAgeInSeconds) {
      keyExpired = true;
    } else {
      keyExpired = false;
    }
    return keyExpired;
  }

  getCurrentTime(): string {
    const today = new Date();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return time;
  }

  getTimeinSeconds(time: string): number {
    const timeArray = time.split(':');
    const hourToSeconds: number = this.getSecondsForHours(timeArray[0]);
    const minToSeconds: number = this.getSecondsForMinutes(timeArray[1]);
    const seconds: number = Number(timeArray[2]);
    const timeInSeconds = hourToSeconds + minToSeconds + seconds;
    return timeInSeconds;
  }

  getSecondsForHours(hours: string): number {
    const seconds = Number(hours) * 60 * 60;
    return seconds;
  }
  getSecondsForMinutes(minutes: string): number {
    const seconds = Number(minutes) * 60;
    return seconds;
  }
}
