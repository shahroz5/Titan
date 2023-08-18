import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  DiscountTypeEnum, OverlayNotificationServiceAbstraction, RivaahConfigurationResponse
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-coupon-configuration',
  templateUrl: './coupon-configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouponConfigurationComponent implements OnInit, OnDestroy {
  couponConfigForm: FormGroup;
  destroy$ = new Subject();
  translatedMsg = [];
  
  @Input() couponConfig: RivaahConfigurationResponse;
  @Output() saveCoupon = new EventEmitter<any>();

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translateService
      .get([
        'pw.rivaahEligibilityConfig.detailsLabel',
        'pw.rivaahEligibilityConfig.noOfDigitsLabel',
        'pw.rivaahEligibilityConfig.startingDigitsLabel',
        'pw.rivaahEligibilityConfig.validityNoOfMonthsLabel',
        'pw.rivaahEligibilityConfig.noOfTimesCouponCanBeUsedLabel',
        'pw.rivaahEligibilityConfig.saveButton'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.translatedMsg = translatedLabels;
      });
    }

  ngOnInit(): void {
    this.couponConfigForm = new FormGroup({
      
      noOfDigits: new FormControl(
        this.couponConfig?.ruleDetails?.data?.noOfDigits, [
        this.fieldValidatorsService.numberGreaterThanZeroPattern(
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfDigitsLabel']
        ),
        this.fieldValidatorsService.requiredField(
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfDigitsLabel']
        ),
        this.fieldValidatorsService.min(
          4, 
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfDigitsLabel']
        ),
        this.fieldValidatorsService.maxLength(
          2,
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfDigitsLabel']
        ),
        this.fieldValidatorsService.minLength(
          1,
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfDigitsLabel']
        )
      ]),
      startingDigits: new FormControl(
        this.couponConfig?.ruleDetails?.data?.startingDigits,[
          this.fieldValidatorsService.numberGreaterThanZeroPattern(
            this.translatedMsg['pw.rivaahEligibilityConfig.startingDigitsLabel']
          ),
          this.fieldValidatorsService.requiredField(
            this.translatedMsg['pw.rivaahEligibilityConfig.startingDigitsLabel']
          ),
          this.fieldValidatorsService.maxLength(
            4,
            this.translatedMsg['pw.rivaahEligibilityConfig.startingDigitsLabel']
          ),
          this.fieldValidatorsService.minLength(
            4,
            this.translatedMsg['pw.rivaahEligibilityConfig.startingDigitsLabel']
          )
        ]
      ),
      validityNoOfMonths: new FormControl(
        this.couponConfig?.ruleDetails?.data?.validityNoOfMonths, [
        this.fieldValidatorsService.numberGreaterThanZeroPattern(
          this.translatedMsg['pw.rivaahEligibilityConfig.validityNoOfMonthsLabel']
        ),
        this.fieldValidatorsService.requiredField(
          this.translatedMsg['pw.rivaahEligibilityConfig.validityNoOfMonthsLabel']
        ),
        this.fieldValidatorsService.maxLength(
          2,
          this.translatedMsg['pw.rivaahEligibilityConfig.validityNoOfMonthsLabel']
        ),
        this.fieldValidatorsService.minLength(
          1,
          this.translatedMsg['pw.rivaahEligibilityConfig.validityNoOfMonthsLabel']
        )
      ]),
      noOfTimesCouponCanBeUsed: new FormControl(
      this.couponConfig?.ruleDetails?.data?.noOfTimesCouponCanBeUsed, [
        this.fieldValidatorsService.numberGreaterThanZeroPattern(
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfTimesCouponCanBeUsedLabel']
        ),
        this.fieldValidatorsService.requiredField(
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfTimesCouponCanBeUsedLabel']
        ),
        this.fieldValidatorsService.maxLength(
          2,
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfTimesCouponCanBeUsedLabel']
        ),
        this.fieldValidatorsService.minLength(
          1,
          this.translatedMsg['pw.rivaahEligibilityConfig.noOfTimesCouponCanBeUsedLabel']
        )
      ]),
    });
  }

  saveCouponConfig() {
    const couponConfiguration = this.couponConfigForm.getRawValue();
    let confivalues = this.couponConfig;
    confivalues = {
      isActive: true,
      ruleDetails: {
        data: couponConfiguration,
        type: DiscountTypeEnum.RIVAAH_CARD_ELIGIBILITY
      },
      ruleId: 1,
      ruleType: DiscountTypeEnum.RIVAAH_CARD_ELIGIBILITY
    };
    this.saveCoupon.emit(confivalues);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

