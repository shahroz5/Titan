import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DiscountApplicableEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-discount-exchange-offer-config',
  templateUrl: './discount-exchange-offer-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountExchangeOfferConfigComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() discountDetails;
  @Output() formOutput = new EventEmitter<any>();
  @Output() formDirty = new EventEmitter<any>();
  exchangeOfferForm: FormGroup;

  destroy$ = new Subject();
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.exchangeOfferForm = new FormGroup({
      tepcreditNote: new FormControl(
        this.discountDetails.configDetails.data.applicableCN?.isTep
      ),
      gepcreditNote: new FormControl(
        this.discountDetails.configDetails.data.applicableCN?.isGep
      ),
      minCNUtilisation: new FormControl(
        this.discountDetails.configDetails.data.minCNUtilizationPercent,
        [
          this.fieldValidatorsService.requiredField('Minimum CN Utilisation %'),
          this.fieldValidatorsService.percentageField(
            'Minimum CN Utilisation %'
          )
        ]
      ),
      minKaratageEligible: new FormControl(
        this.discountDetails.configDetails.data.minKarateEligibleForGEP,
        [
          this.fieldValidatorsService.requiredField(
            'Min Karatage Eligible For GEP'
          ),
          this.fieldValidatorsService.karatField(
            'Min Karatage Eligible For GEP'
          )
        ]
      ),
      residualRefund: new FormControl(
        this.discountDetails.configDetails.data.isResidualFund
      )
    });
  }
  ngAfterViewInit(): void {
    this.exchangeOfferForm.valueChanges.pipe(take(1)).subscribe(val => {
      this.formDirty.emit(this.exchangeOfferForm.dirty);
    });
  }
  save() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const values = this.exchangeOfferForm.getRawValue();
      if (!values.tepcreditNote && !values.gepcreditNote) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: 'pw.discountConfig.creditNotesMandatoryMsg'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
            }
          });
      } else {
        this.formOutput.emit({
          configDetails: {
            data: {
              applicableCN: {
                isTep: values.tepcreditNote,
                isGep: values.gepcreditNote
              },
              minCNUtilizationPercent: values.minCNUtilisation
                ? Number(values.minCNUtilisation)
                : null,
              minKarateEligibleForGEP: values.minKaratageEligible
                ? Number(values.minKaratageEligible)
                : null,
              isResidualFund: values.residualRefund
            },
            type: DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG
          }
        });
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
