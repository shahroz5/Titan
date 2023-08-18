import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  CutPieceTot,
  LoadStatesDetailsListingSuccessPayload,
  LoadStateTaxConfigurationListingPayload,
  StateTaxConfigurationListingData,
  StateTaxConfigurationListingResult,
  TaxDetailsConfig,
  TaxDetailsSubmit,
  TaxsList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { CutPieceTotService } from '../cut-piece-tot.service';
import { CutPieceTotEffect } from './cut-piece-tot.effect';
import { CUTPIECETOT_FEATURE_KEY } from './cut-piece-tot.reducer';
import {
  LoadCutPieceTot,
  LoadCutPieceTotSuccess,
  UpdateCutPieceTot,
  UpdateCutPieceTotSuccess
} from './cut-piece-tot.actions';

describe('Cut piece TOT Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CutPieceTotEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const cutPieceTotServiceSpy = jasmine.createSpyObj<CutPieceTotService>([
    'getCutPieceTotDetails',
    'editCashPaymentConfigurationDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CutPieceTotEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [CUTPIECETOT_FEATURE_KEY]: initialState
          }
        }),
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
          provide: CutPieceTotService,
          useValue: cutPieceTotServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CutPieceTotEffect);
  });

  describe('LoadCutPieceTot', () => {
    it('should return LoadCutPieceTotSuccess', () => {
      const action = new LoadCutPieceTot();

      const payload2: CutPieceTot[] = [
        {
          description: 'Desc',
          isActive: true,
          offerDetails: null,
          configDetails: {
            data: {
              l3DeductionPercent: 1
            },
            type: 'TYPE'
          },
          isOfferEnabled: null,
          itemCode: 'Code',
          startDate: null,
          endDate: null,
          customerMobileNos: ['111'],
          karat: 0,
          configId: '1',
          configType: 'Type',
          createdDate: 123123123
        }
      ];

      const outcome = new LoadCutPieceTotSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      cutPieceTotServiceSpy.getCutPieceTotDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCutPieceTot$).toBeObservable(expected$);
    });
  });

  describe('UpdateCutPieceTot', () => {
    const payload: { configId: string; cutPieceTot: CutPieceTot } = {
      configId: '1',
      cutPieceTot: {
        configDetails: {
          data: {
            l3DeductionPercent: 1
          },
          type: 'TYPE'
        },
        isOfferEnabled: null,
        itemCode: 'Code',
        startDate: null,
        endDate: null,
        customerMobileNos: ['111'],
        karat: 0,
        configId: '1',
        configType: 'Type',
        createdDate: 123123123,
        description: 'desc',
        isActive: true,
        offerDetails: null
      }
    };
    it('should return UpdateCutPieceTotSuccess', () => {
      const action = new UpdateCutPieceTot(payload);

      const outcome = new UpdateCutPieceTotSuccess(payload.cutPieceTot);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload.cutPieceTot
      });
      cutPieceTotServiceSpy.editCashPaymentConfigurationDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCutPieceTot$).toBeObservable(expected$);
    });
  });
});
