import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { delay, takeUntil } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import {
  OtherIssuesItem,
  AdjustmentItemToUpdate,
  ItemData
} from '@poss-web/shared/models';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-foc-issue-item',
  templateUrl: './foc-issue-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocIssueItemComponent implements OnInit, OnDestroy {
  @Input() item: OtherIssuesItem;
  @Input() selectionEvents: Observable<any>;
  @Input() cart = true;
  @Input() tab: string;
  @Input() dateFormat: string;

  @Output() selectedItem = new EventEmitter<OtherIssuesItem>();
  @Output() checkBox = new EventEmitter<boolean>();
  @Output() updateItem = new EventEmitter<AdjustmentItemToUpdate>();
  @Output() remove = new EventEmitter<OtherIssuesItem>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();

  readonlyqty = true;
  checkBoxValue = false;
  itemForm: FormGroup;
  destroy$ = new Subject();
  selectedAll: boolean;
  weight: number;
  weightToDisplay: string;
  qty: number;
  tolerance = 0.03;
  weightMismatchError: string;
  quantityError: string;
  readonlyData: boolean;
  productGroupError: string;
  itemData: ItemData;
  quantityLabel: string;
  weightLabel: string;

  constructor(
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService
  ) {
    this.translationService
      .get([
        'pw.otherReceiptsIssues.RequestedQuantityLabelText',
        'pw.otherReceiptsIssues.grossWeightText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.quantityLabel =
          translatedLabels['pw.otherReceiptsIssues.RequestedQuantityLabelText'];
        this.weightLabel =
          translatedLabels['pw.otherReceiptsIssues.grossWeightText'];
      });
  }

  ngOnInit() {
    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: this.item.lotNumber,
      productGroup: this.item.productGroup,
      productCategory: this.item.productCategory,
      stdValue: this.item.stdValue,
      stdWeight: this.item.stdWeight,
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.imageURL,
      mfgDate: this.item.mfgDate,
      orderType: this.item.orderType,
      isStudded: this.item.isStudded,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null
    };

    this.itemForm = this.createForm(this.item);
    this.selectionEvents.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.selectCheckbox === true) {
        this.itemForm.patchValue({ isItemSelected: true });
      } else {
        this.itemForm.patchValue({ isItemSelected: false });
      }
      if (data.enableCheckbox === true) {
        this.itemForm.controls.isItemSelected.enable();
      } else {
        this.itemForm.controls.isItemSelected.disable();
      }
    });

    if (
      this.tab === 'selectedProducts' &&
      this.item.availableQuantity > 1 &&
      this.cart === true
    ) {
      this.readonlyqty = false;
    }

    if (!this.cart) {
      this.readonlyData = true;
    }
  }

  measuredWeight() {
    if (
      Math.abs(
        this.itemForm.get('measuredWeight').value -
          this.item.stdWeight *
            this.itemForm.get('measuredQuantity').value.toFixed(3)
      ) > this.tolerance
    ) {
      this.weightMismatchError = 'Weight Mismatch';
      of(true)
        .pipe(delay(1000), takeUntil(this.destroy$))
        .subscribe(() => {
          this.itemForm.patchValue({
            measuredWeight: this.weightFormatter.format(
              this.item.stdWeight * this.itemForm.get('measuredQuantity').value
            )
          });
        });
    } else {
      this.weightMismatchError = '';
      this.updateItemValue(
        this.itemForm.value.measuredQuantity,
        this.itemForm.value.measuredWeight
      );
    }
  }

  measuredQuantity() {
    if (
      this.itemForm.get('measuredQuantity').value >
        this.item.availableQuantity ||
      this.itemForm.get('measuredQuantity').value <= 0
    ) {
      this.quantityError = 'Invalid Quantity';
      of(true)
        .pipe(delay(1000), takeUntil(this.destroy$))
        .subscribe(() => {
          this.itemForm.patchValue({
            measuredQuantity: this.item.availableQuantity
          });
        });
    } else if (
      this.item.availableQuantity >=
        this.itemForm.get('measuredQuantity').value &&
      this.itemForm.valid
    ) {
      this.itemForm.patchValue({
        measuredWeight: this.weightFormatter.format(
          this.item.stdWeight * this.itemForm.get('measuredQuantity').value
        )
      });
      this.updateItemValue(
        this.itemForm.value.measuredQuantity,
        this.itemForm.value.measuredWeight
      );
      this.quantityError = '';
    }
  }

  createForm(item: OtherIssuesItem): FormGroup {
    this.weight = this.item.measuredWeight;
    this.weightToDisplay = this.weightFormatter.format(this.weight);
    this.qty = this.item.measuredQuantity;
    return new FormGroup({
      measuredQuantity: new FormControl(
        this.qty,
        //    [
        //   Validators.required,
        //   Validators.min(1)
        // ]
        [
          this.fieldValidatorsService.quantityField(this.quantityLabel),
          this.fieldValidatorsService.requiredField(this.quantityLabel),
          this.fieldValidatorsService.min(1, this.quantityLabel)
        ]
      ),
      isItemSelected: new FormControl(''),
      measuredWeight: new FormControl(this.weightFormatter.format(this.weight)),
      binGroupCode: new FormControl(),
      availableQuantity: new FormControl(this.item.availableQuantity)
    });
  }

  /**
   * emits event for remove item from cart
   */
  removeItem() {
    this.remove.emit(this.item);
  }

  /**
   * emits the selected items
   */
  emitSelectedItem() {
    this.selectedItem.emit(this.item);
    this.checkBox.emit(this.checkBoxValue);
  }
  /**
   * creates item payload with updated quantity
   * @param quantity :updated quantity
   */
  createUpdateItemPayload(
    quantity: number,
    weight: number
  ): AdjustmentItemToUpdate {
    return {
      id: this.item.id,
      newUpdate: { quantity: quantity, weight: weight },
      actualDetails: {
        quantity: this.item.totalQuantity,
        weight: this.item.totalWeight
      }
    };
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  selectItem() {
    this.selection.emit({
      id: this.item.id,
      selected: this.itemForm.get('isItemSelected').value
    });
  }
  updateItemValue(quantity: number, weight: number) {
    if (this.itemForm.valid) {
      this.updateItem.emit({
        id: this.item.id,
        actualDetails: {
          quantity: this.item.totalQuantity,
          weight: this.item.totalWeight
        },
        newUpdate: {
          quantity: quantity,
          weight: weight
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
