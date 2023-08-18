import {
  AvailableMetalRates,
  BankDepositRequestPayload,
  BodBusinessDayResponse,
  BodBusinessDayResponseFormat,
  BodEodEnum,
  BodEodStepsEnum,
  CustomErrors,
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
import * as actions from './bod-eod.actions';
import { BodEodReducer, initialState } from './bod-eod.reducer';
import { BodEodState } from './bod-eod.state';

describe('BOD-EOD Process Reducer Testing Suite', () => {
  describe('Testing PreviousDayEod Functionality', () => {
    beforeEach(() => {});

    it('Testing PREVIOUS_DAY_EOD', () => {
      const action = new actions.PreviousDayEod();
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.previousdayEODStatus).toBe(BodEodEnum.PENDING);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.rateFetchAttempts).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing PREVIOUS_DAY_EOD_SUCCESS', () => {
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

      const action = new actions.PreviousDayEodSuccess(responsePayload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.previousdayEODStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.bodBusinessDate).toBe(action.payload.businessDate);
      expect(result.rateFetchAttempts).toBe(action.payload.rateFetchAttempts);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing PREVIOUS_DAY_EOD_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PreviousDayEodFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.previousdayEODStatus).toBe(BodEodEnum.ERROR);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.rateFetchAttempts).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing StartBodProcess Functionality', () => {
    beforeEach(() => {});

    it('Testing START_BOD_PROCESS', () => {
      const action = new actions.StartBodProcess();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.isBodProcessStarted).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing START_BOD_PROCESS_SUCCESS', () => {
      const action = new actions.StartBodProcessSuccess(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.isBodProcessStarted).toBe(true);
      expect(result.bodBusinessDate).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing START_BOD_PROCESS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.StartBodProcessFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.isBodProcessStarted).toBe(false);

      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadAvailableMetalRatesForBusinessDay Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY', () => {
      const payload: MetalRatesRequestFormat = {
        businessDate: 123456789,
        isRetryAttempted: false
      };

      const action = new actions.LoadAvailableMetalRatesForBusinessDay(payload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.bodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.availableMetalRates).toBe(null);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.PENDING);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS when Gold Rate is available', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: 50000,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: true
      };

      const action = new actions.LoadAvailableMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.availableMetalRates).toBe(
        action.payload.availableMetalRates
      );
      expect(result.isGoldRateAvailable).toBe(action.payload.goldRateAvailable);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.AVAILABLE);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP1_COMPLETED);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });
    it('Testing LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS when Gold Rate is not available', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: null,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: false
      };

      const action = new actions.LoadAvailableMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.availableMetalRates).toBe(
        action.payload.availableMetalRates
      );
      expect(result.isGoldRateAvailable).toBe(action.payload.goldRateAvailable);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.ERROR);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP1_COMPLETED);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAvailableMetalRatesForBusinessDayFailure(
        payload
      );
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.bodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.availableMetalRates).toBe(null);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.ERROR);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP1_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadMetalRatesForBusinessDay Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY', () => {
      const action = new actions.LoadMetalRatesForBusinessDay(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.availableMetalRates).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS when Gold rate is available', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: 50000,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: true
      };

      const action = new actions.LoadMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.AVAILABLE);
      expect(result.availableMetalRates).toBe(
        action.payload.availableMetalRates
      );
      expect(result.isGoldRateAvailable).toBe(action.payload.goldRateAvailable);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });
    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS when Gold rate is not available', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: null,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: false
      };

      const action = new actions.LoadMetalRatesForBusinessDaySuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.ERROR);
      expect(result.availableMetalRates).toBe(
        action.payload.availableMetalRates
      );
      expect(result.isGoldRateAvailable).toBe(action.payload.goldRateAvailable);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadMetalRatesForBusinessDayFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.ERROR);
      expect(result.availableMetalRates).toBe(null);

      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing BoutiquePossBodCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing BOUTIQUE_POSS_BOD_COMPLETED', () => {
      const action = new actions.BoutiquePossBodCompleted(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.boutiquePossBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing BOUTIQUE_POSS_BOD_COMPLETED_SUCCESS', () => {
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

      const action = new actions.BoutiquePossBodCompletedSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.boutiquePossBodStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP2_COMPLETED);

      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing BOUTIQUE_POSS_BOD_COMPLETED_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.BoutiquePossBodCompletedFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.bodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.boutiquePossBodStatus).toBe(BodEodEnum.ERROR);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP2_ERROR);

      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing GhsBodCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing GHS_BOD', () => {
      const action = new actions.GhsBodCompleted(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.bodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.ghsBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing GHS_BOD_SUCCESS', () => {
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

      const action = new actions.GhsBodCompletedSuccess(responsePayload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.bodProcessStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.ghsBodStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP3_COMPLETED);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing GHS_BOD_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GhsBodCompletedFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.bodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.ghsBodStatus).toBe(BodEodEnum.ERROR);
      expect(result.bodStepsStatus).toBe(BodEodStepsEnum.STEP3_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing MarkBodProcessCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing MARK_BOD_COMPLETED', () => {
      const action = new actions.MarkBodProcessCompleted();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.bodProcessStatus).toBe(BodEodEnum.COMPLETED);
    });
  });

  describe('Testing GeneratePasswordForEghsOffline Functionality', () => {
    beforeEach(() => {});

    it('Testing GENERATE_PASSWORD_FOR_EGHS_OFFLINE', () => {
      const action = new actions.GeneratePasswordForEghsOffline(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.ghsOfflineBodPassword).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing GENERATE_PASSWORD_FOR_EGHS_OFFLINE_SUCCESS', () => {
      const responsePayload: EghsBodGeneratedPassword = {
        contextType: '',
        goldRate: 50000,
        locationCode: 'CPD',
        password: 'password',
        passwordDate: ' passwordDate'
      };

      const action = new actions.GeneratePasswordForEghsOfflineSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.ghsOfflineBodPassword).toBe(action.payload.password);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing GENERATE_PASSWORD_FOR_EGHS_OFFLINE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GeneratePasswordForEghsOfflineFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.ghsOfflineBodPassword).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadGhsOfflineBodPasswords Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_GHS_OFFLINE_BOD_PASSWORDS', () => {
      const action = new actions.LoadGhsOfflineBodPasswords();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.viewGhsOfflineBodPasswordData).toBe(null);
      expect(result.offlineGhsPasswordCount).toBe(null);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing LOAD_GHS_OFFLINE_BOD_PASSWORDS_SUCCESS', () => {
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

      const action = new actions.LoadGhsOfflineBodPasswordsSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.viewGhsOfflineBodPasswordData).toBe(
        action.payload.offlineEghsBodPasswordData
      );
      expect(result.offlineGhsPasswordCount).toBe(action.payload.count);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing LOAD_GHS_OFFLINE_BOD_PASSWORDS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadGhsOfflineBodPasswordsFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.viewGhsOfflineBodPasswordData).toBe(null);
      expect(result.offlineGhsPasswordCount).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing CurrentDayBod Functionality', () => {
    beforeEach(() => {});

    it('Testing CURRENT_DAY_BOD', () => {
      const action = new actions.CurrentDayBod();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.currentDayBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(true);
    });

    it('Testing CURRENT_DAY_BOD_SUCCESS', () => {
      const action = new actions.CurrentDayBodSuccess(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.currentDayBodStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.eodBusinessDate).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('Testing CURRENT_DAY_BOD_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.CurrentDayBodFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.currentDayBodStatus).toBe(BodEodEnum.ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing ClosedBod Functionality', () => {
    beforeEach(() => {});

    it('Testing CLOSED_BOD', () => {
      const action = new actions.ClosedBod();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('Testing CLOSED_BOD_SUCCESS', () => {
      const action = new actions.ClosedBodSuccess(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.closedBusinessDate).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });

    it('Testing CLOSED_BOD_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ClosedBodFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.closedBusinessDate).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing StartEodProcess Functionality', () => {
    beforeEach(() => {});

    it('Testing START_EOD_PROCESS', () => {
      const action = new actions.StartEodProcess();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.isEodProcessStarted).toBe(null);
      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing START_EOD_PROCESS_SUCCESS', () => {
      const action = new actions.StartEodProcessSuccess(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.isEodProcessStarted).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing START_EOD_PROCESS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.StartEodProcessFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.isEodProcessStarted).toBe(null);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing WalkinDetailsCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing WALKIN_DETAILS_COMPLETED', () => {
      const action = new actions.WalkinDetailsCompleted(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.walkInDetailsStatus).toBe(BodEodEnum.PENDING);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing WALKIN_DETAILS_COMPLETED_SUCCESS', () => {
      const responsePayload: WalkInDetailsResponse = {
        conversion: null,
        employeeCode: 'EMP',
        locationCode: 'CPD',
        noOfInvoice: 10,
        walkins: 10
      };

      const action = new actions.WalkinDetailsCompletedSuccess(responsePayload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.walkInDetailsStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP1_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing WALKIN_DETAILS_COMPLETED_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.WalkinDetailsCompletedFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.walkInDetailsStatus).toBe(BodEodEnum.ERROR);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP1_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing PreviousDayGHSBankDepositUpload Functionality', () => {
    beforeEach(() => {});

    it('Testing PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD', () => {
      const action = new actions.PreviousDayGHSBankDepositUpload(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.previousDayGhsBankDepositUploadStatus).toBe(
        BodEodEnum.PENDING
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_SUCCESS', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new actions.PreviousDayGHSBankDepositUploadSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.previousDayGhsBankDepositUploadStatus).toBe(
        BodEodEnum.COMPLETED
      );
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP2_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PreviousDayGHSBankDepositUploadFailure(
        payload
      );
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.previousDayGhsBankDepositUploadStatus).toBe(
        BodEodEnum.ERROR
      );
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP2_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing PreviousDayBankDepositCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing PREVIOUSDAY_BANKDEPOSIT_COMPLETED', () => {
      const requestPayload: BankDepositRequestPayload = {
        businessDate: 123456789,
        remarks: 'remarks',
        skipBanking: false
      };

      const action = new actions.PreviousDayBankDepositCompleted(
        requestPayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.previousDayBankDepositCompletionStatus).toBe(
        BodEodEnum.PENDING
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing PREVIOUSDAY_BANKDEPOSIT_COMPLETED_SUCCESS', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new actions.PreviousDayBankDepositCompletedSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.previousDayBankDepositCompletionStatus).toBe(
        BodEodEnum.COMPLETED
      );
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP3_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing PREVIOUSDAY_BANKDEPOSIT_COMPLETED_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PreviousDayBankDepositCompletedFailure(
        payload
      );
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.previousDayBankDepositCompletionStatus).toBe(
        BodEodEnum.ERROR
      );
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP3_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing PerformRevenueCollection Functionality', () => {
    beforeEach(() => {});

    it('Testing BOUTIQUE_REVENUE_COLLECTION', () => {
      const action = new actions.PerformRevenueCollection(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.boutiqueRevenueCollectionStatus).toBe(BodEodEnum.PENDING);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing BOUTIQUE_REVENUE_COLLECTION_SUCCESS', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new actions.PerformRevenueCollectionSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.boutiqueRevenueCollectionStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP4_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing BOUTIQUE_REVENUE_COLLECTION_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PerformRevenueCollectionFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.boutiqueRevenueCollectionStatus).toBe(BodEodEnum.ERROR);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP4_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing PerformGhsRevenueCollection Functionality', () => {
    beforeEach(() => {});

    it('Testing GHS_REVENUE_COLLECTION', () => {
      const action = new actions.PerformGhsRevenueCollection(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.ghsRevenueCollectionStatus).toBe(BodEodEnum.PENDING);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing GHS_REVENUE_COLLECTION_SUCCESS', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new actions.PerformGhsRevenueCollectionSuccess(
        responsePayload
      );
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.ghsRevenueCollectionStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP5_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing GHS_REVENUE_COLLECTION_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PerformGhsRevenueCollectionFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.ghsRevenueCollectionStatus).toBe(BodEodEnum.ERROR);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP5_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing GHSEodCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing GHS_EOD_ACTIVITY', () => {
      const action = new actions.GHSEodCompleted(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.ghsEodActivityStatus).toBe(BodEodEnum.PENDING);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing GHS_EOD_ACTIVITY_SUCCESS', () => {
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

      const action = new actions.GHSEodCompletedSuccess(responsePayload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.ghsEodActivityStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP6_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing GHS_EOD_ACTIVITY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GHSEodCompletedFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.ghsEodActivityStatus).toBe(BodEodEnum.ERROR);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP6_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing BoutiquePossEodCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing BOUTIQUE_POSS_EOD_ACTIVITY', () => {
      const action = new actions.BoutiquePossEodCompleted(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.INPROGRESS);
      expect(result.boutiquePossEodActivityStatus).toBe(BodEodEnum.PENDING);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing BOUTIQUE_POSS_EOD_ACTIVITY_SUCCESS', () => {
      const action = new actions.BoutiquePossEodCompletedSuccess(123456789);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodProcessStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.boutiquePossEodActivityStatus).toBe(BodEodEnum.COMPLETED);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP7_COMPLETED);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing BOUTIQUE_POSS_EOD_ACTIVITY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.BoutiquePossEodCompletedFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.eodProcessStatus).toBe(BodEodEnum.ERROR);
      expect(result.boutiquePossEodActivityStatus).toBe(BodEodEnum.ERROR);
      expect(result.eodStepsStatus).toBe(BodEodStepsEnum.STEP7_ERROR);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing PerformOfflineEodGhsRevenueCollection Functionality', () => {
    beforeEach(() => {});

    it('Testing OFFLINE_GHS_EOD_REVENUE_COLLECTION', () => {
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

      const action = new actions.PerformOfflineEodGhsRevenueCollection(payload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.offlineGhsEodRevenueCollectionStatus).toBe(
        BodEodEnum.PENDING
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS', () => {
      const action = new actions.PerformOfflineEodGhsRevenueCollectionSuccess();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.offlineGhsEodRevenueCollectionStatus).toBe(
        BodEodEnum.COMPLETED
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing OFFLINE_GHS_EOD_REVENUE_COLLECTION_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PerformOfflineEodGhsRevenueCollectionFailure(
        payload
      );
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.offlineGhsEodRevenueCollectionStatus).toBe(
        BodEodEnum.ERROR
      );
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing MarkEodProcessCompleted Functionality', () => {
    beforeEach(() => {});

    it('Testing MARK_EOD_COMPLETED', () => {
      const action = new actions.MarkEodProcessCompleted();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.eodBusinessDate).toBe(null);
    });
  });

  describe('Testing LoadActiveUserSessions Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_ACTIVE_USER_SESSIONS', () => {
      const action = new actions.LoadActiveUserSessions();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.activeUserSessions).toBe(null);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('Testing LOAD_ACTIVE_USER_SESSIONS_SUCCESS', () => {
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
      const action = new actions.LoadActiveUserSessionsSuccess(requestPayload);
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.activeUserSessions).toBe(action.payload);
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('Testing LOAD_ACTIVE_USER_SESSIONS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadActiveUserSessionsFailure(payload);
      const result: BodEodState = BodEodReducer(initialState, action);
      expect(result.activeUserSessions).toBe(null);
      expect(result.errors).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing Reset Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET', () => {
      const action = new actions.Reset();
      const result: BodEodState = BodEodReducer(initialState, action);

      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.closedBusinessDate).toBe(null);
      expect(result.bodProcessStatus).toBe(BodEodEnum.PENDING);
      expect(result.previousdayEODStatus).toBe(BodEodEnum.PENDING);
      expect(result.isBodProcessStarted).toBe(null);
      expect(result.isEodProcessStarted).toBe(null);
      expect(result.bodBusinessDate).toBe(null);
      expect(result.rateFetchAttempts).toBe(null);
      expect(result.availableMetalRates).toBe(null);
      expect(result.metalRatesAvailableStatus).toBe(BodEodEnum.PENDING);
      expect(result.boutiquePossBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.ghsBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.ghsOfflineBodPassword).toBe(null);
      expect(result.viewGhsOfflineBodPasswordData).toBe(null);
      expect(result.offlineGhsPasswordCount).toBe(null);
      // Eod below
      expect(result.eodProcessStatus).toBe(BodEodEnum.PENDING);
      expect(result.currentDayBodStatus).toBe(BodEodEnum.PENDING);
      expect(result.walkInDetailsStatus).toBe(BodEodEnum.PENDING);
      expect(result.previousDayGhsBankDepositUploadStatus).toBe(
        BodEodEnum.PENDING
      );
      expect(result.previousDayBankDepositCompletionStatus).toBe(
        BodEodEnum.PENDING
      );
      expect(result.boutiqueRevenueCollectionStatus).toBe(BodEodEnum.PENDING);
      expect(result.ghsRevenueCollectionStatus).toBe(BodEodEnum.PENDING);
      expect(result.ghsEodActivityStatus).toBe(BodEodEnum.PENDING);
      expect(result.boutiquePossEodActivityStatus).toBe(BodEodEnum.PENDING);
      expect(result.offlineGhsEodRevenueCollectionStatus).toBe(
        BodEodEnum.PENDING
      );
      expect(result.bodStepsStatus).toBe(null);
      expect(result.eodStepsStatus).toBe(null);
      expect(result.activeUserSessions).toBe(null);
    });
  });
});
