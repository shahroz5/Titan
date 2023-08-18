//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  LoadBankPriorityListingSuccessPayload,
  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { BankPriorityEffect } from './bankPriority.effect';
import { BankPriorityService } from '../bankPriority.service';
import {} from './bankPriority.effect';
import {
  LoadBankPriority,
  LoadBankPrioritySuccess,
  LoadBankPriorityFailure,
  SaveBankPriority,
  SaveBankPrioritySuccess,
  SaveBankPriorityFailure
} from './bankPriority.action';

describe('BankPriorityEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BankPriorityEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let bankPriorityService = jasmine.createSpyObj<BankPriorityService>(
    'bankPriorityService',
    ['getBankPriority', 'saveBankPriorityFormDetails']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankPriorityEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },

        {
          provide: BankPriorityService,
          useValue: {
            getBankPriority: jasmine.createSpy(),
            saveBankPriorityFormDetails: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(BankPriorityEffect);
    bankPriorityService = TestBed.inject<any>(BankPriorityService);
  });

  describe('loadBankPiority', () => {
    it('should return a stream with bank priority list', () => {
      const res: LoadBankPriorityListingSuccessPayload = {
        bankPriorityListing: [
          {
            bankName: 'HDFC',
            priority: '1'
          }
        ],
        totalElements: 1
      };
      const action = new LoadBankPriority();
      const outcome = new LoadBankPrioritySuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      bankPriorityService.getBankPriority.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBankPiority$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBankPriority();
      const error = new Error('some error');
      const outcome = new LoadBankPriorityFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bankPriorityService.getBankPriority.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBankPiority$).toBeObservable(expected);
    });
  });

  describe('saveBankPriorityFormDetails', () => {
    it('should return a stream with payment master ', () => {
      const payload: SaveBankPriorityFormDetailsPayload = {
        addPriority: [{ bankName: 'HDFC', priority: '2', locationCode: '' }],
        removePriority: []
      };

      const action = new SaveBankPriority(payload);
      const outcome = new SaveBankPrioritySuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      bankPriorityService.saveBankPriorityFormDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBankPriorityFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveBankPriorityFormDetailsPayload = {
        addPriority: [{ bankName: 'HDFC', priority: '2', locationCode: '' }],
        removePriority: []
      };
      const action = new SaveBankPriority(payload);
      const error = new Error('some error');
      const outcome = new SaveBankPriorityFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bankPriorityService.saveBankPriorityFormDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBankPriorityFormDetails$).toBeObservable(expected);
    });
  });
});
