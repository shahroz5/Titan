import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BasicDiscountCategoryConfig,
  DiscountEnums,
  DiscountTypeEnum
} from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  ChangeDetectionStrategy,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-basic-discount-category',
  templateUrl: './basic-discount-category.component.html',
  styleUrls: ['./basic-discount-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDiscountCategoryComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: BasicDiscountCategoryConfig;
  @Input() params;
  @Input() currencyCode: string;
  @Input() enableAccuralOption: boolean;
  @Input() enableUCPValue: boolean;
  @Input() enableMultipleTransactionPerDayOption: boolean;
  @Input() enableStoreEditOption: boolean;
  @Input() enableNarrationOption: boolean;
  @Input() enableMinKaratageEligibleForGEP: boolean;
  @Input() enableSerialNoOption: boolean;
  @Input() enableTataEmployeeConfig: boolean;
  @Input() enableConiConfig: boolean;
  @Input() enableApplicableForAutomatedDiscountOption: boolean;
  @Input() enableFullValueTEPDiscountRecoveryOption: boolean;
  @Output() formDirtyCheck = new EventEmitter<any>();
  @Output() formValidityCheck = new EventEmitter<any>();
  @Output() update = new EventEmitter<BasicDiscountCategoryConfig>();

  destroy$ = new Subject();
  currentDate = moment();
  form: FormGroup;
  maxTransactionPerDayLabel: string;
  ucpValueLabel: string;
  ucpPercentageLabel: string;
  maxCountLabel: string;
  tepCNPercentageLabel: string;
  mcPercentageLabel: string;

  discountTypeEnumRef = DiscountTypeEnum;
  fromDateLabel: any;
  toDateLabel: any;
  serialNoStartsFromLabel: any;
  isUcpValue;
  isUcpPercent = false;
  minKaratageEnableForGEP: any;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translateService
      .get([
        'pw.discountApplicable.maxTransactionPerDayLabel',
        'pw.discountApplicable.ucpValueLabel',
        'pw.discountApplicable.ucpPercentageLabel',
        'pw.discountApplicable.maxCountLabel',
        'pw.discountApplicable.tepCNPercentageLabel',
        'pw.discountApplicable.mcPercentageLabel',
        'pw.discountApplicable.fromDateLabel',
        'pw.discountApplicable.toDateLabel',
        'pw.discountApplicable.serialNoStartsFromPlaceholder',
        'pw.discountApplicable.minKarateEligibleForGEP'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.mcPercentageLabel =
          translatedLabels['pw.discountApplicable.mcPercentageLabel'];

        this.maxTransactionPerDayLabel =
          translatedLabels['pw.discountApplicable.maxTransactionPerDayLabel'];
        this.ucpValueLabel =
          translatedLabels['pw.discountApplicable.ucpValueLabel'];

        this.ucpPercentageLabel =
          translatedLabels['pw.discountApplicable.ucpPercentageLabel'];
        this.maxCountLabel =
          translatedLabels['pw.discountApplicable.maxCountLabel'];
        this.tepCNPercentageLabel =
          translatedLabels['pw.discountApplicable.tepCNPercentageLabel'];
        this.fromDateLabel =
          translatedLabels['pw.discountApplicable.fromDateLabel'];
        this.toDateLabel =
          translatedLabels['pw.discountApplicable.toDateLabel'];
        this.serialNoStartsFromLabel =
          translatedLabels[
            'pw.discountApplicable.serialNoStartsFromPlaceholder'
          ];
        this.minKaratageEnableForGEP =
          translatedLabels['pw.discountApplicable.minKarateEligibleForGEP'];
      });
  }

  createForm() {
    this.form = new FormGroup({
      isNarationMandatory: new FormControl(
        this.config && this.config.isNarationMandatory
          ? this.config.isNarationMandatory
          : false
      ),
      isEditable: new FormControl(
        this.config
          ? this.config.isEditable
            ? this.config.isEditable
            : false
          : false
      ),
      isTepRecovery: new FormControl(
        this.config && this.config.isTepRecovery
          ? this.config.isTepRecovery
          : false
      ),
      isMultipleTransactionPerDayAllowed: new FormControl(
        this.config && this.config.isMultipleTransactionPerDayAllowed
          ? this.config.isMultipleTransactionPerDayAllowed
          : false
      ),

      // TODO: Add custom validator based on isMultipleTransactionPerDayAllowed
      maxTransactionPerDay: new FormControl(
        this.config && this.config.maxTransactionPerDay
          ? this.config.maxTransactionPerDay
          : null,
        [
          this.fieldValidatorsService.numbersField(
            this.maxTransactionPerDayLabel
          ),
          this.fieldValidatorsService.min(1, this.maxTransactionPerDayLabel),
          this.fieldValidatorsService.max(9, this.maxTransactionPerDayLabel)
        ]
      ),

      isUcpValue: new FormControl(
        this.config && this.config.ucp && this.config.ucp.isValue
          ? this.config.ucp.isValue
          : false
      ),
      // TODO: Add custom validator based on isUcpValue

      ucpValue: new FormControl(
        this.config && this.config.ucp && this.config.ucp?.isValue === true
          ? this.config.ucp?.value
          : null,
        this.enableUCPValue && this.config.ucp?.isValue === true
          ? [
              this.fieldValidatorsService.requiredField(this.ucpValueLabel),
              this.fieldValidatorsService.minAmount(
                1,
                this.ucpValueLabel,
                this.currencyCode
              )
            ]
          : []
      ),
      // TODO: Add custom validator based on isUcpValue

      ucpPercentage: new FormControl(
        this.config && this.config.ucp && this.config.ucp?.isValue === false
          ? this.config.ucp?.value
          : null,
        this.config.ucp?.isValue === false
          ? [
              this.fieldValidatorsService.requiredField(
                this.ucpPercentageLabel
              ),
              this.fieldValidatorsService.percentageField(
                this.ucpPercentageLabel
              )
            ]
          : []
      ),

      startingSerialNo: new FormControl(
        this.config && this.config.startingSerialNo
          ? this.config.startingSerialNo
          : null,
        [
          this.fieldValidatorsService.requiredField(
            this.serialNoStartsFromLabel
          ),
          this.fieldValidatorsService.numbersField(this.serialNoStartsFromLabel)
        ]
      ),

      maxCount: new FormControl(
        this.config &&
        this.config.tataEmployeeConfig &&
        this.config.tataEmployeeConfig.maxCount
          ? this.config.tataEmployeeConfig.maxCount
          : null,
        [this.fieldValidatorsService.requiredField(this.maxCountLabel)]
      ),

      tepCNPercentage: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.tepCNPercentage
          ? this.config.coinConfig.tepCNPercentage
          : null
      ),

      makingChargePercentage: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.makingChargePercentage
          ? this.config.coinConfig.makingChargePercentage
          : null,
        [
          this.fieldValidatorsService.makingChargeField(this.mcPercentageLabel),
          this.fieldValidatorsService.min(0, this.mcPercentageLabel),
          this.fieldValidatorsService.max(999, this.mcPercentageLabel)
        ]
      ),

      coinPurchasePeriodFrom: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.coinPurchasePeriod &&
        this.config.coinConfig.coinPurchasePeriod.from
          ? this.config.coinConfig.coinPurchasePeriod.from
          : null
      ),

      coinPurchasePeriodTo: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.coinPurchasePeriod &&
        this.config.coinConfig.coinPurchasePeriod.to
          ? this.config.coinConfig.coinPurchasePeriod.to
          : null
      ),

      tepPeriodFrom: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.tepPeriod &&
        this.config.coinConfig.tepPeriod.from
          ? this.config.coinConfig.tepPeriod.from
          : null
      ),

      tepPeriodTo: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.tepPeriod &&
        this.config.coinConfig.tepPeriod.to
          ? this.config.coinConfig.tepPeriod.to
          : null
      ),

      isFullValueTepDiscountRecovery: new FormControl(
        this.config && this.config.isFullValueTepDiscountRecovery
          ? this.config.isFullValueTepDiscountRecovery
          : false
      ),
      isApplicableForAutomatedDiscount: new FormControl(
        this.config && this.config.isApplicableForAutomatedDiscount
          ? this.config.isApplicableForAutomatedDiscount
          : false
      )
    });
  }

  checkTEPDisable() {
    const value = this.form.value;
    if (value.isTepRecovery === false) {
      this.openConfirmTEPDisable(value);
    }
  }

  dataChangeEvent(value) {
    this.update.emit({
      isNarationMandatory: value.isNarationMandatory,
      isEditable: value.isEditable,
      isTepRecovery: value.isTepRecovery,
      isMultipleTransactionPerDayAllowed:
        value.isMultipleTransactionPerDayAllowed,
      maxTransactionPerDay: value.maxTransactionPerDay,

      ucp: {
        isValue: value.isUcpValue,
        value: value.isUcpValue === true ? value.ucpValue : value.ucpPercentage
      },
      startingSerialNo: value.startingSerialNo,

      tataEmployeeConfig: {
        maxCount: value.maxCount
      },
      isFullValueTepDiscountRecovery: value.isFullValueTepDiscountRecovery,
      isApplicableForAutomatedDiscount: value.isApplicableForAutomatedDiscount,
      coinConfig: {
        tepCNPercentage: value.tepCNPercentage,
        coinPurchasePeriod: {
          from: value.coinPurchasePeriodFrom,
          to: value.coinPurchasePeriodTo
        },
        tepPeriod: {
          from: value.tepPeriodFrom,
          to: value.tepPeriodTo
        },
        makingChargePercentage: value.makingChargePercentage
      }
    });
  }
  ngOnInit() {
    this.createForm();

    if (this.enableUCPValue)
      this.setValidation(this.form.get('isUcpValue').value);
    this.setValidation();

    if (!this.config.isMultipleTransactionPerDayAllowed) {
      this.form.get('maxTransactionPerDay').disable();
    }
    this.form
      .get('coinPurchasePeriodFrom')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.form.get('coinPurchasePeriodTo');
        if (data) {
          endDate.setValidators([
            this.fieldValidatorsService.minDate(data, 'EndDate'),
            this.fieldValidatorsService.requiredField(this.toDateLabel)
          ]);
          endDate.updateValueAndValidity();
        }
      });

    this.form
      .get('tepPeriodFrom')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.form.get('tepPeriodTo');
        if (data) {
          endDate.setValidators([
            this.fieldValidatorsService.minDate(data, 'EndDate'),
            this.fieldValidatorsService.requiredField(this.toDateLabel)
          ]);

          endDate.updateValueAndValidity();
        }
      });
    this.form
      .get('isMultipleTransactionPerDayAllowed')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.updateValueAndValidity();
        const value = this.form.value;

        this.form.get('maxTransactionPerDay').reset();

        if (!value.isMultipleTransactionPerDayAllowed) {
          this.form.get('maxTransactionPerDay').disable();
        } else {
          this.form.get('maxTransactionPerDay').enable();
        }
      });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.form.value;
      this.dataChangeEvent(value);
      this.formValidityCheck.emit(this.form.invalid);
    });
    this.formValidityCheck.emit(this.form.invalid);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDiscount'] && this.form) {
      this.selectedDiscount = this.selectedDiscount;
      this.setValidation();
      if (this.enableUCPValue)
        this.setValidation(this.form.get('isUcpValue').value);

      if (
        this.params === DiscountEnums.NEW &&
        this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT
      ) {
        this.form.get('isEditable').patchValue(true);
      } else {
        this.form.get('isEditable').patchValue(false);
      }
    }
  }

  openConfirmTEPDisable(value) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountApplicable.tepDisableMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.dataChangeEvent(value);
        } else {
          this.form.patchValue({ isTepRecovery: true });
        }
      });
  }

  setValidation(event?) {
    const coinPurchasePeriodFromCtrl = this.form.get('coinPurchasePeriodFrom');
    const coinPurchasePeriodToCtrl = this.form.get('coinPurchasePeriodTo');
    const tepPeriodFromCtrl = this.form.get('tepPeriodFrom');
    const tepPeriodToCtrl = this.form.get('tepPeriodTo');
    const tepCNPercentageCtrl = this.form.get('tepCNPercentage');
    const maxCountCtrl = this.form.get('maxCount');
    const ucpValueCtrl = this.form.get('ucpValue');
    const ucpPercentCtrl = this.form.get('ucpPercentage');
    const startingSerialNoCtrl = this.form.get('startingSerialNo');

    if (this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT) {
      maxCountCtrl.setValidators([
        this.fieldValidatorsService.numbersField(this.maxCountLabel),
        this.fieldValidatorsService.min(1, this.maxCountLabel),
        this.fieldValidatorsService.max(99, this.maxCountLabel),
        this.fieldValidatorsService.requiredField(this.maxCountLabel)
      ]);
    } else maxCountCtrl.clearValidators();

    if (this.enableConiConfig) {
      coinPurchasePeriodFromCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.fromDateLabel)
      ]);
      // coinPurchasePeriodToCtrl.setValidators([
      //   this.fieldValidatorsService.requiredField(this.toDateLabel)
      // ]);
      tepPeriodFromCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.fromDateLabel)
      ]);
      tepPeriodToCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.toDateLabel)
      ]);
      tepCNPercentageCtrl.setValidators([
        this.fieldValidatorsService.percentageField(this.tepCNPercentageLabel),
        this.fieldValidatorsService.requiredField(this.tepCNPercentageLabel)
      ]);
    } else {
      coinPurchasePeriodFromCtrl.clearValidators();
      coinPurchasePeriodToCtrl.clearValidators();
      tepPeriodFromCtrl.clearValidators();
      tepPeriodToCtrl.clearValidators();
      tepCNPercentageCtrl.clearValidators();
    }

    if (this.enableSerialNoOption) {
      startingSerialNoCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.serialNoStartsFromLabel),
        this.fieldValidatorsService.numbersField(this.serialNoStartsFromLabel)
      ]);
    } else {
      startingSerialNoCtrl.clearValidators();
    }

    if (event === true) {
      this.isUcpValue = true;
      this.isUcpPercent = false;
      ucpPercentCtrl.setValidators([]);
      ucpValueCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.ucpValueLabel),
        this.fieldValidatorsService.amountField(this.ucpValueLabel),
        this.fieldValidatorsService.minAmount(
          1,
          this.ucpValueLabel,
          this.currencyCode
        )
      ]);
    } else if (event === false) {
      ucpValueCtrl.setValidators([]);
      ucpPercentCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.ucpPercentageLabel),
        this.fieldValidatorsService.percentageField(this.ucpPercentageLabel),
        this.fieldValidatorsService.min(0.01, this.ucpPercentageLabel)
      ]);
      this.isUcpValue = false;
      this.isUcpPercent = true;
    }
    coinPurchasePeriodFromCtrl.updateValueAndValidity();
    coinPurchasePeriodToCtrl.updateValueAndValidity();
    tepPeriodFromCtrl.updateValueAndValidity();
    tepPeriodToCtrl.updateValueAndValidity();
    tepCNPercentageCtrl.updateValueAndValidity();
    maxCountCtrl.updateValueAndValidity();
    ucpValueCtrl.updateValueAndValidity();
    ucpPercentCtrl.updateValueAndValidity();
    startingSerialNoCtrl.updateValueAndValidity();
  }
  mandatoryCheck() {
    return this.selectedDiscount === DiscountTypeEnum.COIN_OFFER_DISCOUNT;
  }
  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(take(1)).subscribe(val => {
      this.formDirtyCheck.emit(this.form.dirty);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
