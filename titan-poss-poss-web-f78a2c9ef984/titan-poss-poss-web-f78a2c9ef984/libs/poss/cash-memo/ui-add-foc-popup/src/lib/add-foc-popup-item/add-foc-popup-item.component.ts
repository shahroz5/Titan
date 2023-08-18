import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormControl,
  FormBuilder,
  ValidatorFn
} from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-add-foc-popup-item',
  templateUrl: './add-foc-popup-item.component.html',
  styleUrls: ['./add-foc-popup-item.component.scss']
})
export class AddFocPopupItemComponent implements OnInit, OnDestroy {
  @Input() focScheme: any;
  @Input() parentForm: FormArray;
  @Input() resetEvent: Observable<any>;

  itemForm: FormGroup;
  spanLength = 0;
  totalIssueWt = 0;
  totalIssueFocWt = 0;
  totalIssueFocQty = 0;
  totalEligibleFocWt = 0;

  destroy$: Subject<null> = new Subject<null>();
  type = '';

  displayedColumns = [
    'isSelected',
    'itemCode',
    'quantity',
    'lotNumber',
    'unitWeight',
    'selectedWt'
  ];
  constructor(
    public fb: FormBuilder,
    public weightFormatter: WeightFormatterService,
    private fieldValidatorService: FieldValidatorsService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.createForm(this.focScheme);

    this.createFocItemDetailsList();

    this.parentForm.push(this.itemForm);

    this.itemForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formData: any) => {
        this.onFormValueChange();
      });
    this.resetEvent.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // this.itemForm.reset();
      this.resetForm();
    });
  }

  createForm(item: any): FormGroup {
    if (this.focScheme.otherFocDetails.weight) {
      this.type = 'weight';
      this.displayedColumns = [
        'isSelected',
        'itemCode',
        'quantity',
        'lotNumber',
        'unitWeight',
        'selectedWt'
      ];
      return new FormGroup({
        isStockAvailable: new FormControl(this.focScheme.isStockAvailable),
        schemeName: new FormControl(this.focScheme.schemeName),
        schemeId: new FormControl(this.focScheme.schemeId),
        salesTxnId: new FormControl(this.focScheme.salesTxnId),
        schemeDetailId: new FormControl(this.focScheme.schemeDetailId),
        purchaseItems: new FormControl(this.focScheme.purchaseItems),
        inventoryFocItemList: this.fb.array(
          [],
          [this.focWeightValidator(this.focScheme.otherFocDetails.weight)]
        ),
        otherFocDetails: new FormControl(this.focScheme.otherFocDetails)
      });
    } else {
      this.type = 'qty';
      this.displayedColumns = [
        'isSelected',
        'itemCode',
        'quantity',
        'lotNumber'
      ];
      return new FormGroup({
        isStockAvailable: new FormControl(this.focScheme.isStockAvailable),
        schemeName: new FormControl(this.focScheme.schemeName),
        schemeId: new FormControl(this.focScheme.schemeId),
        salesTxnId: new FormControl(this.focScheme.salesTxnId),
        schemeDetailId: new FormControl(this.focScheme.schemeDetailId),
        purchaseItems: new FormControl(this.focScheme.purchaseItems),
        inventoryFocItemList: this.fb.array(
          [],
          [this.focQuantityValidator(this.focScheme.otherFocDetails.quantity)]
        ),
        otherFocDetails: new FormControl(this.focScheme.otherFocDetails)
      });
    }
  }
  createPurchaseItemList() {
    this.focScheme.purchaseItems.forEach(element => {
      (this.itemForm.controls['purchaseItems'] as FormArray).push(
        this.fb.group({
          productGroupCode: new FormControl(element.productGroupCode),
          purchasedItemCodes: new FormControl(element.itemCodeList)
        })
      );
    });
  }

  createFocItemDetailsList() {
    // for (const items of this.focScheme.inventoryFocItemList) {
    this.focScheme.inventoryFocItemList.forEach(element => {
      (this.itemForm.controls['inventoryFocItemList'] as FormArray).push(
        this.fb.group({
          availableQuantity: new FormControl(element.availableQuantity),
          binCode: new FormControl(element.binCode),
          imageUrl: new FormControl(element.imageUrl),
          inventoryId: new FormControl(element.inventoryId),
          itemCode: new FormControl(element.itemCode),
          karatage: new FormControl(element.karatage),
          lotNumber: new FormControl(element.lotNumber),
          productCategoryCode: new FormControl(element.productCategoryCode),
          productCategoryDescription: new FormControl(
            element.productCategoryDescription
          ),
          productGroupCode: new FormControl(element.productGroupCode),
          productGroupDescription: new FormControl(
            element.productGroupDescription
          ),
          stdWeight: new FormControl(element.stdWeight),
          unitWeight: new FormControl(element.unitWeight),
          weightDetials: new FormControl(element.weightDetials),
          isSelected: new FormControl(
            element.isSelected ? element.isSelected : false
          ),
          quantity: new FormControl(element.quantity ? element.quantity : 0, [
            this.fieldValidatorService.min(0, 'Qty'),
            this.fieldValidatorService.max(element.availableQuantity, 'Qty'),
            this.fieldValidatorService.quantityField('Qty')
          ]),
          actualWeight: new FormControl(
            element.actualWeight
              ? this.weightFormatter.format(element.actualWeight)
              : this.weightFormatter.format(0)
          ),
          schemeId: new FormControl(this.focScheme.schemeId),
          schemeDetailId: new FormControl(this.focScheme.schemeDetailId)
        })
      );
    });
    this.spanLength =
      this.spanLength + this.focScheme.inventoryFocItemList.length;
  }
  get getFocItemDetails() {
    return this.itemForm.get('inventoryFocItemList') as FormArray;
  }
  onFormValueChange() {
    let totalIssueItemWt = 0;
    let totalIssueFocWt = 0;
    let totalIssueFocQty = 0;
    for (
      let i = 0;
      i < this.itemForm.controls.inventoryFocItemList.value.length;
      i++
    ) {
      if (this.itemForm.controls.inventoryFocItemList.value[i].isSelected) {
        if (
          this.itemForm.controls.inventoryFocItemList.value[i].quantity >= 0
        ) {
          totalIssueFocQty =
            totalIssueFocQty +
            this.itemForm.controls.inventoryFocItemList.value[i].quantity;
          totalIssueItemWt =
            +this.itemForm.controls.inventoryFocItemList.value[i].unitWeight *
            +this.itemForm.controls.inventoryFocItemList.value[i].quantity;

          ((this.itemForm.controls['inventoryFocItemList'] as FormArray).at(
            i
          ) as FormGroup).patchValue(
            { actualWeight: this.weightFormatter.format(totalIssueItemWt) },
            { emitEvent: false }
          );
        } else {
          ((this.itemForm.controls['inventoryFocItemList'] as FormArray).at(
            i
          ) as FormGroup).patchValue(
            {
              quantity: 0,
              actualWeight: this.weightFormatter.format(0)
            },
            { emitEvent: false }
          );
        }
      } else {
        ((this.itemForm.controls['inventoryFocItemList'] as FormArray).at(
          i
        ) as FormGroup).patchValue(
          {
            quantity: 0,
            actualWeight: this.weightFormatter.format(0)
          },
          { emitEvent: false }
        );
      }

      totalIssueFocWt =
        Number(totalIssueFocWt) +
        Number(
          this.itemForm.controls.inventoryFocItemList.value[i].actualWeight
        );
    }
    this.totalIssueFocWt = totalIssueFocWt;
    this.totalIssueFocQty = totalIssueFocQty;
  }
  resetForm() {
    for (
      let i = 0;
      i < this.itemForm.controls.inventoryFocItemList.value.length;
      i++
    ) {
      ((this.itemForm.controls['inventoryFocItemList'] as FormArray).at(
        i
      ) as FormGroup).patchValue({ isSelected: false });
    }
  }
  focWeightValidator(totalEligibleWt: any) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      if (formArray) {
        const totalSelected = formArray.controls.map(control => control.value);
        const allItemWeights = totalSelected.map(value => value.actualWeight);
        const totalItemWeight = allItemWeights.reduce(function (a, b) {
          return Number(a) + Number(b);
        }, 0);
        return Number(totalItemWeight.toFixed(2)) !==
          Number(totalEligibleWt.toFixed(2))
          ? { weightError: true }
          : null;
      }
    };
    return validator;
  }
  focQuantityValidator(totalEligibleQty: any) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      if (formArray) {
        const totalSelected = formArray.controls.map(control => control.value);
        const allItemQty = totalSelected.map(value => value.quantity);
        const totalItemQty = allItemQty.reduce(function (a, b) {
          return Number(a) + Number(b);
        }, 0);
        return Number(totalItemQty?.toFixed(2)) !==
          Number(totalEligibleQty?.toFixed(2))
          ? { quantityError: true }
          : null;
      }
    };
    return validator;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
