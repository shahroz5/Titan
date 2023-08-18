import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MetalRatesFacade } from '@poss-web/poss/metal-rates/data-access-metal-rates';
import {
  BodEodEnum,
  BodEodStatusEnum,
  MasterMenuKeyEnum,
  MetalRateUpdateRequestPayload,
  OverlayNotificationEventType,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  getHomePageUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';

@Component({
  selector: 'poss-web-metal-rates',
  templateUrl: './metal-rates.component.html'
})
export class MetalRatesComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  isGoldRateAvailable$: Observable<boolean>;
  businessDate: number;
  bodEodStatus: string;

  constructor(
    public translate: TranslateService,
    private metalRatesFacade: MetalRatesFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private sharedBodEodFacade: SharedBodEodFacade
  ) {}

  ngOnInit(): void {
    this.metalRatesFacade.ResetState();
    this.isLoading$ = this.metalRatesFacade.getIsLoading();
    //Action to load latest Business date Api data
    this.sharedBodEodFacade.loadLatestBusinessDay();
    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(BodEodStatus => !!BodEodStatus),
        take(1)
      )
      .subscribe(bodEodStatus => {
        this.bodEodStatus = bodEodStatus;
        switch (bodEodStatus) {
          case BodEodStatusEnum.API_FAILURE:
          case BodEodStatusEnum.CLOSED:
            this.showAlertNotification(
              'pw.bodEod.noBusinessDayIsOpenErrorMessage'
            );
            break;
          case BodEodStatusEnum.EOD_IN_PROGRESS:
            this.showAlertNotification(
              'pw.bodEod.metalRateUpdateIsNotAllowedDuringEodProcess'
            );
            break;
          default:
            break;
        }
      });

    //To load business date for which Metal Rate is to be updated
    this.metalRatesFacade.loadBodBusinessDate();

    this.metalRatesFacade
      .getBodBusinessDate()
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(bodBusinessDate => {
        this.businessDate = bodBusinessDate;
        this.metalRatesFacade.loadAvailableMetalRates(bodBusinessDate);
      });
    this.metalRatesFacade
      .getEodBusinessDate()
      .pipe(
        filter(date => !!date),
        take(1)
      )
      .subscribe(eodBusinessDate => {
        this.businessDate = eodBusinessDate;
        this.metalRatesFacade.loadAvailableMetalRates(eodBusinessDate);
      });

    this.metalRatesFacade
      .getError()
      .pipe(
        filter(error => !!error),
        takeUntil(this.destroy$)
      )
      .subscribe((error: CustomErrors) => {
        if (!!error && error.code) {
          switch (error.code) {
            case BodEodEnum.ERR_SALE_189:
            case BodEodEnum.ERR_SALE_190:
              //When Bod is completed, to load Business Date during OPEN/EOD_IN_PROGRESS Status
              this.metalRatesFacade.loadEodBusinessDate();
              break;
            case BodEodEnum.ERR_ENG_003:
            case BodEodEnum.ERR_SALE_242:
              break;
            default:
              this.errorHandler(error);
              break;
          }
        }
      });

    this.isGoldRateAvailable$ = this.metalRatesFacade.isGoldRateAvailableForBusinessDay();

    this.metalRatesFacade
      .isMetalRatesUpdatedInBoutique()
      .pipe(takeUntil(this.destroy$))
      .subscribe(metalUpdatedStatus => {
        if (!!metalUpdatedStatus && metalUpdatedStatus === true) {
          const key = 'pw.bodEod.metalRateUpdatedSuccessfully';
          this.showNotifications(key);
        }
      });
  }

  showAlertNotification(key: string): void {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasBackdrop: true,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  back() {
    switch (this.bodEodStatus) {
      case BodEodStatusEnum.OPEN:
        this.router.navigate([getMasterHomeRouteUrl()], {
          queryParams: {
            menu: MasterMenuKeyEnum.BOUTIQUE_MENU_KEY
          }
        });
        break;
      default:
        this.router.navigate([getHomePageUrl()]);
        break;
    }
  }

  updateMetalRates(metalRatePayload: MetalRateUpdateRequestPayload) {
    this.metalRatesFacade.saveMetalRates(metalRatePayload);
  }

  showNotifications(key: string) {
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
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  noMetalRatesProvided(translatedMessage: string) {
    this.overlayNotification.show({
      type: OverlayNotificationType.SIMPLE,
      message: translatedMessage,
      hasClose: true,
      hasBackdrop: true
    });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
