import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  Input
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-lot-bin-age-config',
  templateUrl: './lot-bin-age-config.component.html',
  styleUrls: ['./lot-bin-age-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LotBinAgeConfigComponent implements OnInit, OnDestroy {
  @Input() config: {
    isSameDiscountApplicable: boolean;
    binAge: {
      fromValue: number;
      toValue: number;
    };
    lotAge: {
      fromValue: number;
      toValue: number;
    };
  };
  @Input() type;
  @Input() discountDetails;
  @Output() save = new EventEmitter<any>();

  destroy$ = new Subject<null>();

  form: FormGroup;

  fromLabel: string;
  toLabel: string;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountLotBinAgeConfig.fromLabel',
        'pw.discountLotBinAgeConfig.toLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(transaltedMsg => {
        this.fromLabel = transaltedMsg['pw.discountLotBinAgeConfig.fromLabel'];
        this.toLabel = transaltedMsg['pw.discountLotBinAgeConfig.toLabel'];
      });
  }

  ngOnInit(): void {
    console.log(this.config);
    this.form = new FormGroup({
      isSameDiscountApplicable: new FormControl(
        this.config?.isSameDiscountApplicable
          ? this.config?.isSameDiscountApplicable
          : 0
      ),
      fromLotAge: new FormControl(
        this.config?.lotAge
          ? this.config?.lotAge?.fromValue
            ? this.config?.lotAge?.fromValue
            : 0
          : 0,
        [
          this.fieldValidatorsService.numbersField(this.fromLabel),
          this.fieldValidatorsService.min(0, this.fromLabel)
        ]
      ),
      toLotAge: new FormControl(
        this.config?.lotAge
          ? this.config?.lotAge?.toValue
            ? this.config?.lotAge?.toValue
            : 0
          : 0,
        [
          this.fieldValidatorsService.numbersField(this.toLabel),
          this.fieldValidatorsService.min(0, this.toLabel)
        ]
      ),
      fromBinAge: new FormControl(
        this.config?.binAge
          ? this.config?.binAge?.fromValue
            ? this.config?.binAge?.fromValue
            : 0
          : 0,
        [
          this.fieldValidatorsService.numbersField(this.fromLabel),
          this.fieldValidatorsService.min(0, this.fromLabel)
        ]
      ),
      toBinAge: new FormControl(
        this.config?.binAge
          ? this.config?.binAge?.toValue
            ? this.config?.binAge?.toValue
            : 0
          : 0,
        [
          this.fieldValidatorsService.numbersField(this.toLabel),
          this.fieldValidatorsService.min(0, this.toLabel)
        ]
      )
    });
  }

  saveFn() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (
        this.discountDetails?.discountCode !== '' &&
        !this.discountDetails?.isActive
      ) {
        this.showMessage('pw.global.deactiveMsg');
      } else {
        if (this.form.valid) {
          const formValue = this.form.value;

          if (+formValue.fromLotAge >= +formValue.toLotAge) {
            this.showErrorPopUp(
              'pw.discountLotBinAgeConfig.inValidLotAgeValue'
            );
          } else if (+formValue.fromBinAge >= +formValue.toBinAge) {
            this.showErrorPopUp(
              'pw.discountLotBinAgeConfig.inValidBinAgeValue'
            );
          } else {
            this.save.emit({
              configDetails: {
                type: this.type === 10 ? 'BEST_DEAL_DISCOUNT' : '',
                data: {
                  lotAge: {
                    fromValue: formValue.fromLotAge,
                    toValue: formValue.toLotAge
                  },
                  binAge: {
                    fromValue: formValue.fromBinAge,
                    toValue: formValue.toBinAge
                  },
                  isApplicableForNewItem: formValue.isSameDiscountApplicable
                }
              }
            });
          }
        } else {
          this.form.markAllAsTouched();
        }
      }
    }
  }
  showMessage(key: string) {
    this.translate
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

  showErrorPopUp(transalteKey: string) {
    this.translate
      .get(transalteKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: any) => {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.ERROR,
          message: translatedMessage
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
