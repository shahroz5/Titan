import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BodEodFacade } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  BankingAndRevenueMenuKeyEnum,
  BodEodEnum,
  BodEodTypesEnum,
  CustomErrors,
  EghsBodGeneratedPassword,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import { getBankingAndRevenueHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-view-eghs-offline-bod',
  templateUrl: './view-eghs-offline-bod.component.html',
  styleUrls: ['./view-eghs-offline-bod.component.scss']
})
export class ViewEghsOfflineBodComponent implements OnInit, OnDestroy {
  bodEodTypesEnum = BodEodTypesEnum;
  tab: string;
  isLoggedIn: boolean;
  offlineEghsBodData: Observable<EghsBodGeneratedPassword[]>;
  count: Observable<number>;
  businessDateForView: string;
  businessDateForController: number;
  goldRate: number;
  //Remove below code if pagination is not required
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  // Remove till the above
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  enableGeneratePassword = false;

  constructor(
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private authFacade: AuthFacade,
    private bodEodFacade: BodEodFacade,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {}

  ngOnInit(): void {
    this.bodEodFacade.loadCurrentDayBodStatus();
    this.bodEodFacade
      .getBusinessDayDate()
      .pipe(
        filter(businessDate => !!businessDate),
        takeUntil(this.destroy$)
      )
      .subscribe(businessDate => {
        this.businessDateForView = moment(Number(businessDate)).format(
          this.dateFormat
        );
        this.businessDateForController = businessDate;
        // To load metal rates for business date
        this.bodEodFacade.loadMetalRatesForBusinessDay(businessDate);
      });

    this.bodEodFacade
      .getGoldRate()
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(goldrate => {
        this.goldRate = goldrate;
      });

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.bodEodFacade.loadGhsOfflineBodPasswords();
    this.isLoading$ = this.bodEodFacade.getIsLoading();
    this.bodEodFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.offlineEghsBodData = this.bodEodFacade.getOfflineEghsPasswordsList();
    this.count = this.bodEodFacade.getOfflineGhsPasswordCount();
  }

  generatePassword() {
    const requestInput = {
      businessDate: this.businessDateForController
        ? this.businessDateForController
        : null,
      goldRate: this.goldRate ? this.goldRate : null
    };

    this.bodEodFacade.generatePasswordForEghsOffline(requestInput);

    this.bodEodFacade
      .getGhsOfflineBodPassword()
      .pipe(
        filter(data => !!data),
        take(1)
      )
      .subscribe(data => {
        const key = 'pw.bodEod.passwordGeneratedSuccessfully';
        this.showNotifications(key, BodEodEnum.GHS_BOD_PASSWORD_GENERATED);
      });
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
              type === BodEodEnum.GHS_BOD_PASSWORD_GENERATED &&
              event.eventType === OverlayNotificationEventType.CLOSE
            ) {
              this.bodEodFacade.loadGhsOfflineBodPasswords();
            }
          });
      });
  }

  getPaginationDetails() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.listingPageEvent.pageSize = pageSize;
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
  }

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

  back() {
    this.router.navigate([getBankingAndRevenueHomeRouteUrl()], {
      queryParams: {
        menu: BankingAndRevenueMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
