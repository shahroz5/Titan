import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  AvailableMetalRates,
  BankDepositRequestPayload,
  BodBusinessDayResponse,
  BodBusinessDayResponseFormat,
  EghsBodGeneratedPassword,
  EghsBodPasswordsListingResponse,
  GhsFileUploadResponse,
  MetalRatesAndGoldAvailabilityResponse,
  MetalRatesRequestFormat,
  OfflineGhsEodRevenueCollection,
  UsersActiveSessionsResults,
  WalkInDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { BodEodService } from '../bod-eod.service';
import {
  BoutiquePossBodCompleted,
  BoutiquePossBodCompletedFailure,
  BoutiquePossBodCompletedSuccess,
  BoutiquePossEodCompleted,
  BoutiquePossEodCompletedFailure,
  BoutiquePossEodCompletedSuccess,
  ClosedBod,
  ClosedBodFailure,
  ClosedBodSuccess,
  CurrentDayBod,
  CurrentDayBodFailure,
  CurrentDayBodSuccess,
  GeneratePasswordForEghsOffline,
  GeneratePasswordForEghsOfflineFailure,
  GeneratePasswordForEghsOfflineSuccess,
  GhsBodCompleted,
  GhsBodCompletedFailure,
  GhsBodCompletedSuccess,
  GHSEodCompleted,
  GHSEodCompletedFailure,
  GHSEodCompletedSuccess,
  LoadActiveUserSessions,
  LoadActiveUserSessionsFailure,
  LoadActiveUserSessionsSuccess,
  LoadAvailableMetalRatesForBusinessDay,
  LoadAvailableMetalRatesForBusinessDayFailure,
  LoadAvailableMetalRatesForBusinessDaySuccess,
  LoadGhsOfflineBodPasswords,
  LoadGhsOfflineBodPasswordsFailure,
  LoadGhsOfflineBodPasswordsSuccess,
  LoadMetalRatesForBusinessDay,
  LoadMetalRatesForBusinessDayFailure,
  LoadMetalRatesForBusinessDaySuccess,
  PerformGhsRevenueCollection,
  PerformGhsRevenueCollectionFailure,
  PerformGhsRevenueCollectionSuccess,
  PerformOfflineEodGhsRevenueCollection,
  PerformOfflineEodGhsRevenueCollectionFailure,
  PerformOfflineEodGhsRevenueCollectionSuccess,
  PerformRevenueCollection,
  PerformRevenueCollectionFailure,
  PerformRevenueCollectionSuccess,
  PreviousDayBankDepositCompleted,
  PreviousDayBankDepositCompletedFailure,
  PreviousDayBankDepositCompletedSuccess,
  PreviousDayEod,
  PreviousDayEodFailure,
  PreviousDayEodSuccess,
  PreviousDayGHSBankDepositUpload,
  PreviousDayGHSBankDepositUploadFailure,
  PreviousDayGHSBankDepositUploadSuccess,
  StartBodProcess,
  StartBodProcessFailure,
  StartBodProcessSuccess,
  StartEodProcess,
  StartEodProcessFailure,
  StartEodProcessSuccess,
  WalkinDetailsCompleted,
  WalkinDetailsCompletedFailure,
  WalkinDetailsCompletedSuccess
} from './bod-eod.actions';
import { BodEodEffects } from './bod-eod.effects';

describe('BOD-EOD Process Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BodEodEffects;

  const initialState = {};
  const bodEodServiceSpy: jasmine.SpyObj<BodEodService> = jasmine.createSpyObj<
    BodEodService
  >('BodEodService', [
    'getPreviousDayEodStatus',
    'startBodProcess',
    'getMetalRatesAndGoldRateAvailabityForBusinessDay',
    'getMetalRatesAndGoldRateAvailabity',
    'getBoutiquePossBodCompletionStatus',
    'getGhsBodCompletionStatus',
    'generatePasswordForEghsOffline',
    'loadGhsOfflineBodPasswords',
    'getCurrentDayBodStatus',
    'getClosedBod',
    'startEodProcess',
    'getWalkinDetailsStatus',
    'getGhsBankDepositUploadStatus',
    'getPreviousDayBankDepositStatus',
    'performRevenueCollection',
    'performGhsRevenueCollection',
    'performEodOfflineGhsRevenueCollection',
    'performGhsEodActivity',
    'performEodActivity',
    'loadActiveUserSessions'
  ]);
  const loggerService = jasmine.createSpyObj<LoggerService>('LoggerService', [
    'error'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BodEodEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: BodEodService,
          useValue: bodEodServiceSpy
        },
        {
          provide: LoggerService,
          useValue: loggerService
        }
      ]
    });
    effect = TestBed.inject(BodEodEffects);
  });

  describe('PreviousDayEod Effects Testing', () => {
    it('should get Business date if previous Day EOD is completed', () => {
      const responsePayload: BodBusinessDayResponseFormat = {
        businessDate: 123456789,
        fiscalYear: 2020,
        id: '1',
        isGHSBODDone: true,
        isGHSEODDone: true,
        locationCode: 'CPD',
        remarks: 'remarks',
        skipBanking: false,
        status: 'OPEN',
        rateFetchAttempts: 0
      };

      const action = new PreviousDayEod();
      const outCome = new PreviousDayEodSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getPreviousDayEodStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.previousDayEodCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PreviousDayEod();
      const error = new Error('some error');
      const outCome = new PreviousDayEodFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getPreviousDayEodStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.previousDayEodCompleted$).toBeObservable(expected$);
    });
  });

  describe('StartBodProcess Effects Testing', () => {
    it('should start the BOD process and update the status as BOD_IN_PROGRESS', () => {
      const action = new StartBodProcess();
      const outCome = new StartBodProcessSuccess(123456789);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: 123456789 });
      bodEodServiceSpy.startBodProcess.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.startBodProcess$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new StartBodProcess();
      const error = new Error('some error');
      const outCome = new StartBodProcessFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.startBodProcess.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.startBodProcess$).toBeObservable(expected$);
    });
  });

  describe('LoadAvailableMetalRatesForBusinessDay Effects Testing', () => {
    const payload: MetalRatesRequestFormat = {
      businessDate: 123456789,
      isRetryAttempted: false
    };

    it('should Load all available metal rates', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: 50000,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: true
      };

      const action = new LoadAvailableMetalRatesForBusinessDay(payload);
      const outCome = new LoadAvailableMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getMetalRatesAndGoldRateAvailabity.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAvailableMetalRatesForBusinessDay$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadAvailableMetalRatesForBusinessDay(payload);
      const error = new Error('some error');
      const outCome = new LoadAvailableMetalRatesForBusinessDayFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getMetalRatesAndGoldRateAvailabity.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAvailableMetalRatesForBusinessDay$).toBeObservable(
        expected$
      );
    });
  });

  describe('LoadMetalRatesForBusinessDay Effects Testing', () => {
    const payload = 123456789;

    it('should Load all available metal rates', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: 50000,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: true
      };

      const action = new LoadMetalRatesForBusinessDay(payload);
      const outCome = new LoadMetalRatesForBusinessDaySuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getMetalRatesAndGoldRateAvailabityForBusinessDay.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMetalRatesForBusinessDay$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMetalRatesForBusinessDay(payload);
      const error = new Error('some error');
      const outCome = new LoadMetalRatesForBusinessDayFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getMetalRatesAndGoldRateAvailabityForBusinessDay.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMetalRatesForBusinessDay$).toBeObservable(expected$);
    });
  });

  describe('BoutiquePossBodCompleted Effects Testing', () => {
    const payload = 123456789;

    it('should perform and get Boutique poss Bod Status', () => {
      const responsePayload: BodBusinessDayResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        id: '1',
        isGHSBODDone: false,
        isGHSEODDone: false,
        locationCode: 'CPD',
        remarks: 'remarks',
        skipBanking: false,
        status: 'OPEN'
      };

      const action = new BoutiquePossBodCompleted(payload);
      const outCome = new BoutiquePossBodCompletedSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getBoutiquePossBodCompletionStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.boutiquePossBodCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new BoutiquePossBodCompleted(payload);
      const error = new Error('some error');
      const outCome = new BoutiquePossBodCompletedFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getBoutiquePossBodCompletionStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.boutiquePossBodCompleted$).toBeObservable(expected$);
    });
  });

  describe('GhsBodCompleted Effects Testing', () => {
    const payload = 123456789;

    it('should perform and get GHS BOD Status', () => {
      const responsePayload: BodBusinessDayResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        id: '1',
        isGHSBODDone: false,
        isGHSEODDone: false,
        locationCode: 'CPD',
        remarks: 'remarks',
        skipBanking: false,
        status: 'OPEN'
      };

      const action = new GhsBodCompleted(payload);
      const outCome = new GhsBodCompletedSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getGhsBodCompletionStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.ghsBodCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GhsBodCompleted(payload);
      const error = new Error('some error');
      const outCome = new GhsBodCompletedFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getGhsBodCompletionStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.ghsBodCompleted$).toBeObservable(expected$);
    });
  });

  describe('GeneratePasswordForEghsOffline Effects Testing', () => {
    const payload = 123456789;

    it('should Generate Password for EGHS Offline BOD', () => {
      const responsePayload: EghsBodGeneratedPassword = {
        contextType: '',
        goldRate: 50000,
        locationCode: 'CPD',
        password: 'password',
        passwordDate: ' passwordDate'
      };

      const action = new GeneratePasswordForEghsOffline(payload);
      const outCome = new GeneratePasswordForEghsOfflineSuccess(
        responsePayload
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.generatePasswordForEghsOffline.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.generatePasswordForEghsOffline$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GeneratePasswordForEghsOffline(payload);
      const error = new Error('some error');
      const outCome = new GeneratePasswordForEghsOfflineFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.generatePasswordForEghsOffline.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.generatePasswordForEghsOffline$).toBeObservable(expected$);
    });
  });

  describe('LoadGhsOfflineBodPasswords Effects Testing', () => {
    it('should Load GHS Offline Bod Passwords', () => {
      const offlineEghsBodPasswordResponse: EghsBodGeneratedPassword[] = [
        {
          contextType: '',
          goldRate: 50000,
          locationCode: 'CPD',
          password: 'password',
          passwordDate: ' passwordDate'
        }
      ];
      const responsePayload: EghsBodPasswordsListingResponse = {
        offlineEghsBodPasswordData: offlineEghsBodPasswordResponse,
        count: 10
      };

      const action = new LoadGhsOfflineBodPasswords();
      const outCome = new LoadGhsOfflineBodPasswordsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.loadGhsOfflineBodPasswords.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadGhsOfflineBodPasswords$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGhsOfflineBodPasswords();
      const error = new Error('some error');
      const outCome = new LoadGhsOfflineBodPasswordsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.loadGhsOfflineBodPasswords.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadGhsOfflineBodPasswords$).toBeObservable(expected$);
    });
  });

  /*Eod Related*/

  describe('CurrentDayBod Effects Testing', () => {
    it('should Load Current Day BOD Status', () => {
      const responsePayload = 123456789;

      const action = new CurrentDayBod();
      const outCome = new CurrentDayBodSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getCurrentDayBodStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.currentDayBod$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CurrentDayBod();
      const error = new Error('some error');
      const outCome = new CurrentDayBodFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getCurrentDayBodStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.currentDayBod$).toBeObservable(expected$);
    });
  });

  describe('ClosedBod Effects Testing', () => {
    it('should Load Latest Business Date', () => {
      const responsePayload = 123456789;

      const action = new ClosedBod();
      const outCome = new ClosedBodSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getClosedBod.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.closedBod$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ClosedBod();
      const error = new Error('some error');
      const outCome = new ClosedBodFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getClosedBod.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.closedBod$).toBeObservable(expected$);
    });
  });

  describe('StartEodProcess Effects Testing', () => {
    it('should Start the EOD process & update the status as EOD_IN_PROGRESS', () => {
      const responsePayload = 123456789;

      const action = new StartEodProcess();
      const outCome = new StartEodProcessSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.startEodProcess.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.startEodProcess$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new StartEodProcess();
      const error = new Error('some error');
      const outCome = new StartEodProcessFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.startEodProcess.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.startEodProcess$).toBeObservable(expected$);
    });
  });

  describe('WalkinDetailsCompleted Effects Testing', () => {
    const requestPayload = 123456789;

    it('should Check if Walk-in details are updated for the business data minus configured days', () => {
      const responsePayload: WalkInDetailsResponse = {
        conversion: null,
        employeeCode: 'EMP',
        locationCode: 'CPD',
        noOfInvoice: 10,
        walkins: 10
      };

      const action = new WalkinDetailsCompleted(requestPayload);
      const outCome = new WalkinDetailsCompletedSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getWalkinDetailsStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.walkinDetailsCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new WalkinDetailsCompleted(requestPayload);
      const error = new Error('some error');
      const outCome = new WalkinDetailsCompletedFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getWalkinDetailsStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.walkinDetailsCompleted$).toBeObservable(expected$);
    });
  });

  describe('PreviousDayGHSBankDepositUpload Effects Testing', () => {
    const requestPayload = 123456789;

    it('should Check if Previous day Ghs Bank Deposit uploaded', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PreviousDayGHSBankDepositUpload(requestPayload);
      const outCome = new PreviousDayGHSBankDepositUploadSuccess(
        responsePayload
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getGhsBankDepositUploadStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.previousDayGHSBankDepositUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PreviousDayGHSBankDepositUpload(requestPayload);
      const error = new Error('some error');
      const outCome = new PreviousDayGHSBankDepositUploadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getGhsBankDepositUploadStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.previousDayGHSBankDepositUpload$).toBeObservable(expected$);
    });
  });

  describe('PreviousDayBankDepositCompleted Effects Testing', () => {
    const requestPayload: BankDepositRequestPayload = {
      businessDate: 123456789,
      remarks: 'remarks',
      skipBanking: false
    };

    it('should Check if Previous day Boutique Bank Deposit is completed', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PreviousDayBankDepositCompleted(requestPayload);
      const outCome = new PreviousDayBankDepositCompletedSuccess(
        responsePayload
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getPreviousDayBankDepositStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.previousDayBankDepositCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PreviousDayBankDepositCompleted(requestPayload);
      const error = new Error('some error');
      const outCome = new PreviousDayBankDepositCompletedFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getPreviousDayBankDepositStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.previousDayBankDepositCompleted$).toBeObservable(expected$);
    });
  });

  describe('PerformRevenueCollection Effects Testing', () => {
    const requestPayload = 123456789;

    it('should perform Revenue Collection', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PerformRevenueCollection(requestPayload);
      const outCome = new PerformRevenueCollectionSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.performRevenueCollection.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.performRevenueCollection$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PerformRevenueCollection(requestPayload);
      const error = new Error('some error');
      const outCome = new PerformRevenueCollectionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.performRevenueCollection.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.performRevenueCollection$).toBeObservable(expected$);
    });
  });

  describe('PerformGhsRevenueCollection Effects Testing', () => {
    const requestPayload = 123456789;

    it('should perform GHS Revenue Collection', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PerformGhsRevenueCollection(requestPayload);
      const outCome = new PerformGhsRevenueCollectionSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.performGhsRevenueCollection.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.performGhsRevenueCollection$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PerformGhsRevenueCollection(requestPayload);
      const error = new Error('some error');
      const outCome = new PerformGhsRevenueCollectionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.performGhsRevenueCollection.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.performGhsRevenueCollection$).toBeObservable(expected$);
    });
  });

  describe('GHSEodCompleted Effects Testing', () => {
    const requestPayload = 123456789;

    it('should perform GHS EOD Process', () => {
      const responsePayload: BodBusinessDayResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        id: '1',
        isGHSBODDone: false,
        isGHSEODDone: false,
        locationCode: 'CPD',
        remarks: 'remarks',
        skipBanking: false,
        status: 'OPEN'
      };

      const action = new GHSEodCompleted(requestPayload);
      const outCome = new GHSEodCompletedSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.performGhsEodActivity.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.gHSEodCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GHSEodCompleted(requestPayload);
      const error = new Error('some error');
      const outCome = new GHSEodCompletedFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.performGhsEodActivity.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.gHSEodCompleted$).toBeObservable(expected$);
    });
  });

  describe('BoutiquePossEodCompleted Effects Testing', () => {
    const requestPayload = 123456789;

    it('should perform boutique POSS EOD Process - Complete', () => {
      const action = new BoutiquePossEodCompleted(requestPayload);
      const outCome = new BoutiquePossEodCompletedSuccess(123456789);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: 123456789 });
      bodEodServiceSpy.performEodActivity.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.boutiquePossEodCompleted$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new BoutiquePossEodCompleted(requestPayload);
      const error = new Error('some error');
      const outCome = new BoutiquePossEodCompletedFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.performEodActivity.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.boutiquePossEodCompleted$).toBeObservable(expected$);
    });
  });

  describe('PerformOfflineEodGhsRevenueCollection Effects Testing', () => {
    const payload: OfflineGhsEodRevenueCollection = {
      achAmount: '123',
      achReversal: '123',
      airPayAmount: '123',
      airPayReversal: '123',
      businessDate: 123456789,
      cashAmount: '123',
      cashRefund: '123',
      cashReversal: '123',
      cccommission: '123',
      ccrevenue: '123',
      ccreversal: '123',
      chequeAmount: '123',
      chequeReversal: '123',
      ddamount: '123',
      ddreversal: '123',
      emplSalaryDeductionAmount: '123',
      emplSalaryDeductionAmountReversal: '123',
      locationCode: '123',
      netAmount: '123',
      password: '123',
      paytmAmount: '123',
      paytmReversal: '123',
      roRefund: '123'
    };

    it('should Perform Offline Ghs Eod Revenue Collection', () => {
      const action = new PerformOfflineEodGhsRevenueCollection(payload);
      const outCome = new PerformOfflineEodGhsRevenueCollectionSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      bodEodServiceSpy.performEodOfflineGhsRevenueCollection.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.performOfflineEodGhsRevenueCollection$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new PerformOfflineEodGhsRevenueCollection(payload);
      const error = new Error('some error');
      const outCome = new PerformOfflineEodGhsRevenueCollectionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.performEodOfflineGhsRevenueCollection.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.performOfflineEodGhsRevenueCollection$).toBeObservable(
        expected$
      );
    });
  });

  describe('LoadActiveUserSessions Effects Testing', () => {
    it('should Load Active Users Sessions - Employees from Same boutique location', () => {
      const requestPayload: UsersActiveSessionsResults[] = [
        {
          userName: 'cashiercpd',
          employeeCode: 'cashiercpd',
          employeeName: 'cashiercpd',
          emailId: null,
          mobileNo: null,
          sessions: null,
          id: 1,
          loginDate: 123456789,
          expiryDate: 123456789,
          hostName: ''
        }
      ];

      const action = new LoadActiveUserSessions();
      const outCome = new LoadActiveUserSessionsSuccess(requestPayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: requestPayload });
      bodEodServiceSpy.loadActiveUserSessions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadActiveUserSessions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadActiveUserSessions();
      const error = new Error('some error');
      const outCome = new LoadActiveUserSessionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.loadActiveUserSessions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadActiveUserSessions$).toBeObservable(expected$);
    });
  });
});
