import {
  AvailableMetalRates,
  BankDepositRequestPayload,
  BodBusinessDayResponse,
  BodBusinessDayResponseFormat,
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
import {
  BodEodActionTypes,
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
  MarkBodProcessCompleted,
  MarkEodProcessCompleted,
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
  Reset,
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

describe('BOD-EOD Process Actions Testing Suite', () => {
  describe('PreviousDayEod Test Cases', () => {
    it('should PreviousDayEod action ', () => {
      const action = new PreviousDayEod();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUS_DAY_EOD
      });
    });

    it('should check correct type is used for PreviousDayEodSuccess action ', () => {
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

      const action = new PreviousDayEodSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUS_DAY_EOD_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  PreviousDayEodFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PreviousDayEodFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUS_DAY_EOD_FAILURE,
        payload: payload
      });
    });
  });

  describe('StartBodProcess Test Cases', () => {
    it('should StartBodProcess action ', () => {
      const action = new StartBodProcess();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.START_BOD_PROCESS
      });
    });

    it('should check correct type is used for StartBodProcessSuccess action ', () => {
      const responsePayload = 123456789;
      const action = new StartBodProcessSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.START_BOD_PROCESS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  StartBodProcessFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new StartBodProcessFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.START_BOD_PROCESS_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadAvailableMetalRatesForBusinessDay Test Cases', () => {
    it('should LoadAvailableMetalRatesForBusinessDay action ', () => {
      const payload: MetalRatesRequestFormat = {
        businessDate: 123456789,
        isRetryAttempted: false
      };

      const action = new LoadAvailableMetalRatesForBusinessDay(payload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY,
        payload: payload
      });
    });

    it('should check correct type is used for LoadAvailableMetalRatesForBusinessDaySuccess action ', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: 50000,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: true
      };

      const action = new LoadAvailableMetalRatesForBusinessDaySuccess(
        responsePayload
      );

      expect({ ...action }).toEqual({
        type:
          BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for LoadAvailableMetalRatesForBusinessDayFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableMetalRatesForBusinessDayFailure(payload);
      expect({ ...action }).toEqual({
        type:
          BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadMetalRatesForBusinessDay Test Cases', () => {
    it('should LoadMetalRatesForBusinessDay action ', () => {
      const payload = 123456789;

      const action = new LoadMetalRatesForBusinessDay(payload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY,
        payload: payload
      });
    });

    it('should check correct type is used for LoadMetalRatesForBusinessDaySuccess action ', () => {
      const availableMetalRates: AvailableMetalRates = {
        goldRate: 50000,
        platinumRate: null,
        silverRate: null
      };
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: availableMetalRates,
        goldRateAvailable: true
      };

      const action = new LoadMetalRatesForBusinessDaySuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for LoadMetalRatesForBusinessDayFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalRatesForBusinessDayFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE,
        payload: payload
      });
    });
  });

  describe('BoutiquePossBodCompleted Test Cases', () => {
    it('should BoutiquePossBodCompleted action ', () => {
      const payload = 123456789;

      const action = new BoutiquePossBodCompleted(payload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED,
        payload: payload
      });
    });

    it('should check correct type is used for BoutiquePossBodCompletedSuccess action ', () => {
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

      const action = new BoutiquePossBodCompletedSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for BoutiquePossBodCompletedFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new BoutiquePossBodCompletedFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED_FAILURE,
        payload: payload
      });
    });
  });

  describe('GhsBodCompleted Test Cases', () => {
    it('should GhsBodCompleted action ', () => {
      const payload = 123456789;

      const action = new GhsBodCompleted(payload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_BOD,
        payload: payload
      });
    });

    it('should check correct type is used for GhsBodCompletedSuccess action ', () => {
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

      const action = new GhsBodCompletedSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_BOD_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for GhsBodCompletedFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GhsBodCompletedFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_BOD_FAILURE,
        payload: payload
      });
    });
  });

  describe('MarkBodProcessCompleted Test Cases', () => {
    it('should MarkBodProcessCompleted action ', () => {
      const action = new MarkBodProcessCompleted();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.MARK_BOD_COMPLETED
      });
    });
  });

  describe('GeneratePasswordForEghsOffline Test Cases', () => {
    it('should GeneratePasswordForEghsOffline action ', () => {
      const payload = 123456789;

      const action = new GeneratePasswordForEghsOffline(payload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE,
        payload: payload
      });
    });

    it('should check correct type is used for GeneratePasswordForEghsOfflineSuccess action ', () => {
      const responsePayload: EghsBodGeneratedPassword = {
        contextType: '',
        goldRate: 50000,
        locationCode: 'CPD',
        password: 'password',
        passwordDate: ' passwordDate'
      };

      const action = new GeneratePasswordForEghsOfflineSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for GeneratePasswordForEghsOfflineFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GeneratePasswordForEghsOfflineFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadGhsOfflineBodPasswords Test Cases', () => {
    it('should LoadGhsOfflineBodPasswords action ', () => {
      const action = new LoadGhsOfflineBodPasswords();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS
      });
    });

    it('should check correct type is used for LoadGhsOfflineBodPasswordsSuccess action ', () => {
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

      const action = new LoadGhsOfflineBodPasswordsSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for LoadGhsOfflineBodPasswordsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGhsOfflineBodPasswordsFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS_FAILURE,
        payload: payload
      });
    });
  });

  /*Eod Related Actions*/

  describe('CurrentDayBod Test Cases', () => {
    it('should CurrentDayBod action ', () => {
      const action = new CurrentDayBod();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.CURRENT_DAY_BOD
      });
    });

    it('should check correct type is used for CurrentDayBodSuccess action ', () => {
      const responsePayload = 123456789;

      const action = new CurrentDayBodSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.CURRENT_DAY_BOD_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for CurrentDayBodFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CurrentDayBodFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.CURRENT_DAY_BOD_FAILURE,
        payload: payload
      });
    });
  });

  describe('ClosedBod Test Cases', () => {
    it('should ClosedBod action ', () => {
      const action = new ClosedBod();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.CLOSED_BOD
      });
    });

    it('should check correct type is used for ClosedBodSuccess action ', () => {
      const responsePayload = 123456789;

      const action = new ClosedBodSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.CLOSED_BOD_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for ClosedBodFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ClosedBodFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.CLOSED_BOD_FAILURE,
        payload: payload
      });
    });
  });

  describe('StartEodProcess Test Cases', () => {
    it('should StartEodProcess action ', () => {
      const action = new StartEodProcess();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.START_EOD_PROCESS
      });
    });

    it('should check correct type is used for StartEodProcessSuccess action ', () => {
      const responsePayload = 123456789;

      const action = new StartEodProcessSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.START_EOD_PROCESS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for StartEodProcessFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new StartEodProcessFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.START_EOD_PROCESS_FAILURE,
        payload: payload
      });
    });
  });

  describe('WalkinDetailsCompleted Test Cases', () => {
    it('should WalkinDetailsCompleted action ', () => {
      const requestPayload = 123456789;

      const action = new WalkinDetailsCompleted(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.WALKIN_DETAILS_COMPLETED,
        payload: requestPayload
      });
    });

    it('should check correct type is used for WalkinDetailsCompletedSuccess action ', () => {
      const responsePayload: WalkInDetailsResponse = {
        conversion: null,
        employeeCode: 'EMP',
        locationCode: 'CPD',
        noOfInvoice: 10,
        walkins: 10
      };

      const action = new WalkinDetailsCompletedSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.WALKIN_DETAILS_COMPLETED_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for WalkinDetailsCompletedFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new WalkinDetailsCompletedFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.WALKIN_DETAILS_COMPLETED_FAILURE,
        payload: payload
      });
    });
  });

  describe('PreviousDayGHSBankDepositUpload Test Cases', () => {
    it('should PreviousDayGHSBankDepositUpload action ', () => {
      const requestPayload = 123456789;

      const action = new PreviousDayGHSBankDepositUpload(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD,
        payload: requestPayload
      });
    });

    it('should check correct type is used for PreviousDayGHSBankDepositUploadSuccess action ', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PreviousDayGHSBankDepositUploadSuccess(
        responsePayload
      );

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for PreviousDayGHSBankDepositUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PreviousDayGHSBankDepositUploadFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_FAILURE,
        payload: payload
      });
    });
  });

  describe('PreviousDayBankDepositCompleted Test Cases', () => {
    it('should PreviousDayBankDepositCompleted action ', () => {
      const requestPayload: BankDepositRequestPayload = {
        businessDate: 123456789,
        remarks: 'remarks',
        skipBanking: false
      };

      const action = new PreviousDayBankDepositCompleted(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED,
        payload: requestPayload
      });
    });

    it('should check correct type is used for PreviousDayBankDepositCompletedSuccess action ', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PreviousDayBankDepositCompletedSuccess(
        responsePayload
      );

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for PreviousDayBankDepositCompletedFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PreviousDayBankDepositCompletedFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED_FAILURE,
        payload: payload
      });
    });
  });

  describe('PerformRevenueCollection Test Cases', () => {
    it('should PerformRevenueCollection action ', () => {
      const requestPayload = 123456789;

      const action = new PerformRevenueCollection(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION,
        payload: requestPayload
      });
    });

    it('should check correct type is used for PerformRevenueCollectionSuccess action ', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PerformRevenueCollectionSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for PerformRevenueCollectionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PerformRevenueCollectionFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION_FAILURE,
        payload: payload
      });
    });
  });

  describe('PerformGhsRevenueCollection Test Cases', () => {
    it('should PerformGhsRevenueCollection action ', () => {
      const requestPayload = 123456789;

      const action = new PerformGhsRevenueCollection(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_REVENUE_COLLECTION,
        payload: requestPayload
      });
    });

    it('should check correct type is used for PerformGhsRevenueCollectionSuccess action ', () => {
      const responsePayload: GhsFileUploadResponse = {
        status: true
      };

      const action = new PerformGhsRevenueCollectionSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_REVENUE_COLLECTION_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for PerformGhsRevenueCollectionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PerformGhsRevenueCollectionFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_REVENUE_COLLECTION_FAILURE,
        payload: payload
      });
    });
  });

  describe('GHSEodCompleted Test Cases', () => {
    it('should GHSEodCompleted action ', () => {
      const requestPayload = 123456789;

      const action = new GHSEodCompleted(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_EOD_ACTIVITY,
        payload: requestPayload
      });
    });

    it('should check correct type is used for GHSEodCompletedSuccess action ', () => {
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

      const action = new GHSEodCompletedSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_EOD_ACTIVITY_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for GHSEodCompletedFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GHSEodCompletedFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.GHS_EOD_ACTIVITY_FAILURE,
        payload: payload
      });
    });
  });

  describe('BoutiquePossEodCompleted Test Cases', () => {
    it('should BoutiquePossEodCompleted action ', () => {
      const requestPayload = 123456789;

      const action = new BoutiquePossEodCompleted(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY,
        payload: requestPayload
      });
    });

    it('should check correct type is used for BoutiquePossEodCompletedSuccess action ', () => {
      const action = new BoutiquePossEodCompletedSuccess(123456789);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY_SUCCESS,
        payload: 123456789
      });
    });

    it('should check correct type is used for BoutiquePossEodCompletedFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new BoutiquePossEodCompletedFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY_FAILURE,
        payload: payload
      });
    });
  });

  describe('PerformOfflineEodGhsRevenueCollection Test Cases', () => {
    it('should PerformOfflineEodGhsRevenueCollection action ', () => {
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

      const action = new PerformOfflineEodGhsRevenueCollection(payload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION,
        payload: payload
      });
    });

    it('should check correct type is used for PerformOfflineEodGhsRevenueCollectionSuccess action ', () => {
      const action = new PerformOfflineEodGhsRevenueCollectionSuccess();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS
      });
    });

    it('should check correct type is used for PerformOfflineEodGhsRevenueCollectionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PerformOfflineEodGhsRevenueCollectionFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION_FAILURE,
        payload: payload
      });
    });
  });

  describe('MarkEodProcessCompleted Test Cases', () => {
    it('should MarkEodProcessCompleted action ', () => {
      const action = new MarkEodProcessCompleted();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.MARK_EOD_COMPLETED
      });
    });
  });

  describe('LoadActiveUserSessions Test Cases', () => {
    it('should LoadActiveUserSessions action ', () => {
      const action = new LoadActiveUserSessions();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS
      });
    });

    it('should check correct type is used for LoadActiveUserSessionsSuccess action ', () => {
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

      const action = new LoadActiveUserSessionsSuccess(requestPayload);

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS_SUCCESS,
        payload: requestPayload
      });
    });

    it('should check correct type is used for LoadActiveUserSessionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadActiveUserSessionsFailure(payload);
      expect({ ...action }).toEqual({
        type: BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS_FAILURE,
        payload: payload
      });
    });
  });

  describe('Reset Test Cases', () => {
    it('should Reset action ', () => {
      const action = new Reset();

      expect({ ...action }).toEqual({
        type: BodEodActionTypes.RESET
      });
    });
  });
});
