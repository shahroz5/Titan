import {
  AvailableMetalRates,
  BodEodEnum,
  BodEodStepsEnum,
  CustomErrors,
  EghsBodGeneratedPassword,
  EghsBodPasswordsListingResponse,
  UsersActiveSessionsResults
} from '@poss-web/shared/models';
import { initialState } from './bod-eod.reducer';
import * as selectors from './bod-eod.selectors';
import { BodEodState } from './bod-eod.state';

describe('BOD-EOD Process Selector Testing Suite', () => {
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };

    const state: BodEodState = {
      ...initialState,
      errors: customErrors
    };
    expect(selectors.bodEodSelectors.selectError.projector(state)).toEqual(
      customErrors
    );
  });

  it('Testing selectIsLoading selector', () => {
    const state: BodEodState = {
      ...initialState,
      isLoading: true
    };
    expect(selectors.bodEodSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });
  it('Testing selectBodProcessStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      bodProcessStatus: BodEodEnum.PENDING
    };
    expect(
      selectors.bodEodSelectors.selectBodProcessStatus.projector(state)
    ).toEqual(BodEodEnum.PENDING);
  });
  it('Testing selectEodProcessStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      eodProcessStatus: BodEodEnum.PENDING
    };
    expect(
      selectors.bodEodSelectors.selectEodProcessStatus.projector(state)
    ).toEqual(BodEodEnum.PENDING);
  });
  it('Testing selectPreviousdayEodStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      previousdayEODStatus: BodEodEnum.PENDING
    };
    expect(
      selectors.bodEodSelectors.selectPreviousdayEodStatus.projector(state)
    ).toEqual(BodEodEnum.PENDING);
  });
  it('Testing selectBodBusinessDate selector', () => {
    const state: BodEodState = {
      ...initialState,
      bodBusinessDate: 123456789
    };
    expect(
      selectors.bodEodSelectors.selectBodBusinessDate.projector(state)
    ).toEqual(123456789);
  });
  it('Testing selectClosedBusinessDate selector', () => {
    const state: BodEodState = {
      ...initialState,
      closedBusinessDate: 123456789
    };
    expect(
      selectors.bodEodSelectors.selectClosedBusinessDate.projector(state)
    ).toEqual(123456789);
  });
  it('Testing selectRateFetchAttempts selector', () => {
    const state: BodEodState = {
      ...initialState,
      rateFetchAttempts: 2
    };
    expect(
      selectors.bodEodSelectors.selectRateFetchAttempts.projector(state)
    ).toEqual(2);
  });
  it('Testing selectIsBodProcessStarted selector', () => {
    const state: BodEodState = {
      ...initialState,
      isBodProcessStarted: true
    };
    expect(
      selectors.bodEodSelectors.selectIsBodProcessStarted.projector(state)
    ).toEqual(true);
  });
  it('Testing selectIsEodProcessStarted selector', () => {
    const state: BodEodState = {
      ...initialState,
      isEodProcessStarted: true
    };
    expect(
      selectors.bodEodSelectors.selectIsEodProcessStarted.projector(state)
    ).toEqual(true);
  });
  it('Testing selectAvailableMetalRates selector', () => {
    const availableMetalRates: AvailableMetalRates = {
      goldRate: 50000,
      platinumRate: null,
      silverRate: null
    };

    const state: BodEodState = {
      ...initialState,
      availableMetalRates: availableMetalRates
    };
    expect(
      selectors.bodEodSelectors.selectAvailableMetalRates.projector(state)
    ).toEqual(availableMetalRates);
  });
  it('Testing selectGoldRate selector when metal Rates are not available', () => {
    const availableMetalRates: AvailableMetalRates = null;

    const state: BodEodState = {
      ...initialState,
      availableMetalRates: availableMetalRates
    };
    expect(selectors.bodEodSelectors.selectGoldRate.projector(state)).toEqual(
      null
    );
  });
  it('Testing selectGoldRate selector when Gold Rate is available', () => {
    const availableMetalRates: AvailableMetalRates = {
      goldRate: 50000,
      platinumRate: null,
      silverRate: null
    };

    const state: BodEodState = {
      ...initialState,
      availableMetalRates: availableMetalRates
    };
    expect(selectors.bodEodSelectors.selectGoldRate.projector(state)).toEqual(
      50000
    );
  });
  it('Testing selectGoldRate selector when Gold Rate is not available', () => {
    const availableMetalRates: AvailableMetalRates = {
      goldRate: null,
      platinumRate: null,
      silverRate: null
    };

    const state: BodEodState = {
      ...initialState,
      availableMetalRates: availableMetalRates
    };
    expect(selectors.bodEodSelectors.selectGoldRate.projector(state)).toEqual(
      null
    );
  });
  it('Testing selectIsGoldRateAvailable selector', () => {
    const state: BodEodState = {
      ...initialState,
      isGoldRateAvailable: true
    };
    expect(
      selectors.bodEodSelectors.selectIsGoldRateAvailable.projector(state)
    ).toEqual(true);
  });
  it('Testing selectMetalRatesAvailableStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      metalRatesAvailableStatus: BodEodEnum.AVAILABLE
    };
    expect(
      selectors.bodEodSelectors.selectMetalRatesAvailableStatus.projector(state)
    ).toEqual(BodEodEnum.AVAILABLE);
  });
  it('Testing selectBoutiquePossBodStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      boutiquePossBodStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectBoutiquePossBodStatus.projector(state)
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectGhsBodStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      ghsBodStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectGhsBodStatus.projector(state)
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectGhsOfflineBodPassword selector', () => {
    const state: BodEodState = {
      ...initialState,
      ghsOfflineBodPassword: 'password'
    };
    expect(
      selectors.bodEodSelectors.selectGhsOfflineBodPassword.projector(state)
    ).toEqual('password');
  });
  it('Testing selectCurrentDayBodStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      currentDayBodStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectCurrentDayBodStatus.projector(state)
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectEodBusinessDate selector', () => {
    const state: BodEodState = {
      ...initialState,
      eodBusinessDate: 123456789
    };
    expect(
      selectors.bodEodSelectors.selectEodBusinessDate.projector(state)
    ).toEqual(123456789);
  });
  it('Testing selectWalkInDetailsStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      walkInDetailsStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectWalkInDetailsStatus.projector(state)
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectGhsBankDepositUploadStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      previousDayGhsBankDepositUploadStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectGhsBankDepositUploadStatus.projector(
        state
      )
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectBoutiqueBankDepositStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      previousDayBankDepositCompletionStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectBoutiqueBankDepositStatus.projector(state)
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectBoutiqueRevenueCollectionStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      boutiqueRevenueCollectionStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectBoutiqueRevenueCollectionStatus.projector(
        state
      )
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectGhsRevenueCollectionStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      ghsRevenueCollectionStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectGhsRevenueCollectionStatus.projector(
        state
      )
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectGhsEodActivityStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      ghsEodActivityStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectGhsEodActivityStatus.projector(state)
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectBoutiquePossEodActivityStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      boutiquePossEodActivityStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectBoutiquePossEodActivityStatus.projector(
        state
      )
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectOfflineGhsEodRevenueCollectionStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      offlineGhsEodRevenueCollectionStatus: BodEodEnum.COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectOfflineGhsEodRevenueCollectionStatus.projector(
        state
      )
    ).toEqual(BodEodEnum.COMPLETED);
  });
  it('Testing selectBodStepsStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      bodStepsStatus: BodEodStepsEnum.STEP3_COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectBodStepsStatus.projector(state)
    ).toEqual(BodEodStepsEnum.STEP3_COMPLETED);
  });
  it('Testing selectEodStepsStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      eodStepsStatus: BodEodStepsEnum.STEP1_COMPLETED
    };
    expect(
      selectors.bodEodSelectors.selectEodStepsStatus.projector(state)
    ).toEqual(BodEodStepsEnum.STEP1_COMPLETED);
  });
  it('Testing selectOfflineEghsPasswordsListing selector', () => {
    const offlineEghsBodPasswordResponse: EghsBodGeneratedPassword[] = [
      {
        contextType: '',
        goldRate: 50000,
        locationCode: 'CPD',
        password: 'password',
        passwordDate: ' passwordDate'
      }
    ];

    const state: BodEodState = {
      ...initialState,
      viewGhsOfflineBodPasswordData: offlineEghsBodPasswordResponse
    };
    expect(
      selectors.bodEodSelectors.selectOfflineEghsPasswordsListing.projector(
        state
      )
    ).toEqual(offlineEghsBodPasswordResponse);
  });
  it('Testing selectofflineGhsPasswordCount selector', () => {
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

    const state: BodEodState = {
      ...initialState,
      offlineGhsPasswordCount: responsePayload.count
    };
    expect(
      selectors.bodEodSelectors.selectofflineGhsPasswordCount.projector(state)
    ).toEqual(responsePayload.count);
  });

  it('Testing selectActiveUserSessions selector', () => {
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

    const state: BodEodState = {
      ...initialState,
      activeUserSessions: requestPayload
    };
    expect(
      selectors.bodEodSelectors.selectActiveUserSessions.projector(state)
    ).toEqual(requestPayload);
  });
});
