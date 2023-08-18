import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { ConfigurationRanges, Lov } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { RangeService } from '../range.service';
import { RangeEffects } from './range.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { RangeSelectors } from './range.selector';
import {
  LoadRanges,
  LoadRangesFailure,
  LoadRangesSuccess,
  LoadRangeTypes,
  LoadRangeTypesFailure,
  LoadRangeTypesSuccess,
  SaveRanges,
  SaveRangesFailure,
  SaveRangesSuccess
} from './range.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';

describe('Range Effects Testing Suite', () => {
  const ranges: ConfigurationRanges[] = [
    {
      fromRange: '70',
      toRange: '80',
      id: 'abc123',
      rowId: 1,
      isActive: true
    }
  ];
  const savePayload = {
    rangeType: 'GEP_PURITY',
    savePayload: { fromRange: '12', toRange: '13', rowId: '1' }
  };
  let actions$: Observable<any>;
  let effect: RangeEffects;

  const initialState = {};
  const rangeServiceSpy = jasmine.createSpyObj<RangeService>([
    'loadRanges',
    'saveRanges'
  ]);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>(['getLov']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RangeEffects,
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
          provide: RangeService,
          useValue: rangeServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(RangeEffects);
  });

  describe('loadRanges', () => {
    it('should return a stream with loadRanges', () => {
      const action = new LoadRanges('GEP_PURITY');
      const outcome = new LoadRangesSuccess(ranges);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ranges });
      rangeServiceSpy.loadRanges.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRanges$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadRanges('GEP_PURITY');
      const error = new Error('some error');
      const outcome = new LoadRangesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      rangeServiceSpy.loadRanges.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRanges$).toBeObservable(expected);
    });
  });

  describe('saveRanges', () => {
    it('should return a stream with saveRanges', () => {
      const action = new SaveRanges(savePayload);
      const outcome = new SaveRangesSuccess();
      actions$ = cold('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      rangeServiceSpy.saveRanges.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveRanges$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveRanges(savePayload);
      const error = new Error('some error');
      const outcome = new SaveRangesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      rangeServiceSpy.saveRanges.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveRanges$).toBeObservable(expected);
    });
  });

  describe('LoadRangeTypes', () => {
    // it('should return a stream with LoadRangeTypes', () => {
    //   const response: Lov[] = [
    //     {
    //       code: 'GEP_PURITY_GOLD',
    //       isActive: true,
    //       value: 'GEP_PURITY_GOLD'
    //     }
    //   ];
    //   const action = new LoadRangeTypes('RANGE_TYPE');
    //   const outcome = new LoadRangeTypesSuccess(response);
    //   actions$ = cold('-a', { a: action });

    //   const response$ = cold('-a|', { a: null });
    //   lovDataServiceSpy.getLov.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadRangeTypes$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new LoadRangeTypes('RANGE_TYPE');
      const error = new Error('some error');
      const outcome = new LoadRangeTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getLov.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeTypes$).toBeObservable(expected);
    });
  });
});
