import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';

import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import { BinDataService } from './bin.data.service';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}

const getMasterInventoryBaseUrl = (): string => {
  return `http://localhost:3000/inventory/v2`;
};
const getMasterBinsUrl = (binGroupCode): string => {
  return getMasterInventoryBaseUrl() + `/lite-data/${binGroupCode}/bins`;
};
export const getMasterBinByCodeUrl = (binCode): string => {
  return getMasterInventoryBaseUrl() + `/bins/${binCode}`;
};
describe('Testing Bin Data Service Functionality', () => {
  let service: BinDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let testBinData: any;
  let binData: any;
  beforeAll(() => {
    testBinData = {
      results: [
        {
          binCode: 'Testing',
          description: 'testing'
        },
        {
          binCode: 'ZEROBIN',
          description: 'ZERO Bin'
        },
        {
          binCode: 'EAR RING',
          description: 'EAR RING Bin'
        },
        {
          binCode: 'FINGER RING',
          description: 'FINGER RING Bin'
        },
        {
          binCode: 'CHAIN',
          description: 'CHAIN Bin'
        },
        {
          binCode: 'BRACELET',
          description: 'BRACELET Bin'
        },
        {
          binCode: 'PENDANT',
          description: 'PENDANT Bin'
        },
        {
          binCode: 'BANGLE',
          description: 'BANGLE Bin'
        },
        {
          binCode: 'BEST DEAL',
          description: 'BEST DEAL Bin'
        },
        {
          binCode: 'RUBY',
          description: 'Bin creation testing'
        },
        {
          binCode: 'KANGANI',
          description: 'Bin creation testing'
        },
        {
          binCode: 'abc',
          description: 'qwert'
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 1,
      totalElements: 12
    };
    binData = {
      binCode: 'ZEROBIN',
      binGroups: [
        {
          binGroupCode: 'PURCFA',
          isActive: true
        },
        {
          binGroupCode: 'STN',
          isActive: true
        }
      ],
      description: 'ZERO Bin'
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

    service = new BinDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 12 Bins', () => {
    const binGroupCode = 'STN';
    spyOn(cacheableApiService, 'get').and.returnValue(of(testBinData));

    service.getBinDetails(binGroupCode).subscribe(x => {
      expect(x.length).toEqual(12);
    });
  });
  // it('should get all Bin', () => {
  //   // arrange
  //   const binGroupCode = 'STN';

  //   spyOn(cacheableApiService, 'get').and.returnValue(of(testBinData));

  //   service.getBinDetails(binGroupCode).subscribe(x => {
  //     expect(x).toEqual(testBinData.result);
  //   });
  // });

  it('should get total count of Bins', () => {
    const binGroupCode = 'STN';

    spyOn(cacheableApiService, 'get').and.returnValue(of(testBinData));

    service.getBinCount(binGroupCode).subscribe(x => {
      expect(x).toEqual(testBinData.totalElements);
    });
  });

  it('should get bin by binCode', () => {
    const binCode = 'ZEROBIN';

    spyOn(cacheableApiService, 'get').and.returnValue(of(binData));

    service.getBinByCode(binCode).subscribe(x => {
      expect(x).toEqual(binData);
    });
    const url = getMasterBinByCodeUrl(binCode);
  });
});
