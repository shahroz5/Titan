import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EghsOfflineEodPopupComponent } from '@poss-web/poss/bod-eod/ui-eghs-offline-eod-popup';
import { UsersActiveSessionsComponent } from '@poss-web/poss/bod-eod/ui-users-active-sessions';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BodEodEnum,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  UsersActiveSessionsResults
} from '@poss-web/shared/models';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import {
  getBoutiqueBankDepositRouteUrl,
  getUploadEghsRouteUrl,
  getWalkInsDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-eod-process',
  templateUrl: './eod-process.component.html',
  styleUrls: ['./eod-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EodProcessComponent implements OnInit, OnDestroy {
  bodEodEnum = BodEodEnum;
  businessDate: string;
  activeUserSessionsData: UsersActiveSessionsResults[];
  private destroy$ = new Subject();

  @Input() showNoBusinessDayIsOpenErrorMessage: boolean;
  @Input() showOfflineGhsEodButton: boolean;
  @Input() isWalkInMandatory: string;
  @Input() isBankingMandatory: string;
  @Input() isGhsMandatory: string;
  @Input() isServiceMandatory: string;

  @Input() eodBusinessDate$: Observable<number>;
  @Input() walkInDetailsStatus = BodEodEnum.PENDING;
  @Input() ghsBankDepositUploadStatus = BodEodEnum.PENDING;
  @Input() boutiqueBankDepositStatus = BodEodEnum.PENDING;
  @Input() boutiqueRevenueCollectionStatus = BodEodEnum.PENDING;
  @Input() ghsRevenueCollectionStatus = BodEodEnum.PENDING;
  @Input() ghsEodActivityStatus = BodEodEnum.PENDING;
  @Input() serviceRevenueCollectionStatus = BodEodEnum.PENDING;
  @Input() boutiquePossEodActivityStatus = BodEodEnum.PENDING;
  @Input() eodProcessStatus: string;
  @Input() activeUserSessionsData$: Observable<UsersActiveSessionsResults[]>;
  @Input() OfflineGhsEODrevenueCollectionStatus: Observable<string>;
  @Input() error: CustomErrors;

  @Output() startEodProcess = new EventEmitter<any>();
  @Output() continueWithoutBankDeposit = new EventEmitter<string>();
  @Output() validateEghsEodPasswordData = new EventEmitter<any>();
  @Output() refreshActiveUserSessions = new EventEmitter<any>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {}

  ngOnInit() {
    this.activeUserSessionsData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(activeUsersData => {
        this.activeUserSessionsData = activeUsersData;
      });
    this.eodBusinessDate$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      if (!!date) {
        this.businessDate = moment(Number(date)).format(this.dateFormat);
      }
    });

    this.OfflineGhsEODrevenueCollectionStatus.subscribe(status => {
      if (!!status && status === BodEodEnum.COMPLETED) {
        this.dialog.closeAll();
      }
    });
  }

  initiateEodProcess() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.eodConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          if (
            this.activeUserSessionsData &&
            this.activeUserSessionsData.length > 0
          ) {
            this.openActiveUserSessionPopUp();
          } else {
            this.startEodProcess.emit();
          }
        }
      });
  }

  enterWalkInDetails() {
    this.router.navigateByUrl(getWalkInsDetailsRouteUrl());
  }

  uploadGhsBankDepositFile() {
    this.router.navigateByUrl(getUploadEghsRouteUrl());
  }

  navigateToBankDeposit() {
    this.router.navigateByUrl(getBoutiqueBankDepositRouteUrl());
  }
  openActiveUserSessionPopUp() {
    const dialogRef = this.dialog.open(UsersActiveSessionsComponent, {
      autoFocus: false,
      data: this.activeUserSessionsData$,
      width: '800px',
      disableClose: true
    });

    dialogRef.componentInstance.refreshActiveSessions
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        this.refreshActiveUserSessions.emit();
      });

    dialogRef.componentInstance.startEodProcess
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        this.startEodProcess.emit();
      });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
  }

  openRemarksPopUp() {
    const key = 'pw.bodEod.save';
    const remarksText = 'pw.bodEod.enterRemarks';
    this.translate
      .get([key, remarksText])
      .pipe(take(1))
      .subscribe(translatedMessage => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: translatedMessage[remarksText],
            buttonText: translatedMessage[key],
            hasRemarks: true,
            isRemarksMandatory: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.continueWithoutBankDeposit.emit(event.data);
            }
          });
      });
  }

  openEghsOfflineEodPopup() {
    const dialogRef = this.dialog.open(EghsOfflineEodPopupComponent, {
      autoFocus: false,
      width: '600px',
      disableClose: true
    });

    dialogRef.componentInstance.validatePassword
      .pipe(takeUntil(this.destroy$))
      .subscribe(eghsOfflineEodFormData =>
        this.validateEghsEodPasswordData.emit(eghsOfflineEodFormData)
      );

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
