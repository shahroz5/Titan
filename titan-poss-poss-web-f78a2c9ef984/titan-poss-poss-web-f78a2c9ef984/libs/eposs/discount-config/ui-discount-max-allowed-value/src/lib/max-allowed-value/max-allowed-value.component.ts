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
  DiscountTypeEnum,
  AlertPopupTypeEnum,
  MaxValueOrPercentage,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-max-allowed-value',
  templateUrl: './max-allowed-value.component.html',
  styleUrls: ['./max-allowed-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaxAllowedValueConfigComponent implements OnInit, OnDestroy {
  @Input() config: MaxValueOrPercentage;
  @Input() currencyCode: string;
  @Input() type;
  @Input() discountDetails;

  @Output() save = new EventEmitter<any>();

  destroy$ = new Subject<null>();

  form: FormGroup;

  percentageLabel: string;
  valueLabel: string;
  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountMaxValueConfig.percentageLabel',
        'pw.discountMaxValueConfig.valueLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(transaltedMsg => {
        this.percentageLabel =
          transaltedMsg['pw.discountMaxValueConfig.percentageLabel'];
        this.valueLabel = transaltedMsg['pw.discountMaxValueConfig.valueLabel'];
      });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      maxMetalChargePercentage: new FormControl(
        this.config?.maxMetalChargePercentage !== null
          ? this.config?.maxMetalChargePercentage
          : null,
        [
          this.fieldValidatorsService.percentageField(this.percentageLabel),
          this.fieldValidatorsService.min(1, this.percentageLabel)
        ]
      ),
      maxMetalChargeValue: new FormControl(
        this.config?.maxMetalChargeValue
          ? this.config?.maxMetalChargeValue
          : null,
        this.fieldValidatorsService.min(1, 'Max Metal Charge ')
      ),
      maxScPercentage: new FormControl(
        this.config?.maxScPercentage ? this.config?.maxScPercentage : null,
        [
          this.fieldValidatorsService.percentageField(this.percentageLabel),
          this.fieldValidatorsService.min(1, this.percentageLabel)
        ]
      ),
      maxScValue: new FormControl(
        this.config?.maxScValue ? this.config?.maxScValue : null,
        this.fieldValidatorsService.min(1, 'Max Sc ')
      ),
      maxUcpPercentage: new FormControl(
        this.config?.maxUcpPercentage ? this.config?.maxUcpPercentage : null,
        [
          this.fieldValidatorsService.percentageField(this.percentageLabel),
          this.fieldValidatorsService.min(1, this.percentageLabel)
        ]
      ),
      maxUcpValue: new FormControl(
        this.config?.maxUcpValue ? this.config?.maxUcpValue : null,
        this.fieldValidatorsService.min(1, 'Max Ucp ')
      ),
      maxWcPercentage: new FormControl(
        this.config?.maxWcPercentage ? this.config?.maxWcPercentage : null,
        [
          this.fieldValidatorsService.percentageField(this.percentageLabel),
          this.fieldValidatorsService.min(1, 'Max Wc Percentage')
        ]
      ),
      maxWcValue: new FormControl(
        this.config?.maxWcValue ? this.config?.maxWcValue : null,
        this.fieldValidatorsService.min(1, 'Max Wc ')
      ),
      maxMcPercentage: new FormControl(
        this.config?.maxMcPercentage ? this.config?.maxMcPercentage : null,
        [
          this.fieldValidatorsService.percentageField(this.percentageLabel),
          this.fieldValidatorsService.min(1, this.percentageLabel)
        ]
      ),
      maxMcValue: new FormControl(
        this.config?.maxMcValue ? this.config?.maxMcValue : null,
        this.fieldValidatorsService.min(1, 'Max Mc ')
      ),
      maxPerGramVaule: new FormControl(
        this.config?.maxPerGramVaule ? this.config?.maxPerGramVaule : null,
        this.fieldValidatorsService.min(1, 'Max Per Gram ')
      )
      // maxPerGramWeight: new FormControl(
      //   this.config?.maxPerGramVaule ? this.config?.maxPerGramVaule : null,
      //   this.fieldValidatorsService.min(1, 'Max Per Gram Weight')
      // )
    });
  }

  saveFn() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.form.valid) {
        const formValue = this.form.value;

        this.save.emit({
          type:
            this.type === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
              ? 'ITEM_GROUP_LEVEL_DISCOUNT'
              : 'BEST_DEAL_DISCOUNT',
          data: {
            maxMetalCharge: {
              percent:
                formValue.maxMetalChargePercentage !== ''
                  ? formValue.maxMetalChargePercentage
                  : null,
              value:
                formValue.maxMetalChargeValue !== ''
                  ? formValue.maxMetalChargeValue
                  : null
            },
            maxStoneCharges: {
              percent:
                formValue.maxScPercentage !== ''
                  ? formValue.maxScPercentage
                  : null,
              value: formValue.maxScValue !== '' ? formValue.maxScValue : null
            },
            maxUCP: {
              percent:
                formValue.maxUcpPercentage !== ''
                  ? formValue.maxUcpPercentage
                  : null,
              value: formValue.maxUcpValue !== '' ? formValue.maxUcpValue : null
            },

            maxMC: {
              percent:
                formValue.maxMcPercentage !== ''
                  ? formValue.maxMcPercentage
                  : null,
              value: formValue.maxMcValue !== '' ? formValue.maxMcValue : null
            },
            maxPsPerGram: {
              percent: null,

              weight:
                formValue.maxPerGramVaule !== ''
                  ? formValue.maxPerGramVaule
                  : null
            }
          }
        });
      } else {
        this.form.markAllAsTouched();
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
