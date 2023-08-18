import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  AdvanceBookingDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  MetalTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tolerance-details',
  templateUrl: './tolerance-details.component.html',
  styleUrls: ['./tolerance-details.component.scss']
})
export class ToleranceDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  abDetails: AdvanceBookingDetailsResponse = null;
  toleranceDetails = null;
  toleranceValue = 0;
  tolerancePercent = 0;
  orderedWeight = 0;
  billedWeight = 0;
  weightUnit = 'gms';
  openTolerance = false;

  constructor(
    private commonFacade: CommonFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.HAS_ERROR
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.AB_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        this.abDetails = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOLERANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((toleranceData: any) => {
        this.toleranceDetails = null;
        if (toleranceData.data !== null && this.abDetails !== null) {
          this.toleranceValue = toleranceData.data.configValue;
          this.orderedWeight = this.getWeightDetails(
            toleranceData.itemType,
            this.abDetails.orderWeightDetails
          );
          this.billedWeight = this.getWeightDetails(
            toleranceData.itemType,
            this.abDetails.deliveredWeightDetails
          );
          this.tolerancePercent =
            this.orderedWeight * (toleranceData.data.configPercent / 100);
          if (this.orderedWeight === 0) {
            this.errorNotifications('pw.toleranceDetails.metalTypeMsg');
          } else {
            this.toleranceDetails = {
              orderedWeight: this.orderedWeight,
              billedWeight: this.billedWeight,
              balanceWeight: this.orderedWeight - this.billedWeight,
              tolerance:
                this.toleranceValue > this.tolerancePercent
                  ? this.tolerancePercent
                  : this.toleranceValue
            };
          }
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.CLOSE_TOLERANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((closeTolerance: boolean) => {
        if (closeTolerance) {
          this.closeOpenOrder();
          this.commonFacade.closeTolerance(false);
        }
      });
  }

  getWeightDetails(itemType: string, weightDetails) {
    if (weightDetails === null) return 0;
    else if (itemType === MetalTypeEnum.GOLD)
      return weightDetails.data.goldWeight;
    else if (itemType === MetalTypeEnum.SILVER)
      return weightDetails.data.silverWeight;
    else if (itemType === MetalTypeEnum.PLATINUM)
      return weightDetails.data.platinumWeight;
  }

  openOrederTerarnce() {
    this.openTolerance = true;
  }

  closeOpenOrder() {
    this.openTolerance = false;
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
