import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { DiscountTypeEnum, GRNConfig } from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-grn-config',
  templateUrl: './grn-config.component.html',
  styleUrls: ['./grn-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GRNConfigComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: GRNConfig;
  @Output() update = new EventEmitter<GRNConfig>();

  @Input() enableDaysOptionOfGRN: boolean;
  @Input() enableDaysOptionOfInvoice: boolean;
  @Input() enableAllowedForGRNBeforeOfferPeriodOption: boolean;
  @Input() enableGRNSameCFAEligibleOption: boolean;
  @Input() enableGRNApplicableOption: boolean;
  @Input() enableGrnPercentage: boolean;
  @Output() formDirtyCheck = new EventEmitter<any>();
  destroy$ = new Subject();

  form: FormGroup;

  daysAfterGRNLabel: string;
  grnUtilizationLabel: string;
  daysAfterInvoiceLabel: string;

  discountTypeEnumRef = DiscountTypeEnum;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get([
        'pw.discountApplicable.noOfDaysLabel',
        'pw.discountApplicable.utilizationPercentageLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.daysAfterGRNLabel =
          translatedLabels['pw.discountApplicable.noOfDaysLabel'];
        this.daysAfterInvoiceLabel =
          translatedLabels['pw.discountApplicable.noOfDaysLabel'];
        this.grnUtilizationLabel =
          translatedLabels['pw.discountApplicable.utilizationPercentageLabel'];
      });
  }

  ngOnInit() {
    this.form = new FormGroup({
      grnUtilization: new FormControl(this.config.utilizationPercent, [
        this.fieldValidatorsService.percentageField(this.grnUtilizationLabel)
      ]),
      daysAfterGRN: new FormControl(this.config.noOfDaysAfterOfferPeriod, [
        this.fieldValidatorsService.numbersField(this.daysAfterGRNLabel),
        this.fieldValidatorsService.min(0, this.daysAfterGRNLabel),
        this.fieldValidatorsService.max(9999, this.daysAfterGRNLabel)
      ]),

      daysAfterInvoice: new FormControl(this.config.daysAfterInvoice, [
        this.fieldValidatorsService.numbersField(this.daysAfterInvoiceLabel),
        this.fieldValidatorsService.min(0, this.daysAfterInvoiceLabel),
        this.fieldValidatorsService.max(9999, this.daysAfterInvoiceLabel)
      ]),

      isAllowedForGRNBeforeOfferPeriod: new FormControl(
        this.config.isAllowedBeforeOffer
      ),
      isSameCFAEligible: new FormControl(this.config.isSameCfaEligible),
      isGrnApplicable: new FormControl(this.config.isGrnApplicable)
    });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.form.value;

      this.update.emit({
        utilizationPercent: value.grnUtilization
          ? Number(value.grnUtilization)
          : null,
        noOfDaysAfterOfferPeriod: value.daysAfterGRN
          ? Number(value.daysAfterGRN)
          : null,
        isAllowedBeforeOffer: value.isAllowedForGRNBeforeOfferPeriod,
        isSameCfaEligible: this.form.value?.isAllowedForGRNBeforeOfferPeriod
          ? value.isSameCFAEligible
          : null,
        daysAfterInvoice: value.daysAfterInvoice
          ? Number(value.daysAfterInvoice)
          : null,
        isGrnApplicable: value.isGrnApplicable
      });
    });
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(take(1)).subscribe(val => {
      this.formDirtyCheck.emit(this.form.dirty);
    });
  }

  isValid() {
    return this.form.valid;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
