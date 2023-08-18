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
import { EghsOfflineBodPopupComponent } from '@poss-web/poss/bod-eod/ui-eghs-offline-bod-popup';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BodEodEnum,
  CustomErrors
} from '@poss-web/shared/models';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import { getOfflineMetalRatesUpdateRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-bod-process',
  templateUrl: './bod-process.component.html',
  styleUrls: ['./bod-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodProcessComponent implements OnDestroy, OnInit {
  bodEodEnum = BodEodEnum;
  closedBusinessDate;
  bodBusinessDate: string;
  eodBusinessDate: string;
  retryForMetalRatesCount = 0;
  isGoldRateAvailable: boolean;
  private destroy$ = new Subject();

  //NAP-7852
  @Input() maxMetalRateRetryAttempts: string;
  @Input() metalRateRetryAttempts$: Observable<number>;
  @Input() showBodCannotBeDoneForFutureDateMessage: boolean;
  @Input() showOfflineGhsBodButton: boolean;

  @Input() closedBusinessDate$: Observable<number>;
  @Input() bodBusinessDate$: Observable<number>;

  @Input() eodBusinessDate$: Observable<number>;
  @Input() metalRateAvailableStatus: string;
  @Input() boutiquePossBodStatus: string;
  @Input() isGhsMandatory: string;
  @Input() ghsBodStatus: string;
  @Input() bodProcessStatus: string;
  @Input() offlineGhsBodPassword$: Observable<any>;
  @Input() locationCode$: Observable<string>;
  @Input() goldRate$: Observable<number>;
  @Input() error: CustomErrors;

  @Output() startBodProcess = new EventEmitter<any>();
  @Output() tryAgainToLoadMetalRates = new EventEmitter<any>();
  @Output() continueAnywayWithoutMetalRates = new EventEmitter<any>();
  @Output() generatePasswordRequest = new EventEmitter<any>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {}

  ngOnInit(): void {
    this.closedBusinessDate$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      if (!!date) {
        this.closedBusinessDate = moment(Number(date)).format(this.dateFormat);
      }
    });

    this.bodBusinessDate$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      if (!!date) {
        this.bodBusinessDate = moment(Number(date)).format(this.dateFormat);
      }
    });
    this.eodBusinessDate$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      if (!!date) {
        this.eodBusinessDate = moment(Number(date)).format(this.dateFormat);
      }
    });
    this.metalRateRetryAttempts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(retryAttempts => {
        this.retryForMetalRatesCount = retryAttempts;
      });
    this.goldRate$
      .pipe(
        filter(goldrate => !!goldrate),
        take(1)
      )
      .subscribe(goldRate => {
        this.isGoldRateAvailable = true;
      });
  }

  initiateBodProcess() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.bodConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.startBodProcess.emit();
        }
      });
  }
  tryAgainForMetalRates() {
    ++this.retryForMetalRatesCount;
    this.tryAgainToLoadMetalRates.emit();
  }
  continueWithoutMetalRate() {
    this.continueAnywayWithoutMetalRates.emit();
  }

  updateMetalRatesOffline() {
    this.router.navigateByUrl(getOfflineMetalRatesUpdateRouteUrl());
  }

  openEghsOfflineBodPopup() {
    const dialogRef = this.dialog.open(EghsOfflineBodPopupComponent, {
      autoFocus: false,
      data: {
        locationCode: this.locationCode$,
        businessDate: this.bodBusinessDate
          ? this.bodBusinessDate$
          : this.eodBusinessDate$,
        goldRate: this.goldRate$,
        generatedPassword: this.offlineGhsBodPassword$
      },
      width: '600px',
      disableClose: true
    });

    dialogRef.componentInstance.getPassword
      .pipe(takeUntil(this.destroy$))
      .subscribe(requestData => this.generatePasswordRequest.emit(requestData));

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
