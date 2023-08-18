import { HttpClient } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';
import { LovDataService } from './lov.data.service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
const getMasterProductBaseUrl = (): string => {
  return `http://localhost:3000/product/v2`;
};
const getMasterInventoryBaseUrl = (): string => {
  return `http://localhost:3000/inventory/v2`;
};
const getMasterLocationBaseUrl = (): string => {
  return `http://localhost:3000/location/v2`;
};
const getMasterSalesBaseUrl = (): string => {
  return `http://localhost:3000/sales/v2`;
};
describe('Testing Lov Master Data Service Functionality', () => {
  let service: LovDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let inventoryLovs: any;
  let locationlovs: any;
  let salesLovs: any;
  let productlovs: any;
  beforeAll(() => {
    inventoryLovs = {
      lovType: 'DEFECTTYPE',
      results: [
        {
          code: 'MISMATCH105',
          value: 'MISMATCH105',
          isActive: true
        },
        {
          code: 'MISMATCH115',
          value: 'MISMATCH115',
          isActive: false
        },
        {
          code: 'YvNc8F',
          value: 'YvNc8F',
          isActive: true
        },
        {
          code: 'pRkHJn',
          value: 'pRkHJn',
          isActive: true
        },
        {
          code: '4JtcnP',
          value: '4JtcnP',
          isActive: true
        },
        {
          code: '5DrG4c',
          value: '5DrG4c',
          isActive: true
        },
        {
          code: 'Yz66Np',
          value: 'Yz66Np',
          isActive: true
        },
        {
          code: 'sbwhtk',
          value: 'sbwhtk',
          isActive: true
        },
        {
          code: 'uBMp3g',
          value: 'uBMp3g',
          isActive: false
        },
        {
          code: 'MISMATCH207',
          value: 'MISMATCH207',
          isActive: true
        },
        {
          code: 'MISMATCH203',
          value: 'MISMATCH203',
          isActive: true
        },
        {
          code: 'PRODUCTMISMATCH2',
          value: 'PRODUCTMISMATCH2',
          isActive: true
        },
        {
          code: 'WqNerQ',
          value: 'WqNerQ',
          isActive: false
        },
        {
          code: 'MISMATCH103',
          value: 'MISMATCH103',
          isActive: true
        },
        {
          code: 'PFXQAX',
          value: 'PFXQAX',
          isActive: true
        },
        {
          code: 'f1D3NA',
          value: 'f1D3NA',
          isActive: true
        },
        {
          code: 'c0BbbT',
          value: 'c0BbbT',
          isActive: false
        },
        {
          code: 'My9wWw',
          value: 'My9wWw',
          isActive: false
        },
        {
          code: 'fS1cXR',
          value: 'fS1cXR',
          isActive: true
        },
        {
          code: 'nZXX43',
          value: 'nZXX43',
          isActive: true
        },
        {
          code: 'zBFAex',
          value: 'zBFAex',
          isActive: true
        },
        {
          code: 'MISMATCH122',
          value: 'MISMATCH122',
          isActive: false
        },
        {
          code: 'uRE4bb',
          value: 'uRE4bb',
          isActive: false
        },
        {
          code: 'fvPbpM',
          value: 'fvPbpM',
          isActive: false
        },
        {
          code: 'GKEk86',
          value: 'GKEk86',
          isActive: false
        },
        {
          code: 'ipLn7z',
          value: 'ipLn7z',
          isActive: false
        },
        {
          code: 'AFWKqj',
          value: 'AFWKqj',
          isActive: true
        },
        {
          code: 'MISMATCH78',
          value: 'MISMATCH78',
          isActive: false
        },
        {
          code: 'MISMATCH786',
          value: 'MISMATCH786',
          isActive: true
        },
        {
          code: 'MISMATCH888',
          value: 'MISMATCH888',
          isActive: true
        },
        {
          code: '1vWqNf',
          value: '1vWqNf',
          isActive: true
        },
        {
          code: 'FNqTsK',
          value: 'FNqTsK',
          isActive: true
        },
        {
          code: 'tw4P83',
          value: 'tw4P83',
          isActive: true
        },
        {
          code: 'MISMATCH116',
          value: 'MISMATCH116',
          isActive: false
        },
        {
          code: 'JbDtPL',
          value: 'JbDtPL',
          isActive: true
        },
        {
          code: 'MISMATCHLOVTYPE',
          value: 'MISMATCHLOVTYPE',
          isActive: true
        },
        {
          code: 'oUKat7',
          value: 'oUKat7',
          isActive: true
        },
        {
          code: 'W4Nv98',
          value: 'W4Nv98',
          isActive: true
        },
        {
          code: 'oK4dDm',
          value: 'oK4dDm',
          isActive: false
        },
        {
          code: 'MISMATCH778',
          value: 'MISMATCH778',
          isActive: true
        },
        {
          code: '6twhpH',
          value: '6twhpH',
          isActive: false
        },
        {
          code: 'JhFJbc',
          value: 'JhFJbc',
          isActive: false
        },
        {
          code: 'YfX2Ju',
          value: 'YfX2Ju',
          isActive: true
        },
        {
          code: 'x7379e',
          value: 'x7379e',
          isActive: false
        },
        {
          code: 'MISMATCH111',
          value: 'MISMATCH111',
          isActive: false
        },
        {
          code: 'XeqBnw',
          value: 'XeqBnw',
          isActive: true
        },
        {
          code: 'MISMATCH119',
          value: 'MISMATCH119',
          isActive: false
        },
        {
          code: 'MISMATCH206',
          value: 'MISMATCH206',
          isActive: true
        },
        {
          code: 'MISMATCH890',
          value: 'MISMATCH890',
          isActive: true
        },
        {
          code: 'oAEePx',
          value: 'oAEePx',
          isActive: false
        },
        {
          code: '8m9qGb',
          value: '8m9qGb',
          isActive: false
        },
        {
          code: 'S5p95a',
          value: 'S5p95a',
          isActive: false
        },
        {
          code: 'sW315F',
          value: 'sW315F',
          isActive: true
        },
        {
          code: 'MISMATCH893',
          value: 'MISMATCH893',
          isActive: true
        },
        {
          code: 'MISMATCH107',
          value: 'MISMATCH107',
          isActive: true
        },
        {
          code: 'aJTrDP',
          value: 'aJTrDP',
          isActive: true
        },
        {
          code: 'MISMATCH108',
          value: 'MISMATCH108',
          isActive: true
        },
        {
          code: 'BneAJE',
          value: 'BneAJE',
          isActive: false
        },
        {
          code: 'SbgSAc',
          value: 'SbgSAc',
          isActive: false
        },
        {
          code: 'MISMATCH782',
          value: 'MISMATCH782',
          isActive: true
        },
        {
          code: 'DQrXpL',
          value: 'DQrXpL',
          isActive: false
        },
        {
          code: 'nu782e',
          value: 'nu782e',
          isActive: true
        },
        {
          code: 'CycVnz',
          value: 'CycVnz',
          isActive: false
        },
        {
          code: 'PRODUCTMISMATCH3',
          value: 'PRODUCTMISMATCH',
          isActive: true
        },
        {
          code: 'U5dM2a',
          value: 'U5dM2a',
          isActive: true
        },
        {
          code: 'MISMATCHLOV',
          value: 'MISMATCHLOV',
          isActive: true
        },
        {
          code: 'KS7Wpv',
          value: 'KS7Wpv',
          isActive: true
        },
        {
          code: 'QAp4Mp',
          value: 'QAp4Mp',
          isActive: false
        },
        {
          code: 'pqS80v',
          value: 'pqS80v',
          isActive: true
        },
        {
          code: 'BtFS5o',
          value: 'BtFS5o',
          isActive: true
        },
        {
          code: 'muC7t9',
          value: 'muC7t9',
          isActive: true
        },
        {
          code: '60GPgj',
          value: '60GPgj',
          isActive: true
        },
        {
          code: 'MISMATCH101',
          value: 'MISMATCH101',
          isActive: true
        },
        {
          code: 'MISMATCH201',
          value: 'MISMATCH201',
          isActive: true
        },
        {
          code: 'Y0LULo',
          value: 'Y0LULo',
          isActive: true
        },
        {
          code: 'U8JCA0',
          value: 'U8JCA0',
          isActive: true
        },
        {
          code: 'JcceUD',
          value: 'JcceUD',
          isActive: false
        },
        {
          code: '1yF7Ej',
          value: '1yF7Ej',
          isActive: true
        },
        {
          code: 'MISMATCH124',
          value: 'MISMATCH124',
          isActive: false
        },
        {
          code: 'kYP5xi',
          value: 'kYP5xi',
          isActive: false
        },
        {
          code: 'h9dMBv',
          value: 'h9dMBv',
          isActive: true
        },
        {
          code: 'DESIGNMISMATCH',
          value: 'DESIGNMISMATCH',
          isActive: true
        },
        {
          code: 'MISMATCH891',
          value: 'MISMATCH891',
          isActive: true
        },
        {
          code: 'h5kTAt',
          value: 'h5kTAt',
          isActive: false
        },
        {
          code: 'RGpPPu',
          value: 'RGpPPu',
          isActive: true
        },
        {
          code: 'MISMATCH118',
          value: 'MISMATCH118',
          isActive: false
        },
        {
          code: 'ERZ2hd',
          value: 'ERZ2hd',
          isActive: true
        },
        {
          code: 'KyUcq8',
          value: 'KyUcq8',
          isActive: false
        },
        {
          code: 'MISMATCH889',
          value: 'MISMATCH889',
          isActive: true
        },
        {
          code: 'zKmLbv',
          value: 'zKmLbv',
          isActive: true
        },
        {
          code: 'MISMATCH113',
          value: 'MISMATCH113',
          isActive: false
        },
        {
          code: 'UizW08',
          value: 'UizW08',
          isActive: true
        },
        {
          code: 'uqAA8s',
          value: 'uqAA8s',
          isActive: false
        },
        {
          code: 'JBC9sy',
          value: 'JBC9sy',
          isActive: false
        },
        {
          code: 'AsW0e1',
          value: 'AsW0e1',
          isActive: false
        },
        {
          code: 'jR1a2i',
          value: 'jR1a2i',
          isActive: false
        },
        {
          code: 'MISMATCH11',
          value: 'MISMATCH11',
          isActive: false
        },
        {
          code: 'vG8K7w',
          value: 'vG8K7w',
          isActive: true
        },
        {
          code: 'MISMATCH781',
          value: 'MISMATCH781',
          isActive: true
        },
        {
          code: 'MISMATCH106',
          value: 'MISMATCH106',
          isActive: true
        },
        {
          code: '0Xgb0c',
          value: '0Xgb0c',
          isActive: false
        },
        {
          code: 'puqJoH',
          value: 'puqJoH',
          isActive: false
        },
        {
          code: 'JEqqZk',
          value: 'JEqqZk',
          isActive: false
        },
        {
          code: '9jceDq',
          value: '9jceDq',
          isActive: false
        },
        {
          code: 'gFhT9S',
          value: 'gFhT9S',
          isActive: false
        },
        {
          code: 'TESTMISMATCH1',
          value: 'TESTMISMATCH1',
          isActive: false
        },
        {
          code: 'cNmPJZ',
          value: 'cNmPJZ',
          isActive: true
        },
        {
          code: 'TESTMISMATCH',
          value: 'TESTMISMATCH',
          isActive: false
        },
        {
          code: 'MISMATCH104',
          value: 'MISMATCH104',
          isActive: true
        },
        {
          code: 'AuQ14d',
          value: 'AuQ14d',
          isActive: false
        },
        {
          code: 'Hg6eAt',
          value: 'Hg6eAt',
          isActive: false
        },
        {
          code: 'G25J7n',
          value: 'G25J7n',
          isActive: true
        },
        {
          code: 'MISMATCH208',
          value: 'MISMATCH208',
          isActive: true
        },
        {
          code: 'MISMATCH112',
          value: 'MISMATCH112',
          isActive: false
        },
        {
          code: 'kY1cMd',
          value: 'kY1cMd',
          isActive: false
        },
        {
          code: 'sFHWA9',
          value: 'sFHWA9',
          isActive: true
        },
        {
          code: 'HhuY3y',
          value: 'HhuY3y',
          isActive: false
        },
        {
          code: 'xH6kWZ',
          value: 'xH6kWZ',
          isActive: true
        },
        {
          code: 'MISMATCH117',
          value: 'MISMATCH117',
          isActive: false
        },
        {
          code: 'CspJ4w',
          value: 'CspJ4w',
          isActive: false
        },
        {
          code: 'tVGnYj',
          value: 'tVGnYj',
          isActive: false
        },
        {
          code: 'jMBATu',
          value: 'jMBATu',
          isActive: true
        },
        {
          code: '5uovRG',
          value: '5uovRG',
          isActive: false
        },
        {
          code: 'kMErAB',
          value: 'kMErAB',
          isActive: false
        },
        {
          code: 'Nx4pG3',
          value: 'Nx4pG3',
          isActive: true
        },
        {
          code: '5qcJmN',
          value: '5qcJmN',
          isActive: true
        },
        {
          code: 'MISMATCH202',
          value: 'MISMATCH202',
          isActive: true
        },
        {
          code: 'QXkfrF',
          value: 'QXkfrF',
          isActive: true
        },
        {
          code: 'BsimmB',
          value: 'BsimmB',
          isActive: false
        },
        {
          code: 'ha6wNC',
          value: 'ha6wNC',
          isActive: true
        },
        {
          code: 'MISMATCH123',
          value: 'MISMATCH123',
          isActive: false
        },
        {
          code: 'MISMATCH892',
          value: 'MISMATCH892',
          isActive: true
        },
        {
          code: 'PRODUCTMISMATCH',
          value: 'PRODUCTMISMATCH',
          isActive: true
        },
        {
          code: 'ajyWWb',
          value: 'ajyWWb',
          isActive: false
        },
        {
          code: '32TP7N',
          value: '32TP7N',
          isActive: false
        },
        {
          code: 'TESTMISMATCH11',
          value: 'TESTMISMATCH11',
          isActive: false
        },
        {
          code: '9qaeXU',
          value: '9qaeXU',
          isActive: false
        },
        {
          code: 'LWxw1C',
          value: 'LWxw1C',
          isActive: false
        },
        {
          code: 'Q5kVbD',
          value: 'Q5kVbD',
          isActive: true
        },
        {
          code: 'mR9BxL',
          value: 'mR9BxL',
          isActive: true
        },
        {
          code: 'asN5U4',
          value: 'asN5U4',
          isActive: true
        },
        {
          code: 'tkwX5t',
          value: 'tkwX5t',
          isActive: false
        },
        {
          code: 'R7XLjQ',
          value: 'R7XLjQ',
          isActive: false
        }
      ]
    };
    locationlovs = {
      lovType: 'LOCATIONTYPE',
      results: [
        {
          code: 'FAC',
          value: 'Factory',
          isActive: true
        },
        {
          code: 'ENTP',
          value: 'Enterprise',
          isActive: true
        },
        {
          code: 'VENDOR',
          value: 'Vendor',
          isActive: true
        },
        {
          code: 'P9B',
          value: 'Z9PS',
          isActive: true
        },
        {
          code: 'test',
          value: 'junit test',
          isActive: true
        },
        {
          code: 'BTQ',
          value: 'Boutique',
          isActive: true
        },
        {
          code: 'W7m',
          value: 'VGvP',
          isActive: true
        },
        {
          code: 'PRODUCTMISMATCH2',
          value: 'PRODUCTMISMATCH2',
          isActive: true
        },
        {
          code: 'REGOFF',
          value: 'REGIONALOFFICE',
          isActive: true
        },
        {
          code: 'CFA',
          value: 'CFA',
          isActive: true
        }
      ]
    };
    productlovs = {
      lovType: 'PRICINGGROUPTYPE',
      results: [
        {
          code: 'GOLDPLAIN',
          value: 'Plain - NONUCP',
          isActive: true
        },
        {
          code: 'ALIGARH',
          value: 'ALIGARH',
          isActive: true
        },
        {
          code: 'PLATINUMSTUDDED',
          value: 'FOR PLAIN PALTINUM',
          isActive: true
        },
        {
          code: 'UCP',
          value: 'UCP',
          isActive: true
        },
        {
          code: 'GOLDSTUDDED',
          value: 'Studded',
          isActive: true
        },
        {
          code: 'PLATINUMPLAIN',
          value: 'FOR STUDDED PLATINUM',
          isActive: true
        }
      ]
    };

    salesLovs = {
      lovType: 'OCCASION',
      results: [
        {
          code: '4',
          value: 'New Arrival/New Collection',
          isActive: true
        },
        {
          code: '1',
          value: 'Wedding/Marriage',
          isActive: true
        },
        {
          code: '5',
          value: 'Scheme Maturity',
          isActive: true
        },
        {
          code: '3',
          value: 'Festival/Function',
          isActive: true
        },
        {
          code: '6',
          value: 'Gold Rate',
          isActive: true
        },
        {
          code: '7',
          value: 'Discretionary',
          isActive: true
        },
        {
          code: '2',
          value: 'Birthday/Anniversary',
          isActive: true
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

    service = new LovDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get inventory LOV', () => {
    const lovType = 'DEFECTTYPE';

    spyOn(cacheableApiService, 'get').and.returnValue(of(inventoryLovs));

    service.getInventoryLovs(lovType).subscribe(x => {
      expect(x).toEqual(inventoryLovs.results);
    });
  });

  it('should get Locations LOV', () => {
    const lovType = 'DEFECTTYPE';

    spyOn(cacheableApiService, 'get').and.returnValue(of(locationlovs));

    service.getLocationLovs(lovType).subscribe(x => {
      expect(x).toEqual(locationlovs.results);
    });
  });

  it('should get Conversion itemSummary by ItemCode', () => {
    const lovType = 'PRICINGGROUPTYPE';

    spyOn(cacheableApiService, 'get').and.returnValue(of(productlovs));

    service.getEngineProductLovs(lovType).subscribe(x => {
      expect(x).toEqual(productlovs.results);
    });
  });
  it('should get Sales Lov', () => {
    const lovType = 'OCCASION';

    spyOn(cacheableApiService, 'get').and.returnValue(of(salesLovs));

    service.getSalesLovs(lovType).subscribe(x => {
      expect(x).toEqual(salesLovs.results);
    });
  });

  it('should get getPaymentLovs Lov', () => {
    const lovType = 'OCCASION';

    spyOn(cacheableApiService, 'get').and.returnValue(of(salesLovs));

    service.getPaymentLovs(lovType).subscribe(x => {
      expect(x).toEqual(salesLovs.results);
    });
  });
  it('should get getUserLovs Lov', () => {
    const lovType = 'OCCASION';

    spyOn(cacheableApiService, 'get').and.returnValue(of(salesLovs));

    service.getUserLovs(lovType).subscribe(x => {
      expect(x).toEqual(salesLovs.results);
    });
  });
});
