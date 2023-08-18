import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { EmployeeLoanConfigurationEffect } from './employee-loan-configuration.effects';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { empLoanConfigurationKey } from './employee-loan-configuration.reducer';
import {
  EmployeeLoanSuccessList,
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { EmployeeLoanConfigurationService } from '../employee-loan-configuration.service';
import { DeleteEmpLoanConfig, DeleteEmpLoanConfigFailure, DeleteEmpLoanConfigSuccess, GetEmpLoanConfigList, GetEmpLoanConfigListFailure, GetEmpLoanConfigListSuccess } from './employee-loan-configuration.actions';


const configListingPayload: ListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const empLoanConfigurationList: EmployeeLoanSuccessList = {
  configList: [
    {
      id: 'a',
      empName: 'emp1',
      empCode: '1234',
      empMobileNum: '1234567899',
      eligibleAmount: 20000,
      approvalDate: moment(1623456),
      validityDate: moment(1623456),
      applicableCFACodes: '54,72',
      applicableLocationCodes: 'TBO,CPD',
      marginPercentage: 2,
      validationOTP: 1,
      partialRedeemableAmt: 50
    }
  ],
  count: 1
};

describe('Employee Loan Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: EmployeeLoanConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let employeeLoanConfigurationService = jasmine.createSpyObj<
    EmployeeLoanConfigurationService
  >('EmployeeLoanConfigurationService', [
    'empLoanConfigList',
    'deleteEmpLoanConfig'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeLoanConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [empLoanConfigurationKey]: initialState
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
          provide: EmployeeLoanConfigurationService,
          useValue: {
            empLoanConfigList: jasmine.createSpy(),
            deleteEmpLoanConfig: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(EmployeeLoanConfigurationEffect);
    employeeLoanConfigurationService = TestBed.inject<any>(
      EmployeeLoanConfigurationService
    );
  });

  describe('GetEmpLoanConfigList', () => {
    it('should return a stream of GetEmpLoanConfigList ', () => {
      const action = new GetEmpLoanConfigList(configListingPayload, sortField);
      const outcome = new GetEmpLoanConfigListSuccess(empLoanConfigurationList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: empLoanConfigurationList
      });
      employeeLoanConfigurationService.empLoanConfigList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetEmpLoanConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetEmpLoanConfigList(configListingPayload, sortField);
      const error = new Error('some error');
      const outcome = new GetEmpLoanConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      employeeLoanConfigurationService.empLoanConfigList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetEmpLoanConfigList$).toBeObservable(expected);
    });
  });
  describe('DeleteEmpLoanConfig', () => {
    it('should return a stream of DeleteEmpLoanConfig ', () => {
      const action = new DeleteEmpLoanConfig('123');
      const outcome = new DeleteEmpLoanConfigSuccess(empLoanConfigurationList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: empLoanConfigurationList
      });
      employeeLoanConfigurationService.deleteEmpLoanConfig.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.DeleteEmpLoanConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteEmpLoanConfig('123');
      const error = new Error('some error');
      const outcome = new DeleteEmpLoanConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      employeeLoanConfigurationService.deleteEmpLoanConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.DeleteEmpLoanConfig$).toBeObservable(expected);
    });
  });
});
