import {
  DiscountTypeEnum,
  ClubbingOffersConfig
} from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-clubbing-offers',
  templateUrl: './clubbing-offers.component.html',
  styleUrls: ['./clubbing-offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubbingOffersComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() isSystemDiscount: boolean;
  @Input() enableClubbingBillLevelDiscountOption: boolean;
  @Input() isEmpowermentDiscount: boolean;
  @Input() isCoinOfferDiscount: boolean;
  @Input() isRiva: boolean;
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: ClubbingOffersConfig;
  @Output() update = new EventEmitter<ClubbingOffersConfig>();
  @Output() formValidityCheck = new EventEmitter<any>();

  destroy$ = new Subject();

  form: FormGroup;
  @Output() formDirtyCheck = new EventEmitter<any>();

  options: {
    translationKey: string;
    formControlName: string;
  }[] = [];
  optionSet = new Set<string>();

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDiscount'] && this.form) {
      this.selectedDiscount = this.selectedDiscount;
      this.checkConditions();
    }
    if (changes['isRiva'] && this.form) {
      this.checkConditions();
    }
    this.options = this.getOfferOptions();
    this.options.forEach(data => this.optionSet.add(data.formControlName));
  }

  getOfferOptions(): {
    translationKey: string;
    formControlName: string;
  }[] {
    this.optionSet = new Set<string>();
    if (this.isSystemDiscount) {
      const discounts = [];
      discounts.push({
        formControlName: 'isRiva',
        translationKey: 'pw.discountApplicable.isClubbedRivaLabel'
      });

      return discounts;
    } else {
      const discounts = [
        {
          formControlName: 'isExchangeOffer',
          translationKey: 'pw.discountApplicable.isClubbedExchangeOfferLabel'
        },
        {
          formControlName: 'isFOCOffer',
          translationKey: 'pw.discountApplicable.isClubbedFOCLabel'
        },
        {
          formControlName: 'isGHS',
          translationKey: 'pw.discountApplicable.isClubbedGHSLabel'
        },

        {
          formControlName: 'isDV',
          translationKey: 'pw.discountApplicable.isClubbedDVLabel'
        },
        {
          formControlName: 'isRiva',
          translationKey: 'pw.discountApplicable.isClubbedRivaLabel'
        }
      ];

      // if (!this.isRiva) {
      //   discounts.push({
      //     formControlName: 'isRiva',
      //     translationKey: 'pw.discountApplicable.isClubbedRivaLabel'
      //   });
      // }

      if (this.selectedDiscount !== DiscountTypeEnum.BILL_LEVEL_DISCOUNT) {
        discounts.push({
          formControlName: 'isBillLevelDiscount',
          translationKey: 'pw.discountApplicable.isClubbinedBillDiscountsLabel'
        });
      }
      if (
        this.selectedDiscount !==
        // DiscountTypeEnum.SYSTEM_DISCOUNT &&
        DiscountTypeEnum.COIN_OFFER_DISCOUNT
      ) {
        discounts.push({
          formControlName: 'isCoin',
          translationKey: 'pw.discountApplicable.isClubbeddCoinLabel'
        });
      }

      return discounts;
    }
  }
  createForm() {
    this.form = new FormGroup({
      isExchangeOffer: new FormControl(this.config.isExchangeOffer, [
        this.fieldValidatorsService.requiredField('')
      ]),
      isFOCOffer: new FormControl(this.config.isFOCOffer, [
        this.fieldValidatorsService.requiredField('')
      ]),
      isGHS: new FormControl(this.config.isGHS, [
        this.fieldValidatorsService.requiredField('')
      ]),
      isRiva: new FormControl(false),
      isDV: new FormControl(this.config.isDV, [
        this.fieldValidatorsService.requiredField('')
      ]),
      isCoin: new FormControl(this.config.isCoin),
      isBillLevelDiscount: new FormControl(this.config.isBillLevelDiscount)
    });

    this.form.get('isRiva').disable();
  }
  ngOnInit() {
    this.createForm();
    this.checkConditions();
    this.formValidityCheck.emit(this.form.invalid);
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.form.value;
      this.update.emit({
        isExchangeOffer: this.optionSet.has('isExchangeOffer')
          ? value.isExchangeOffer
          : null,
        isFOCOffer: this.optionSet.has('isFOCOffer') ? value.isFOCOffer : null,
        isGHS: this.optionSet.has('isGHS') ? value.isGHS : null,
        // isRiva: this.optionSet.has('isRiva') ? value.isRiva : null,
        isRiva: false,
        isDV: this.optionSet.has('isDV') ? value.isDV : null,
        isCoin: this.optionSet.has('isCoin') ? value.isCoin : null,
        isBillLevelDiscount: this.optionSet.has('isBillLevelDiscount')
          ? value.isBillLevelDiscount
          : null
      });
      this.formValidityCheck.emit(this.form.invalid);
    });
  }
  checkConditions() {
    const isBillLevelCtrl = this.form.get('isBillLevelDiscount');
    const rivaCtrl = this.form.get('isRiva');
    const isCoinCtrl = this.form.get('isCoin');
    // if (!this.isRiva) {
    //   rivaCtrl.setValidators([this.fieldValidatorsService.requiredField('')]);
    // } else {
    //   rivaCtrl.setValidators([]);
    // }

    if (this.selectedDiscount !== DiscountTypeEnum.BILL_LEVEL_DISCOUNT) {
      isBillLevelCtrl.setValidators([
        this.fieldValidatorsService.requiredField('')
      ]);
    } else {
      isBillLevelCtrl.setValidators([]);
    }
    if (this.selectedDiscount !== DiscountTypeEnum.COIN_OFFER_DISCOUNT) {
      {
        isCoinCtrl.setValidators([
          this.fieldValidatorsService.requiredField('')
        ]);
      }
    } else {
      isCoinCtrl.setValidators([]);
    }
    isCoinCtrl.updateValueAndValidity();
    rivaCtrl.updateValueAndValidity();
    isBillLevelCtrl.updateValueAndValidity();

    this.form.updateValueAndValidity();
  }
  checkClubbingOfferData(): boolean {
    const value = this.form.value;
    console.log(this.optionSet, value);
    return !(
      (this.optionSet.has('isExchangeOffer') &&
        value.isExchangeOffer == null) ||
      (this.optionSet.has('isFOCOffer') && value.isFOCOffer == null) ||
      (this.optionSet.has('isGHS') && value.isGHS == null) ||
      (this.optionSet.has('isDV') && value.isDV == null) ||
      (this.optionSet.has('isCoin') && value.isCoin == null) ||
      (this.optionSet.has('isBillLevelDiscount') &&
        value.isBillLevelDiscount == null)
    );
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
