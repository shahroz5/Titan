import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';

import { CachingStrategySetting } from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import * as moment from 'moment';

import { StoreConfigDataService } from './store-config.data.service';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}

const getMasterInventoryBaseUrl = (): string => {
  return `http://localhost:3000/inventory/v2`;
};

describe('Testing Store Config Master Data Service Functionality', () => {
  let service: StoreConfigDataService;
  let cacheableApiService: CacheableApiService;
  const http: HttpClient = null;
  let binData: any;
  beforeAll(() => {
    binData = {
      results: [
        {
          binCode: 'abc',
          binGroupCode: 'STN'
        },
        {
          binCode: 'BANGLE',
          binGroupCode: 'STN'
        },
        {
          binCode: 'BEST DEAL',
          binGroupCode: 'STN'
        },
        {
          binCode: 'BRACELET',
          binGroupCode: 'STN'
        },
        {
          binCode: 'CHAIN',
          binGroupCode: 'STN'
        },
        {
          binCode: 'DEFECTIVE',
          binGroupCode: 'DEFECTIVE'
        },
        {
          binCode: 'EAR RING',
          binGroupCode: 'STN'
        },
        {
          binCode: 'EXHIBITION',
          binGroupCode: 'EXHIBITION'
        },
        {
          binCode: 'FINGER RING',
          binGroupCode: 'STN'
        },
        {
          binCode: 'LOAN',
          binGroupCode: 'LOAN'
        },
        {
          binCode: 'LOSS',
          binGroupCode: 'LOSS'
        },
        {
          binCode: 'PENDANT',
          binGroupCode: 'STN'
        },
        {
          binCode: 'RUBY',
          binGroupCode: 'STN'
        },
        {
          binCode: 'TEPSALE',
          binGroupCode: 'TEPSALE'
        },
        {
          binCode: 'Testing',
          binGroupCode: 'STN'
        },
        {
          binCode: 'ZEROBIN',
          binGroupCode: 'STN'
        }
      ]
    };
  });
  beforeEach(() => {
    const indexedDBStorage = new DexieService();
    const cachingStrategySettings: CachingStrategySetting[] = [
      {
        type: 3,
        name: 'InvalidatedBySize',
        category: 'cache',
        size: 1,
        unit: 'MB'
      }
    ];
    cacheableApiService = new CacheableApiService(
      new HashkeyGeneratorService('test'),
      new StorageFacade(indexedDBStorage),
      new ApiService(http, 'test'),
      cachingStrategySettings
    );

    service = new StoreConfigDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the list of Bins', () => {
    const binType = 'RECEIVE_BIN';

    spyOn(cacheableApiService, 'get').and.returnValue(of(binData));

    service.getStoreBins(binType).subscribe(x => {
      expect(x).toEqual(binData.results);
    });
  });
});
