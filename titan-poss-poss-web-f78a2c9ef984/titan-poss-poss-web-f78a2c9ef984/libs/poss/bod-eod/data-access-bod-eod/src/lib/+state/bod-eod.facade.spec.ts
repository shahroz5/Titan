import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  BankDepositRequestPayload,
  BodBusinessDayResponse,
  BodEodEnum,
  CustomErrors,
  MetalRatesRequestFormat,
  OfflineGhsEodRevenueCollection
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BoutiquePossBodCompleted,
  BoutiquePossBodCompletedSuccess,
  BoutiquePossEodCompleted,
  ClosedBod,
  CurrentDayBod,
  GeneratePasswordForEghsOffline,
  GhsBodCompleted,
  GHSEodCompleted,
  LoadActiveUserSessions,
  LoadAvailableMetalRatesForBusinessDay,
  LoadAvailableMetalRatesForBusinessDayFailure,
  LoadGhsOfflineBodPasswords,
  LoadMetalRatesForBusinessDay,
  MarkBodProcessCompleted,
  MarkEodProcessCompleted,
  PerformGhsRevenueCollection,
  PerformGhsRevenueCollectionSuccess,
  PerformOfflineEodGhsRevenueCollection,
  PerformRevenueCollection,
  PreviousDayBankDepositCompleted,
  PreviousDayEod,
  PreviousDayGHSBankDepositUpload,
  Reset,
  StartBodProcess,
  StartEodProcess,
  WalkinDetailsCompleted
} from './bod-eod.actions';
import { BodEodFacade } from './bod-eod.facade';
import { BodEodState } from './bod-eod.state';

describe('BOD-EOD Process Facade Testing Suite', () => {
  const initialState: BodEodState = {
    errors: null,
    isLoading: false,
    closedBusinessDate: null,
    bodProcessStatus: BodEodEnum.PENDING,
    previousdayEODStatus: BodEodEnum.PENDING,
    isBodProcessStarted: null,
    isEodProcessStarted: null,
    bodBusinessDate: null,
    rateFetchAttempts: null,
    availableMetalRates: null,
    isGoldRateAvailable: false,
    metalRatesAvailableStatus: BodEodEnum.PENDING,

    boutiquePossBodStatus: BodEodEnum.PENDING,
    ghsBodStatus: BodEodEnum.PENDING,
    ghsOfflineBodPassword: null,
    viewGhsOfflineBodPasswordData: null,
    offlineGhsPasswordCount: null,
    // Eod below
    eodProcessStatus: BodEodEnum.PENDING,
    currentDayBodStatus: BodEodEnum.PENDING,
    eodBusinessDate: null,
    walkInDetailsStatus: BodEodEnum.PENDING,
    previousDayGhsBankDepositUploadStatus: BodEodEnum.PENDING,
    previousDayBankDepositCompletionStatus: BodEodEnum.PENDING,
    boutiqueRevenueCollectionStatus: BodEodEnum.PENDING,
    ghsRevenueCollectionStatus: BodEodEnum.PENDING,
    ghsEodActivityStatus: BodEodEnum.PENDING,
    boutiquePossEodActivityStatus: BodEodEnum.PENDING,
    offlineGhsEodRevenueCollectionStatus: BodEodEnum.PENDING,
    bodStepsStatus: null,
    eodStepsStatus: null,
    activeUserSessions: null
  };

  let bodEodFacade: BodEodFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BodEodFacade]
    });

    bodEodFacade = TestBed.inject(BodEodFacade);
  });

  it('should dispatch PreviousDayEod action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new PreviousDayEod();

    bodEodFacade.loadPreviousDayEodStatus();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch StartBodProcess action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new StartBodProcess();

    bodEodFacade.startBodProcess();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch BoutiquePossBodCompletedSuccess action', inject(
    [Store],
    store => {
      const payload: BodBusinessDayResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        id: '1',
        isGHSBODDone: true,
        isGHSEODDone: true,
        locationCode: 'CPD',
        remarks: 'remarks',
        skipBanking: false,
        status: 'OPEN'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new BoutiquePossBodCompletedSuccess(payload);

      bodEodFacade.boutiquePossBodCompletedSuccess(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadAvailableMetalRatesForBusinessDay action', inject(
    [Store],
    store => {
      const payload: MetalRatesRequestFormat = {
        businessDate: 123456789,
        isRetryAttempted: false
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadAvailableMetalRatesForBusinessDay(payload);

      bodEodFacade.loadAvailableMetalRatesForBusinessDay(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadMetalRatesForBusinessDay action', inject(
    [Store],
    store => {
      const payload = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadMetalRatesForBusinessDay(payload);

      bodEodFacade.loadMetalRatesForBusinessDay(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch BoutiquePossBodCompleted action', inject(
    [Store],
    store => {
      const businessDate = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new BoutiquePossBodCompleted(businessDate);

      bodEodFacade.checkIfBoutiquePossBodCompleted(businessDate);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch MarkBodProcessCompleted action', inject(
    [Store],
    store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new MarkBodProcessCompleted();

      bodEodFacade.markBodProcessCompleted();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch MarkEodProcessCompleted action', inject(
    [Store],
    store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new MarkEodProcessCompleted();

      bodEodFacade.markEodProcessCompleted();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadAvailableMetalRatesForBusinessDayFailure action', inject(
    [Store],
    store => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadAvailableMetalRatesForBusinessDayFailure(
        payload
      );

      bodEodFacade.partialUpdateForMetalRates(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch GhsBodCompleted action', inject([Store], store => {
    const payload = 123456789;

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new GhsBodCompleted(payload);

    bodEodFacade.checkIfGhsBodCompleted(payload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch GeneratePasswordForEghsOffline action', inject(
    [Store],
    store => {
      const payload = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GeneratePasswordForEghsOffline(payload);

      bodEodFacade.generatePasswordForEghsOffline(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadGhsOfflineBodPasswords action', inject(
    [Store],
    store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadGhsOfflineBodPasswords();

      bodEodFacade.loadGhsOfflineBodPasswords();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch StartEodProcess action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new StartEodProcess();

    bodEodFacade.startEodProcess();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch CurrentDayBod action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new CurrentDayBod();

    bodEodFacade.loadCurrentDayBodStatus();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch WalkinDetailsCompleted action', inject([Store], store => {
    const businessDate = 123456789;

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new WalkinDetailsCompleted(businessDate);

    bodEodFacade.checkIfWalkinDetailsCompleted(businessDate);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch PreviousDayGHSBankDepositUpload action', inject(
    [Store],
    store => {
      const businessDate = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new PreviousDayGHSBankDepositUpload(businessDate);

      bodEodFacade.checkPreviousDayGhsDepositUploaded(businessDate);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch PreviousDayBankDepositCompleted action', inject(
    [Store],
    store => {
      const payload: BankDepositRequestPayload = {
        businessDate: 123456789,
        remarks: 'remarks',
        skipBanking: false
      };

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new PreviousDayBankDepositCompleted(payload);

      bodEodFacade.checkPreviousDayBankDeposit(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch PerformRevenueCollection action', inject(
    [Store],
    store => {
      const businessDate = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new PerformRevenueCollection(businessDate);

      bodEodFacade.performBoutiqueRevenueCollection(businessDate);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch PerformGhsRevenueCollection action', inject(
    [Store],
    store => {
      const businessDate = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new PerformGhsRevenueCollection(businessDate);

      bodEodFacade.performGhsRevenueCollection(businessDate);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch PerformGhsRevenueCollectionSuccess action', inject(
    [Store],
    store => {
      const payload = {
        status: true
      };

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new PerformGhsRevenueCollectionSuccess(payload);

      bodEodFacade.performGhsRevenueCollectionSuccess(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch GHSEodCompleted action', inject([Store], store => {
    const businessDate = 123456789;

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new GHSEodCompleted(businessDate);

    bodEodFacade.performGhsEodActivity(businessDate);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch BoutiquePossEodCompleted action', inject(
    [Store],
    store => {
      const businessDate = 123456789;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new BoutiquePossEodCompleted(businessDate);

      bodEodFacade.performBoutiqueEodActivity(businessDate);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch PerformOfflineEodGhsRevenueCollection action', inject(
    [Store],
    store => {
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

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new PerformOfflineEodGhsRevenueCollection(payload);

      bodEodFacade.performOfflineEodGhsRevenueCollection(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch LoadActiveUserSessions action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadActiveUserSessions();

    bodEodFacade.loadActiveUserSessions();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch ClosedBod action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new ClosedBod();

    bodEodFacade.loadClosedBod();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch Reset action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new Reset();

    bodEodFacade.resetState();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should access getClosedBod() selector action', () => {
    expect(bodEodFacade.getClosedBod()).toEqual(
      bodEodFacade['closedBusinessDate$']
    );
  });
  it('should access getError() selector action', () => {
    expect(bodEodFacade.getError()).toEqual(bodEodFacade['error$']);
  });
  it('should access getIsLoading() selector action', () => {
    expect(bodEodFacade.getIsLoading()).toEqual(bodEodFacade['isLoading$']);
  });
  it('should access getBodProcessStatus() selector action', () => {
    expect(bodEodFacade.getBodProcessStatus()).toEqual(
      bodEodFacade['bodProcessStatus$']
    );
  });
  it('should access getEodProcessStatus() selector action', () => {
    expect(bodEodFacade.getEodProcessStatus()).toEqual(
      bodEodFacade['eodProcessStatus$']
    );
  });
  it('should access getPreviousdayEodStatus() selector action', () => {
    expect(bodEodFacade.getPreviousdayEodStatus()).toEqual(
      bodEodFacade['previousdayEodStatus$']
    );
  });
  it('should access getBodBusinessDate() selector action', () => {
    expect(bodEodFacade.getBodBusinessDate()).toEqual(
      bodEodFacade['bodBusinessDate$']
    );
  });
  it('should access getRateFetchAttempts() selector action', () => {
    expect(bodEodFacade.getRateFetchAttempts()).toEqual(
      bodEodFacade['rateFetchAttempts$']
    );
  });
  it('should access isBodProcessStarted() selector action', () => {
    expect(bodEodFacade.isBodProcessStarted()).toEqual(
      bodEodFacade['bodProcessStarted$']
    );
  });
  it('should access isEodProcessStarted() selector action', () => {
    expect(bodEodFacade.isEodProcessStarted()).toEqual(
      bodEodFacade['isEodProcessStarted$']
    );
  });
  it('should access getAvailableMetalRates() selector action', () => {
    expect(bodEodFacade.getAvailableMetalRates()).toEqual(
      bodEodFacade['availableMetalRates$']
    );
  });
  it('should access getGoldRate() selector action', () => {
    expect(bodEodFacade.getGoldRate()).toEqual(bodEodFacade['goldRate$']);
  });
  it('should access getGoldRateAvailablityStatus() selector action', () => {
    expect(bodEodFacade.getGoldRateAvailablityStatus()).toEqual(
      bodEodFacade['isGoldRateAvailable$']
    );
  });
  it('should access getMetalRatesAvailableStatus() selector action', () => {
    expect(bodEodFacade.getMetalRatesAvailableStatus()).toEqual(
      bodEodFacade['metalRatesAvailableStatus$']
    );
  });
  it('should access getBoutiquePossBodStatus() selector action', () => {
    expect(bodEodFacade.getBoutiquePossBodStatus()).toEqual(
      bodEodFacade['boutiquePossBodStatus$']
    );
  });
  it('should access getGhsBodStatus() selector action', () => {
    expect(bodEodFacade.getGhsBodStatus()).toEqual(
      bodEodFacade['ghsBodStatus$']
    );
  });
  it('should access getGhsOfflineBodPassword() selector action', () => {
    expect(bodEodFacade.getGhsOfflineBodPassword()).toEqual(
      bodEodFacade['getGhsOfflineBodPassword$']
    );
  });
  it('should access getCurrentDayBodStatus() selector action', () => {
    expect(bodEodFacade.getCurrentDayBodStatus()).toEqual(
      bodEodFacade['currentDayBodStatus$']
    );
  });
  it('should access getBusinessDayDate() selector action', () => {
    expect(bodEodFacade.getBusinessDayDate()).toEqual(
      bodEodFacade['eodBusinessDate$']
    );
  });
  it('should access getEodBusinessDate() selector action', () => {
    expect(bodEodFacade.getEodBusinessDate()).toEqual(
      bodEodFacade['eodBusinessDate$']
    );
  });
  it('should access getWalkInDetailsStatus() selector action', () => {
    expect(bodEodFacade.getWalkInDetailsStatus()).toEqual(
      bodEodFacade['walkInDetailsStatus$']
    );
  });
  it('should access getGhsBankDepositUploadStatus() selector action', () => {
    expect(bodEodFacade.getGhsBankDepositUploadStatus()).toEqual(
      bodEodFacade['ghsBankDepositUploadStatus$']
    );
  });
  it('should access getBoutiqueBankDepositStatus() selector action', () => {
    expect(bodEodFacade.getBoutiqueBankDepositStatus()).toEqual(
      bodEodFacade['boutiqueBankDepositStatus$']
    );
  });
  it('should access getBoutiqueRevenueCollectionStatus() selector action', () => {
    expect(bodEodFacade.getBoutiqueRevenueCollectionStatus()).toEqual(
      bodEodFacade['boutiqueRevenueCollectionStatus$']
    );
  });
  it('should access getGhsRevenueCollectionStatus() selector action', () => {
    expect(bodEodFacade.getGhsRevenueCollectionStatus()).toEqual(
      bodEodFacade['ghsRevenueCollectionStatus$']
    );
  });
  it('should access getGhsEodActivityStatus() selector action', () => {
    expect(bodEodFacade.getGhsEodActivityStatus()).toEqual(
      bodEodFacade['ghsEodActivityStatus$']
    );
  });
  it('should access getBoutiquePossEodActivityStatus() selector action', () => {
    expect(bodEodFacade.getBoutiquePossEodActivityStatus()).toEqual(
      bodEodFacade['boutiquePossEodActivityStatus$']
    );
  });
  it('should access getOfflineGhsEODrevenueCollectionStatus() selector action', () => {
    expect(bodEodFacade.getOfflineGhsEODrevenueCollectionStatus()).toEqual(
      bodEodFacade['offlineGhsEodRevenueCollectionStatus$']
    );
  });
  it('should access getBodStepsStatus() selector action', () => {
    expect(bodEodFacade.getBodStepsStatus()).toEqual(
      bodEodFacade['bodStepsStatus$']
    );
  });
  it('should access getEodStepsStatus() selector action', () => {
    expect(bodEodFacade.getEodStepsStatus()).toEqual(
      bodEodFacade['eodStepsStatus$']
    );
  });
  it('should access getOfflineEghsPasswordsList() selector action', () => {
    expect(bodEodFacade.getOfflineEghsPasswordsList()).toEqual(
      bodEodFacade['offlineEghsPasswordsListing$']
    );
  });
  it('should access getOfflineGhsPasswordCount() selector action', () => {
    expect(bodEodFacade.getOfflineGhsPasswordCount()).toEqual(
      bodEodFacade['offlineGhsPasswordCount$']
    );
  });
  it('should access getActiveUserSessions() selector action', () => {
    expect(bodEodFacade.getActiveUserSessions()).toEqual(
      bodEodFacade['activeUserSessions$']
    );
  });
});
