import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  PIFSeriesPayload,
  PIFSeriesResponse,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { PIFSeriesService } from '../pif-series.service';
import { PIFSeriesEffects } from './pif-series.effect';
import { PIFSeriesState } from './pif-series.state';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { hot, cold } from 'jasmine-marbles';
import {
  LoadPIFSeries,
  LoadPIFSeriesFailure,
  LoadPIFSeriesSucceess,
  SavePIFSeries,
  SavePIFSeriesFailure,
  SavePIFSeriesSuccess
} from './pif-series.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('PIFSeries Efects Testing Suite', () => {
  const pifListingResponse: PIFSeriesResponse = {
    pifSeries: [
      {
        id: 'ABC',
        bankName: 'AXIS BANK',
        paymentCode: 'CASH',
        fromNo: 123,
        toNo: 124,
        currentSeqNo: 123,
        isHomeBank: true,
        isActive: true
      }
    ],
    totalElements: 0
  };
  let actions$: Observable<any>;
  let effect: PIFSeriesEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  const pifSeriesServiceSpy = jasmine.createSpyObj<PIFSeriesService>([
    'loadPIFSeries',
    'savePIFSeries'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PIFSeriesEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: PIFSeriesService,
          useValue: pifSeriesServiceSpy
          // useValue: {
          //   loadPIFSeries: jasmine.createSpy(),
          //   savePIFSeries: jasmine.createSpy()
          // }
        }
      ]
    });
    effect = TestBed.inject(PIFSeriesEffects);
    // pifSeriesService = TestBed.inject(PIFSeriesService);
  });
  describe('LoadPIFSeries', () => {
    it('should return a stream with PIFSeriesListing', () => {
      const parameters: PIFSeriesPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPIFSeries(parameters);
      const outcome = new LoadPIFSeriesSucceess(pifListingResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: pifListingResponse });
      pifSeriesServiceSpy.loadPIFSeries.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPIFSeries$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: PIFSeriesPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPIFSeries(parameters);
      const error = new Error('some error');
      const outcome = new LoadPIFSeriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      pifSeriesServiceSpy.loadPIFSeries.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPIFSeries$).toBeObservable(expected);
    });
  });
  describe('SavePIFSeries', () => {
    it('should return a stream with savePIFseries response', () => {
      const savePayload: SavePIFSeriesPayload[] = [
        {
          fromNo: 0,
          toNo: 100,
          id: '123'
        }
      ];
      const action = new SavePIFSeries(savePayload);
      const outcome = new SavePIFSeriesSuccess();
      actions$ = hot('-a', { a: action });
    });
    it('should fail and return an action with the error', () => {
      const savePayload: SavePIFSeriesPayload[] = [
        {
          fromNo: 0,
          toNo: 100,
          id: '123'
        }
      ];
      const action = new SavePIFSeries(savePayload);
      const error = new Error('some error');
      const outcome = new SavePIFSeriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      pifSeriesServiceSpy.savePIFSeries.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePIFSeries$).toBeObservable(expected);
    });
  });
});
