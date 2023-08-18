import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-co-bill-level',
  templateUrl: './discount-co-bill-level.component.html',
  styleUrls: ['./discount-co-bill-level.component.scss']
})
export class DiscountCoBillLevelComponent
  implements OnInit, OnChanges, OnDestroy {
  coBillLevelDiscount: FormGroup;

  @Input() availableDiscounts: any;
  @Input() appliedBillLevelDiscounts: any;
  @Input() cashMemoId: string = null;
  @Input() resetFormEvent: Observable<null>;

  @Output() applyDiscount = new EventEmitter<any>();

  // discountsFormArray: FormArray;

  selectedDiscounts: any;
  coBillLevelDiscountPayload = [];
  selectedDiscountIds = [];
  hasClubbingError = false;
  errorMsg = '';

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    public fb: FormBuilder,
    public currencyFormatterService: CurrencyFormatterService,
    private fieldValidatorService: FieldValidatorsService
  ) {
    this.coBillLevelDiscount = this.fb.group({
      discountsFormArray: this.fb.array([])
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      (changes['availableDiscounts'] || changes['appliedBillLevelDiscounts'])
    ) {
      this.createFormArray();
      this.updateAppliedDiscounts();
    }
  }

  ngOnInit(): void {
    this.resetFormEvent
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedDiscountIds = [];
          this.hasClubbingError = false;
          this.errorMsg = '';
          this.coBillLevelDiscount = this.fb.group({
            discountsFormArray: this.fb.array([])
          });
        }

        this.createFormArray();
        this.updateAppliedDiscounts();
      });
  }

  createFormArray() {
    this.coBillLevelDiscount = this.fb.group({
      discountsFormArray: this.fb.array([])
    });

    for (const discount of this.availableDiscounts) {
      this.discountsFormArray.push(this.createFormGroup(discount));
    }
  }

  createFormGroup(discount: any) {
    return new FormGroup({
      isSelected: new FormControl(false),
      selectedDiscountValue: new FormControl(null, [
        (this.fieldValidatorService.requiredField('Value'),
        !discount.basicCriteriaDetails.isBillValue
          ? (this.fieldValidatorService.percentageField('Value'),
            this.fieldValidatorService.min(
              discount?.basicCriteriaDetails?.ucpValue === 0
                ? 0
                : discount.basicCriteriaDetails.isBillValue
                ? 0.01
                : 0.001,
              'Value'
            ),
            this.fieldValidatorService.max(
              discount.basicCriteriaDetails.ucpValue,
              'Value'
            ))
          : (this.fieldValidatorService.amountField('Value'),
            this.fieldValidatorService.min(
              discount?.basicCriteriaDetails?.ucpValue === 0
                ? 0
                : discount.basicCriteriaDetails.isBillValue
                ? 0.01
                : 0.001,
              'Value'
            ),
            this.fieldValidatorService.max(
              discount.basicCriteriaDetails.ucpValue,
              'Value'
            )))
      ]),

      isBillValue: new FormControl(discount.basicCriteriaDetails.isBillValue),
      isEditable: new FormControl(discount.basicCriteriaDetails.isEditable),
      maxDiscount: new FormControl(discount.basicCriteriaDetails.maxDiscount),
      maxNoOfTimes: new FormControl(discount.basicCriteriaDetails.maxNoOfTimes),
      ucpValue: new FormControl(discount.basicCriteriaDetails.ucpValue),
      discountCode: new FormControl(discount.discountCode),
      discountId: new FormControl(discount.discountId),
      discountType: new FormControl(discount.discountType),
      isOtherBillLevelDiscount: new FormControl(
        discount.clubbingDetails.isOtherBillLevelDiscount
      )
    });
  }

  updateAppliedDiscounts() {
    for (const appliedDiscount of this.appliedBillLevelDiscounts) {
      this.selectedDiscountIds.push(appliedDiscount.discountId);
      let i = 0;
      for (const formData of this.discountsFormArray?.controls) {
        // for (const formData of this.coBillLevelDiscount?.controls) {
        if (appliedDiscount.discountId == formData.value.discountId) {
          const controlArray = <FormArray>(
            this.coBillLevelDiscount.controls['discountsFormArray']
          );
          controlArray.controls[i].patchValue(
            {
              isSelected: true,
              selectedDiscountValue:
                formData.value.isBillValue === true
                  ? appliedDiscount.discountValueDetails.data
                      .discountValueDetails[0].discountValue
                  : appliedDiscount.discountValueDetails.data
                      .discountValueDetails[0].discountPercent
            },
            {
              emitEvent: false
            }
          );
        }
        i++;
      }
    }
  }
  updateForm() {
    let i = 0;
    // for (let appliedDiscountId of this.selectedDiscountIds) {
    for (const formData of this.discountsFormArray.controls) {
      // for (const formData of this.discountsFormArray.controls) {
      for (const appliedDiscountId of this.selectedDiscountIds) {
        const controlArray = <FormArray>(
          this.coBillLevelDiscount.controls['discountsFormArray']
        );
        if (appliedDiscountId !== formData.value.discountId) {
          controlArray.controls[i].patchValue({
            isSelected: false
          });
        } else {
          controlArray.controls[i].patchValue({
            isSelected: true
          });
          break;
        }
      }
      i++;
    }
  }

  // get formArrayControls() {
  //   return this.coBillLevelDiscount.get('discountsFormArray')[
  //     'controls'
  //   ] as FormArray;
  // }
  get discountsFormArray(): FormArray {
    return this.coBillLevelDiscount.get('discountsFormArray') as FormArray;
  }

  OnCheckBoxSelection(rowIndex, event) {
    this.hasClubbingError = false;
    this.errorMsg = '';
    if (!event.checked) {
      const filteredDiscountIds = this.selectedDiscountIds.filter(
        discount =>
          discount !==
          this.discountsFormArray.controls[rowIndex].value.discountId
      );

      const controlArray = <FormArray>(
        this.coBillLevelDiscount.controls['discountsFormArray']
      );
      controlArray.controls[rowIndex].patchValue({
        selectedDiscountValue: null
      });

      this.selectedDiscountIds = filteredDiscountIds;
    } else {
      const controlArray = <FormArray>(
        this.coBillLevelDiscount.controls['discountsFormArray']
      );

      const selectedDiscount = this.discountsFormArray.value.find(
        d => d.discountId === this.selectedDiscountIds[0]
      );
      controlArray.controls[rowIndex].patchValue({
        selectedDiscountValue: this.availableDiscounts[rowIndex]
          ?.basicCriteriaDetails?.ucpValue
          ? this.availableDiscounts[rowIndex].basicCriteriaDetails.ucpValue
          : 0
      });
      if (this.selectedDiscountIds.length === 0) {
        if (
          this.selectedDiscountIds.indexOf(
            this.discountsFormArray.controls[rowIndex].value.discountId
          ) === -1
        ) {
          this.selectedDiscountIds.push(
            this.discountsFormArray.controls[rowIndex].value.discountId
          );
        }
      } else if (
        this.checkIsClubEnabled(rowIndex) &&
        selectedDiscount.isOtherBillLevelDiscount
      ) {
        if (
          this.selectedDiscountIds.indexOf(
            this.discountsFormArray.controls[rowIndex].value.discountId
          ) === -1
        ) {
          this.selectedDiscountIds.push(
            this.discountsFormArray.controls[rowIndex].value.discountId
          );
        }
      } else {
        this.hasClubbingError = true;
        this.errorMsg = !selectedDiscount.isOtherBillLevelDiscount
          ? selectedDiscount?.discountCode +
            ' cannot be clubbed with other CO Bill Level discounts'
          : this.discountsFormArray.controls[rowIndex].value.discountCode +
            ' cannot be clubbed with other CO Bill Level discounts';
      }
    }
    // while (this.selectedDiscountIds.length > 2) {
    //   this.selectedDiscountIds.shift();
    // }
    this.updateForm();
  }
  checkIsClubEnabled(rowIndex) {
    return this.discountsFormArray.controls[rowIndex].value
      .isOtherBillLevelDiscount;
  }
  onApply() {
    this.coBillLevelDiscountPayload = [];
    this.selectedDiscounts = this.coBillLevelDiscount
      .get('discountsFormArray')
      .value.filter(discount => discount.isSelected === true);

    for (const discount of this.selectedDiscounts) {
      this.coBillLevelDiscountPayload.push(this.createPayload(discount));
    }
    this.applyDiscount.emit(this.coBillLevelDiscountPayload);
  }
  createPayload(discount) {
    return {
      discountId: discount.discountId,
      discountType: discount.discountType,
      discountValue:
        discount.isBillValue === true ? discount.selectedDiscountValue : 0,
      discountCode: discount.discountCode,
      discountValueDetails: {
        type: 'DISCOUNT_VALUE_DETAILS',
        data: {
          discountValueDetails: [
            {
              component: 'BILL_DISCOUNT',
              discountPercent:
                discount.isBillValue !== true
                  ? discount.selectedDiscountValue
                  : null,
              discountValue:
                discount.isBillValue === true
                  ? discount.selectedDiscountValue
                  : null,
              isDiscountPercentage: discount.isBillValue ? false : true
            }
          ]
        }
      },
      isEdited: discount.ucpValue !== discount.selectedDiscountValue
    };
  }
  clear() {
    this.coBillLevelDiscount.setControl(
      'discountsFormArray',
      this.fb.array([])
    );
  }
  ngOnDestroy() {
    this.coBillLevelDiscount = this.fb.group({
      discountsFormArray: this.fb.array([])
    });
    this.destroy$.next();
    this.destroy$.complete();
  }
}
