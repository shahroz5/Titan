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
  AdditionalMaxValueOrPercentage,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-riva-add-max-allowed-value',
  templateUrl: './riva-add-max-allowed-value.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RivaAddMaxAllowedValueComponent implements OnInit, OnDestroy {
  @Input() config: AdditionalMaxValueOrPercentage;
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
      additionalMaxMetalChargePercentage: new FormControl(
        this.config?.additionalMaxMetalChargePercentage !== null
          ? this.config?.additionalMaxMetalChargePercentage
          : null,
        [this.fieldValidatorsService.percentageField(this.percentageLabel)]
      ),
      additionalMaxMetalChargeValue: new FormControl(
        this.config?.additionalMaxMetalChargeValue
          ? this.config?.additionalMaxMetalChargeValue
          : null
      ),
      additionalMaxStoneChargePercentage: new FormControl(
        this.config?.additionalMaxStoneChargePercentage
          ? this.config?.additionalMaxStoneChargePercentage
          : null,
        [this.fieldValidatorsService.percentageField(this.percentageLabel)]
      ),
      additionalMaxStoneChargeValue: new FormControl(
        this.config?.additionalMaxStoneChargeValue
          ? this.config?.additionalMaxStoneChargeValue
          : null
      ),
      additionalMaxUcpPercentage: new FormControl(
        this.config?.additionalMaxUcpPercentage
          ? this.config?.additionalMaxUcpPercentage
          : null,
        [this.fieldValidatorsService.percentageField(this.percentageLabel)]
      ),
      additionalMaxUCPValue: new FormControl(
        this.config?.additionalMaxUCPValue
          ? this.config?.additionalMaxUCPValue
          : null
      ),

      additionalMaxMCPercentage: new FormControl(
        this.config?.additionalMaxMCPercentage
          ? this.config?.additionalMaxMCPercentage
          : null,
        [this.fieldValidatorsService.percentageField(this.percentageLabel)]
      ),
      additionalMaxMCValue: new FormControl(
        this.config?.additionalMaxMCValue
          ? this.config?.additionalMaxMCValue
          : null
      ),
      additionalMaxPsPerGramVaule: new FormControl(
        this.config?.additionalMaxPsPerGramVaule
          ? this.config?.additionalMaxPsPerGramVaule
          : null
      )
      // maxPerGramWeight: new FormControl(
      //   this.config?.additionalMaxPsPerGramVaule ? this.config?.additionalMaxPsPerGramVaule : null,
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
              ? 'RIVAAH_ITEM_GROUP_LEVEL'
              : 'RIVAAH_BEST_DEAL',
          data: {
            additionalMaxMetalCharge: {
              percent:
                formValue.additionalMaxMetalChargePercentage !== ''
                  ? formValue.additionalMaxMetalChargePercentage
                  : null,
              value:
                formValue.additionalMaxMetalChargeValue !== ''
                  ? formValue.additionalMaxMetalChargeValue
                  : null
            },
            additionalMaxStoneCharges: {
              percent:
                formValue.additionalMaxStoneChargePercentage !== ''
                  ? formValue.additionalMaxStoneChargePercentage
                  : null,
              value:
                formValue.additionalMaxStoneChargeValue !== ''
                  ? formValue.additionalMaxStoneChargeValue
                  : null
            },
            additionalMaxUCP: {
              percent:
                formValue.additionalMaxUcpPercentage !== ''
                  ? formValue.additionalMaxUcpPercentage
                  : null,
              value:
                formValue.additionalMaxUCPValue !== ''
                  ? formValue.additionalMaxUCPValue
                  : null
            },

            additionalMaxMC: {
              percent:
                formValue.additionalMaxMCPercentage !== ''
                  ? formValue.additionalMaxMCPercentage
                  : null,
              value:
                formValue.additionalMaxMCValue !== ''
                  ? formValue.additionalMaxMCValue
                  : null
            },
            additionalMaxPsPerGram: {
              percent: null,

              weight:
                formValue.additionalMaxPsPerGramVaule !== ''
                  ? formValue.additionalMaxPsPerGramVaule
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
