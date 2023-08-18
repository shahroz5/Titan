import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BodEodFacade } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  BodEodEnum,
  BodEodTypesEnum,
  CustomErrors,
  LocationSettingAttributesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PossHomeKeyEnum,
  UsersActiveSessionsResults
} from '@poss-web/shared/models';
import { getHomePageUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { BodEodProcessService } from '../bod-eod-process.service';

@Component({
  selector: 'poss-web-bod-eod',
  templateUrl: './bod-eod.component.html',
  styleUrls: ['./bod-eod.component.scss']
})
export class BodEodComponent implements OnInit, OnDestroy {
  bodEodTypesEnum = BodEodTypesEnum;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  error$: Observable<any>;
  isLoading$: Observable<boolean>;

  // Location Settings Configurations
  isWalkInMandatory$: Observable<string>;
  isBankingMandatory$: Observable<string>;
  isGhsMandatory$: Observable<string>;
  isServiceMandatory$: Observable<string>;
  locationCode$: Observable<string>;
  maxMetalRateRetryAttempts$: Observable<string>;
  metalRateRetryAttempts$: Observable<number>;
  /*Bod Process*/
  metalRatesAvailableStatus$: Observable<string>;
  boutiquePossBodActivityStatus$: Observable<string>;
  ghsBodActivityStatus$: Observable<string>;
  bodProcessStatus$: Observable<string>;
  ghsOfflineBodPassword$: Observable<any>;
  closedBusinessDate$: Observable<number>;
  bodBusinessDate$: Observable<number>;
  goldRate$: Observable<number>;
  /*Eod Process*/
  eodBusinessDate$: Observable<number>;
  showNoBusinessDayIsOpenErrorMessage = false;
  showOfflineGhsEodButton = false;
  showBodCannotBeDoneForFutureDateMessage = false;
  showOfflineGhsBodButton = false;
  walkInDetailsStatus$: Observable<string>;
  ghsBankDepositUploadStatus$: Observable<string>;
  boutiqueBankDepositStatus$: Observable<string>;
  boutiqueRevenueCollectionStatus$: Observable<string>;
  ghsRevenueCollectionStatus$: Observable<string>;
  serviceRevenueCollectionStatus$: Observable<string>;

  ghsEodActivityStatus$: Observable<string>;
  serviceEodActivityStatus$: Observable<string>;
  boutiquePossEodActivityStatus$: Observable<string>;
  eodProcessStatus$: Observable<string>;
  OfflineGhsEODrevenueCollectionStatus$: Observable<string>;
  showBodTab = false;
  showEodTab = false;
  activeUserSessionsData$: Observable<UsersActiveSessionsResults[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private bodEodFacade: BodEodFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private bodEodProcessService: BodEodProcessService,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade
  ) {}

  ngOnInit() {
    this.error$ = this.bodEodFacade.getError();
    this.isLoading$ = this.bodEodFacade.getIsLoading();
    this.overlayNotification.close();
    this.bodEodFacade.resetState();
    this.getLocationSettings();
    this.bodBusinessDate$ = this.bodEodFacade.getBodBusinessDate();
    // To get closed Business date when BOD is not started
    this.bodEodFacade.loadClosedBod();
    this.closedBusinessDate$ = this.bodEodFacade.getClosedBod();
    this.eodBusinessDate$ = this.bodEodFacade.getEodBusinessDate();
    // Offline GHS BOD Data
    this.goldRate$ = this.bodEodFacade.getGoldRate();
    this.ghsOfflineBodPassword$ = this.bodEodFacade.getGhsOfflineBodPassword();
    // Offline GHS EOD Data
    this.OfflineGhsEODrevenueCollectionStatus$ = this.bodEodFacade.getOfflineGhsEODrevenueCollectionStatus();
    // Based on Previous day Eod status load tab accordingly
    this.bodEodFacade.loadPreviousDayEodStatus();
    this.bodEodFacade
      .getPreviousdayEodStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(previousdayEodStatus => {
        if (previousdayEodStatus === BodEodEnum.COMPLETED) {
          this.componentInitBodProcess();
          this.showBodTab = true;
          this.showEodTab = false;
        } else if (previousdayEodStatus === BodEodEnum.ERROR) {
          this.componentInitEodProcess();
          this.showEodTab = true;
          this.showBodTab = false;
        }
      });

    this.handleErrors();
  }

  getLocationSettings() {
    this.isWalkInMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.STORE_IS_WALKIN_DETAILS_MANDATORY
    );
    this.isBankingMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.BANKING_IS_BANKING_MANDATORY
    );
    this.isGhsMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.GHS_IS_EGHS_MANDATORY
    );
    this.isServiceMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.SERVICE_IS_SERVICE_MANDATORY
    );
    this.locationCode$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE
    );
    this.maxMetalRateRetryAttempts$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.STORE_MAX_RETRY_ATTEMPTS_FOR_METAL
    );
  }

  componentInitBodProcess() {
    console.log('[BOD-EOD] componentInitBodProcess');
    this.showBodCannotBeDoneForFutureDateMessage = false;
    this.showOfflineGhsBodButton = false;

    this.metalRateRetryAttempts$ = this.bodEodFacade.getRateFetchAttempts();
    this.clearSubscriptions();

    // Below to know the status of individual steps
    this.metalRatesAvailableStatus$ = this.bodEodFacade.getMetalRatesAvailableStatus();
    this.boutiquePossBodActivityStatus$ = this.bodEodFacade.getBoutiquePossBodStatus();
    this.ghsBodActivityStatus$ = this.bodEodFacade.getGhsBodStatus();
    this.bodProcessStatus$ = this.bodEodFacade.getBodProcessStatus();

    this.bodEodFacade
      .getBodProcessStatus()
      .pipe(
        filter(status => !!status && status === BodEodEnum.COMPLETED),
        take(1)
      )
      .subscribe(bodProcessStatus => {
        if (bodProcessStatus === BodEodEnum.COMPLETED) {
          const key = 'pw.bodEod.bodProcessCompletedForBusinessDay';
          this.showNotifications(key, BodEodEnum.BOD_PROCESS_COMPLETED);
        }
      });
  }

  loadCurrentDayBodStatus() {
    this.bodEodFacade.loadCurrentDayBodStatus();
  }

  clearSubscriptions() {
    //Close BOD process subscriptions
    if (this.bodEodProcessService.initiateBodProcessSubscription) {
      this.bodEodProcessService.initiateBodProcessSubscription.unsubscribe();
    }
    if (this.bodEodProcessService.bodProcessOnPageLoadSubscription) {
      this.bodEodProcessService.bodProcessOnPageLoadSubscription.unsubscribe();
    }
    if (this.bodEodProcessService.initiateEodProcessSubscription) {
      this.bodEodProcessService.initiateEodProcessSubscription.unsubscribe();
    }
  }

  componentInitEodProcess() {
    console.log('[BOD-EOD] componentInitEodProcess');
    //Action to load current day Bod status
    this.loadCurrentDayBodStatus();
    this.showNoBusinessDayIsOpenErrorMessage = false;
    this.showOfflineGhsEodButton = false;
    this.clearSubscriptions();
    // Below to know the status of individual steps
    this.eodProcessStatus$ = this.bodEodFacade.getEodProcessStatus();
    this.walkInDetailsStatus$ = this.bodEodFacade.getWalkInDetailsStatus();
    this.ghsBankDepositUploadStatus$ = this.bodEodFacade.getGhsBankDepositUploadStatus();
    this.boutiqueBankDepositStatus$ = this.bodEodFacade.getBoutiqueBankDepositStatus();
    this.boutiqueRevenueCollectionStatus$ = this.bodEodFacade.getBoutiqueRevenueCollectionStatus();
    this.ghsRevenueCollectionStatus$ = this.bodEodFacade.getGhsRevenueCollectionStatus();
    this.serviceRevenueCollectionStatus$ = this.bodEodFacade.getServiceRevenueCollectionStatus();
    this.ghsEodActivityStatus$ = this.bodEodFacade.getGhsEodActivityStatus();
    this.boutiquePossEodActivityStatus$ = this.bodEodFacade.getBoutiquePossEodActivityStatus();
    //NAP-7851
    this.bodEodFacade.loadActiveUserSessions();
    this.activeUserSessionsData$ = this.bodEodFacade.getActiveUserSessions();
    //NAP-7851 End

    this.bodEodFacade
      .getOfflineGhsEODrevenueCollectionStatus()
      .pipe(
        filter(status => !!status && status === BodEodEnum.COMPLETED),
        take(1)
      )
      .subscribe(status => {
        const key = 'pw.bodEod.passwordAccepted';
        this.showNotifications(
          key,
          BodEodEnum.OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS
        );
      });

    this.bodEodFacade
      .getEodProcessStatus()
      .pipe(
        filter(status => !!status && status === BodEodEnum.COMPLETED),
        take(1)
      )
      .subscribe(eodStatus => {
        const key = 'pw.bodEod.eodProcessCompletedForBusinessDay';
        this.showNotifications(key, BodEodEnum.EOD_PROCESS_COMPLETED);
      });
  }

  startBodProcess() {
    this.clearSubscriptions();
    this.bodEodProcessService.initiateBodProcess();
  }

  tryAgainToLoadMetalRates() {
    //NAP-7852 Change
    this.bodEodProcessService.executeBodStep1(true);
    // this.bodEodFacade.loadPreviousDayEodStatus();
    this.bodEodFacade.loadRateRetryAttempts();
  }

  continueAnywayWithoutMetalRates() {
    this.bodEodProcessService.continueAnywayWithoutMetalRates();
  }

  generatePasswordForEghsOffline(inputData) {
    this.bodEodFacade.generatePasswordForEghsOffline(inputData);
  }

  startEodProcess() {
    this.clearSubscriptions();
    this.bodEodProcessService.initiateEodProcess();
  }
  continueWithoutBankDeposit(remarks: string) {
    this.bodEodProcessService.continueWithoutBankDeposit(remarks);
  }

  validateOfflineEghsEodPassword(eghsOfflineEodData) {
    this.bodEodProcessService.performOfflineEodGhsRevenueCollection(
      eghsOfflineEodData
    );
  }
  //NAP-7851
  refreshActiveUserSessions() {
    this.bodEodFacade.loadActiveUserSessions();
  }

  showNotifications(key: string, type?: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (
              !!type &&
              event &&
              event.eventType === OverlayNotificationEventType.CLOSE
            ) {
              switch (type) {
                case BodEodEnum.OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS:
                  const payload = {
                    status: true
                  };
                  this.bodEodFacade.performGhsRevenueCollectionSuccess(payload);
                  break;
                case BodEodEnum.BOD_PROCESS_COMPLETED:
                  this.back();
                  break;
                case BodEodEnum.EOD_PROCESS_COMPLETED:
                  this.bodEodFacade.markEodProcessCompleted();
                  this.authFacade.logOut();
                  break;
                case BodEodEnum.COMPLETED:
                  this.authFacade.logOut();
                  break;
              }
            }
          });
      });
  }

  handleErrors() {
    this.bodEodFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (!!error && error.code) {
          switch (error.code) {
            case BodEodEnum.ERR_SALE_189:
            case BodEodEnum.ERR_SALE_190:
              this.bodEodFacade
                .getPreviousdayEodStatus()
                .pipe(
                  filter(status => status === BodEodEnum.ERROR),
                  take(1)
                )
                .subscribe(bodProcessError => {
                  if (!!this.showBodTab) {
                    this.loadCurrentDayBodStatus();
                    this.bodEodProcessService.getBodStepsStatusWhenBoutiqueBodIsCompleted(
                      error.code
                    );
                  }
                });
              break;
            case BodEodEnum.ERR_SALE_113:
              this.showNoBusinessDayIsOpenErrorMessage = true;
              break;
            case BodEodEnum.ERR_SALE_270:
              this.showOfflineGhsEodButton = true;
              this.errorHandler(error);
              break;
            case BodEodEnum.ERR_SALE_242:
              this.showBodCannotBeDoneForFutureDateMessage = true;
              this.showBodTab = true;
              this.showEodTab = false;
              break;
            case BodEodEnum.ERR_INT_078:
              this.showOfflineGhsBodButton = true;
              this.errorHandler(error);
              break;
            default:
              this.errorHandler(error);
              break;
          }
        }
      });
  }

  errorHandler(error?: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        message: error.message,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  back() {
    this.router
      .navigate([getHomePageUrl()], {
        queryParams: {
          menu: PossHomeKeyEnum.BOD_EOD_MENU_KEY
        }
      })
      .then(() => {
        window.location.reload();
      });
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
