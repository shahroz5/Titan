import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-add-manual-foc-popup-item',
  templateUrl: './add-manual-foc-popup-item.component.html',
  styleUrls: ['./add-manual-foc-popup-item.component.scss']
})
export class AddManualFocPopupItemComponent implements OnInit, OnDestroy {
  @Input() manualFocScheme: any;
  @Input() parentForm: FormArray;
  @Input() resetEvent: Observable<any>;
  @Input() unitWeight: string;

  manualFocItemForm: FormGroup;
  displayedColumns = [
    'isSelected',
    'itemCode',
    'quantity',
    'lotNumber',
    'unitWeight',
    'selectedWt'
  ];

  destroy$: Subject<null> = new Subject<null>();
  totalIssueWt = 0;
  totalIssueFocWt = 0;
  constructor(
    public fb: FormBuilder,
    public weightFormatter: WeightFormatterService,
    private fieldValidatorService: FieldValidatorsService
  ) {}

  ngOnInit(): void {
    this.manualFocItemForm = this.createForm(this.manualFocScheme);

    this.createFocItemDetailsList();

    this.parentForm.push(this.manualFocItemForm);

    this.manualFocItemForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formData: any) => {
        this.onFormValueChange();
      });
    this.resetEvent.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.resetForm();
    });
  }

  createForm(item: any): FormGroup {
    this.displayedColumns = [
      'isSelected',
      'itemCode',
      'quantity',
      'lotNumber',
      'unitWeight',
      'selectedWt'
    ];
    return new FormGroup({
      isStockAvailable: new FormControl(this.manualFocScheme.isStockAvailable),
      schemeName: new FormControl(this.manualFocScheme.schemeName),
      schemeId: new FormControl(this.manualFocScheme.schemeId),
      salesTxnId: new FormControl(this.manualFocScheme.salesTxnId),
      inventoryManualFocItemList: this.fb.array([], []),
      otherFocDetails: new FormControl(this.manualFocScheme.otherFocDetails)
    });
  }

  onFormValueChange() {
    let totalIssueItemWt = 0;
    let totalIssueFocWt = 0;
    for (
      let i = 0;
      i <
      this.manualFocItemForm.controls.inventoryManualFocItemList.value.length;
      i++
    ) {
      if (
        this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
          .isSelected
      ) {
        if (
          this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
            .quantity >= 0
        ) {
          totalIssueItemWt =
            +this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
              .unitWeight *
            +this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
              .quantity;

          ((this.manualFocItemForm.controls[
            'inventoryManualFocItemList'
          ] as FormArray).at(i) as FormGroup).patchValue(
            { actualWeight: this.weightFormatter.format(totalIssueItemWt) },
            { emitEvent: false }
          );
        } else {
          ((this.manualFocItemForm.controls[
            'inventoryManualFocItemList'
          ] as FormArray).at(i) as FormGroup).patchValue(
            {
              quantity: 0,
              actualWeight: this.weightFormatter.format(0)
            },
            { emitEvent: false }
          );
        }
      } else {
        if (
          this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
            .quantity > 0
        ) {
          totalIssueItemWt =
            +this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
              .unitWeight *
            +this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
              .quantity;
          ((this.manualFocItemForm.controls[
            'inventoryManualFocItemList'
          ] as FormArray).at(i) as FormGroup).patchValue(
            {
              quantity: this.manualFocItemForm.controls
                .inventoryManualFocItemList.value[i].quantity,
              actualWeight: this.weightFormatter.format(totalIssueItemWt)
            },
            { emitEvent: false }
          );
        } else {
          ((this.manualFocItemForm.controls[
            'inventoryManualFocItemList'
          ] as FormArray).at(i) as FormGroup).patchValue(
            {
              quantity: 0,
              actualWeight: this.weightFormatter.format(0)
            },
            { emitEvent: false }
          );
        }
      }

      totalIssueFocWt =
        Number(totalIssueFocWt) +
        Number(
          this.manualFocItemForm.controls.inventoryManualFocItemList.value[i]
            .actualWeight
        );
    }
    this.totalIssueFocWt = totalIssueFocWt;
  }

  createFocItemDetailsList() {
    this.manualFocScheme.inventoryManualFocItemList.forEach(element => {
      (this.manualFocItemForm.controls[
        'inventoryManualFocItemList'
      ] as FormArray).push(
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
          quantity: new FormControl(
            element.availbleQty ? element.availbleQty : 0,
            [
              this.fieldValidatorService.min(0, 'Qty'),
              this.fieldValidatorService.max(element.availableQuantity, 'Qty'),
              this.fieldValidatorService.quantityField('Qty')
            ]
          ),
          actualWeight: new FormControl(
            element.actualWeight
              ? this.weightFormatter.format(element.actualWeight)
              : this.weightFormatter.format(0)
          )
        })
      );
    });
  }

  get getManualFocItemDetails() {
    return this.manualFocItemForm.get(
      'inventoryManualFocItemList'
    ) as FormArray;
  }

  resetForm() {
    for (
      let i = 0;
      i <
      this.manualFocItemForm.controls.inventoryManualFocItemList.value.length;
      i++
    ) {
      ((this.manualFocItemForm.controls[
        'inventoryManualFocItemList'
      ] as FormArray).at(i) as FormGroup).patchValue({ isSelected: false });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
