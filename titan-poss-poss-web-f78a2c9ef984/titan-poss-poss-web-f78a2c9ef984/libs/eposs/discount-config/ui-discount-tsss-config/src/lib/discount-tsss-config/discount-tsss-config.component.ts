import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  DiscountTypeEnum,
  NewDiscountApplicableConfig,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-tsss-config',
  templateUrl: './discount-tsss-config.component.html'
})
export class DiscountTsssConfigComponent
  implements OnInit, OnDestroy, OnChanges {
  tsssConfigForm: FormGroup;
  @Input() config: NewDiscountApplicableConfig;
  @Input() isComputed: boolean;
  @Output() save = new EventEmitter<any>();
  @Output() computesTsssConfig = new EventEmitter<any>();
  @Output() downloadTSSSCoupons = new EventEmitter<boolean>();
  translatedMsg = [];
  destroy$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translateService
      .get([
        'pw.discountTsssConfig.noOfCouponsLabel',
        'pw.discountTsssConfig.noOfDigitsLabel',
        'pw.discountTsssConfig.startingDigitsLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.translatedMsg = translatedLabels;
      });
  }

  ngOnInit(): void {
    this.tsssConfigForm = new FormGroup({
      noOfCoupons: new FormControl(this.config.configDetails.data.noOfCoupons, [
        this.fieldValidatorsService.numberGreaterThanZeroPattern(
          this.translatedMsg['pw.discountTsssConfig.noOfCouponsLabel']
        ),
        this.fieldValidatorsService.requiredField(
          this.translatedMsg['pw.discountTsssConfig.noOfCouponsLabel']
        )
      ]),
      noOfDigits: new FormControl(this.config.configDetails.data.noOfDigits, [
        this.fieldValidatorsService.numberGreaterThanZeroPattern(
          this.translatedMsg['pw.discountTsssConfig.noOfDigitsLabel']
        ),
        this.fieldValidatorsService.requiredField(
          this.translatedMsg['pw.discountTsssConfig.noOfDigitsLabel']
        )
      ]),
      startingDigits: new FormControl(
        this.config.configDetails.data.startingDigits,
        [
          this.fieldValidatorsService.numberGreaterThanZeroPattern(
            this.translatedMsg['pw.discountTsssConfig.startingDigitsLabel']
          ),
          this.fieldValidatorsService.requiredField(
            this.translatedMsg['pw.discountTsssConfig.startingDigitsLabel']
          ),
          this.fieldValidatorsService.maxLength(
            4,
            this.translatedMsg['pw.discountTsssConfig.startingDigitsLabel']
          ),
          this.fieldValidatorsService.minLength(
            4,
            this.translatedMsg['pw.discountTsssConfig.startingDigitsLabel']
          )
        ]
      )
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isComputed']) {
      if (this.isComputed) {
        this.saveFn();
      }
    }
  }

  saveFn() {
    const tsssConfig = this.tsssConfigForm.getRawValue();
    let confivalues = this.config;
    confivalues = {
      configDetails: {
        data: tsssConfig,
        type: DiscountTypeEnum.TSSS_DISCOUNT
      }
    };
    this.save.emit(confivalues);
  }

  computeTsssConfig() {
    if (this.config?.discountCode !== '' && !this.config?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.tsssConfigForm.valid) {
        const tsssConfig = this.tsssConfigForm.getRawValue();
        this.computesTsssConfig.emit(tsssConfig);

      }
    }
  }
  showMessage(key: string) {
    this.translateService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  downloadNumberOfCoupon() {
    if (this.config?.discountCode !== '' && !this.config?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.downloadTSSSCoupons.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
