import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { DiscountTypeEnum, AbCoConfig } from '@poss-web/shared/models';
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
  selector: 'poss-web-ab-co-config',
  templateUrl: './ab-co-config.component.html',
  styleUrls: ['./ab-co-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbCoConfigComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: AbCoConfig;
  @Input() isABOfferApplicable = true;
  @Input() isCOOfferApplicable = true;

  discountTypeEnuRef = DiscountTypeEnum;

  @Output() update = new EventEmitter<AbCoConfig>();

  destroy$ = new Subject();

  form: FormGroup;
  daysAfterCoLabel: string;
  coUtilizationLabel: string;
  daysAfterAbLabel: string;
  abUtilizationLabel: string;
  @Output() formDirtyCheck = new EventEmitter<any>();
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
        this.daysAfterCoLabel =
          translatedLabels['pw.discountApplicable.noOfDaysLabel'];
        this.coUtilizationLabel =
          translatedLabels['pw.discountApplicable.utilizationPercentageLabel'];
        this.daysAfterAbLabel =
          translatedLabels['pw.discountApplicable.noOfDaysLabel'];
        this.abUtilizationLabel =
          translatedLabels['pw.discountApplicable.utilizationPercentageLabel'];
      });
  }

  ngOnInit() {
    this.form = new FormGroup({
      offerPeriodForCO: new FormControl(this.config.offerPeriodForCO, [
        this.fieldValidatorsService.numbersField(this.daysAfterCoLabel),
        this.fieldValidatorsService.min(0, this.daysAfterCoLabel),
        this.fieldValidatorsService.max(9999, this.daysAfterCoLabel)
      ]),
      coPercent: new FormControl(this.config.coPercent, [
        this.fieldValidatorsService.percentageField(this.coUtilizationLabel)
      ]),
      offerPeriodForAB: new FormControl(this.config.offerPeriodForAB, [
        this.fieldValidatorsService.numbersField(this.daysAfterAbLabel),
        this.fieldValidatorsService.min(0, this.daysAfterAbLabel),
        this.fieldValidatorsService.max(9999, this.daysAfterAbLabel)
      ]),

      abPercent: new FormControl(this.config.abPercent, [
        this.fieldValidatorsService.percentageField(this.abUtilizationLabel)
      ]),
      isGoldRateFrozenForAB: new FormControl(false),
      isGoldRateFrozenForCO: new FormControl(this.config.isGoldRateFrozenForCO),

      isAllowedToChangeAB: new FormControl(this.config.isAllowedToChangeAB),

      isAllowedToChangeCO: new FormControl(this.config.isAllowedToChangeCO),

      isDisplayOnAB: new FormControl(this.config.isDisplayOnAB),

      isDisplayOnCO: new FormControl(this.config.isDisplayOnCO),
      isSizingOnCO: new FormControl(this.config.isSizingOnCO),
      coCreation: new FormControl(this.config.coCreation),
      invokeCO: new FormControl(this.config.invokeCO)
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.form.value;
      this.update.emit({
        offerPeriodForAB: value.offerPeriodForAB
          ? Number(value.offerPeriodForAB)
          : null,
        abPercent: value.abPercent ? Number(value.abPercent) : null,
        isGoldRateFrozenForAB: value.isGoldRateFrozenForAB,
        isAllowedToChangeAB: value.isAllowedToChangeAB,
        isDisplayOnAB: value.isDisplayOnAB,
        coPercent: value.coPercent ? Number(value.coPercent) : null,
        offerPeriodForCO: value.offerPeriodForCO
          ? Number(value.offerPeriodForCO)
          : null,
        isGoldRateFrozenForCO: value.isGoldRateFrozenForCO,
        isAllowedToChangeCO: value.isAllowedToChangeCO,
        isDisplayOnCO: value.isDisplayOnCO,
        isSizingOnCO: value.isSizingOnCO,
        coCreation: value.coCreation,
        invokeCO: value.invokeCO
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
