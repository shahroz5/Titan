import { Component, Inject, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import {
  ConversionItemDetailsEnum,
  ConversionSplitReqItemPayload,
  ConversionSplitReqPayload,
  InStockConversionTypesEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-request-popup',
  templateUrl: './request-popup.component.html',
  styleUrls: ['./request-popup.component.scss']
})
export class RequestPopupComponent implements OnDestroy {
  destroy$: Subject<null> = new Subject<null>();

  form: FormGroup;

  items: any[] = [];
  splitReqPayload: ConversionSplitReqPayload;

  binsForSelection: SelectionDailogOption[] = [];
  selectedBinCode = '';
  parentForm: FormArray;
  anyChildItemsSold: boolean;
  showWeightMismatchError = false;
  isSelectedItemHasChildItems: boolean;
  requiredChildItems = [];
  minChildItems = 2;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    public fb: FormBuilder,
    private weightFormatter: WeightFormatterService,
    public translate: TranslateService
  ) {
    // To check if selected item has child items
    if (
      this.data?.selectedItem?.childItems?.length > 0 &&
      !this.data?.selectedItem?.autoApproved
    ) {
      this.isSelectedItemHasChildItems = true;
    } else if (
      this.data?.selectedItem?.autoApproved &&
      this.data?.selectedItem?.itemCode.charAt(6) === 'V' &&
      this.data?.selectedItem?.childItems[0]?.itemCode.charAt(10) === '4'
    ) {
      this.isSelectedItemHasChildItems = false;
      this.data.selectedItem = {
        ...this.data.selectedItem,
        childItems: []
      };
    } else {
      this.isSelectedItemHasChildItems = false;

      this.data.selectedItem = {
        ...this.data.selectedItem,
        childItems: []
      };

      for (let i = 0; i < this.minChildItems; i++) {
        if (this.data.selectedItem) {
          this.AddNewChildItem();
        }
      }
    }

    this.form = this.fb.group({
      parentForm: new FormArray([]),
      product: this.data.selectedItem.productCategory,
      inventoryId: this.data.selectedItem.inventoryId,
      itemCode: this.data.selectedItem.itemCode,
      lotNumber: this.data.selectedItem.lotNumber,
      netWeight: this.weightFormatter.format(this.data.selectedItem.stdWeight),
      stonePrice: this.data.selectedItem.stoneValue,
      complexityCode: this.data.selectedItem.complexityCode,
      sold: ConversionItemDetailsEnum.SOLD_Y,
      itemType: InStockConversionTypesEnum.Parent,
      remarks: '',
      binCode: this.data.selectedItem.binCode
    });
  }

  AddNewChildItem() {
    if (this.isSelectedItemHasChildItems === false) {
      this.data.selectedItem.childItems.push({
        itemCode: '',
        productCategoryDesc: '',
        productCategoryCode: '',
        productType: null,
        stoneValue: null,
        stdWeight: null,
        stdValue: null,
        complexityCode: '',
        lotNumber: '',
        binCode: null,
        imageUrl: '',
        inventoryId: null,
        productGroupDesc: '',
        productGroupCode: '',
        weightUnit: null,
        currencyCode: null,
        itemDescription: '',
        childItems: null,
        autoApproved: false
      });
    }
  }
  removeChildItem(index: number) {
    if (
      this.isSelectedItemHasChildItems === false &&
      this.data?.selectedItem?.childItems?.length > this.minChildItems
    ) {
      this.data.selectedItem.childItems.splice(index, 1);
      const childListForm = this.form.get('parentForm') as FormArray;
      childListForm.removeAt(index);
    }
  }
  closePopup(): void {
    this.dialogRef.close();
  }
  sendRequestNow() {
    const requestPayload = this.createPayload();
    if (this.anyChildItemsSold && !this.showWeightMismatchError) {
      this.dialogRef.close(requestPayload);
    }
  }
  createPayload() {
    let totalParentItemWeight = 0;
    let totalChildItemsWeight = 0;
    this.anyChildItemsSold = null;
    this.splitReqPayload = null;
    this.items = [];
    this.requiredChildItems = [];
    const data = this.form.value;
    const itemData: ConversionSplitReqItemPayload = {
      binCode: null,
      inventoryId: data.inventoryId === null ? '' : data.inventoryId,
      itemCode: data.itemCode,
      itemDetails: {
        data: {
          remarks: data.product,
          itemCode: data.itemCode,
          netWeight: +this.weightFormatter.format(data.netWeight),
          stonePrice: data.stonePrice == null ? 0 : data.stonePrice,
          complexityCode: data.complexityCode,
          sold: data.sold,
          itemType: data.itemType
        },
        type: InStockConversionTypesEnum.conversion
      },
      lotNumber: data.lotNumber,
      measuredWeight: +this.weightFormatter.format(data.netWeight),
      quantity: 1
    };
    totalParentItemWeight = itemData.measuredWeight;
    this.items.push(itemData);

    for (const formValue of this.form.value.parentForm) {
      const childItemData: ConversionSplitReqItemPayload = {
        binCode: null,
        inventoryId:
          formValue.inventoryId == null ? null : formValue.inventoryId,
        itemCode: formValue.itemCode,
        itemDetails: {
          data: {
            remarks: formValue.product,
            itemCode: formValue.itemCode,
            netWeight: +this.weightFormatter.format(formValue.netWeight),
            stonePrice: formValue.stonePrice == null ? 0 : formValue.stonePrice,
            complexityCode: formValue.complexityCode,
            sold: formValue.sold,
            itemType: formValue.itemType
          },
          type: InStockConversionTypesEnum.conversion
        },
        lotNumber: formValue.lotNumber,
        measuredWeight: +this.weightFormatter.format(formValue.netWeight),
        quantity: 1
      };
      // Below is to check if any child item is sold
      if (this.anyChildItemsSold !== true) {
        this.anyChildItemsSold =
          formValue.sold === ConversionItemDetailsEnum.SOLD_Y ? true : false;
      }
      // Below is to compute total child items weight
      totalChildItemsWeight =
        Number(totalChildItemsWeight.toFixed(3)) + childItemData.measuredWeight;
      // When Child Items are not there, then passing required child details in otherDetails
      if (this.isSelectedItemHasChildItems) {
        this.items.push(childItemData);
        this.requiredChildItems = [];
      } else {
        this.requiredChildItems.push(childItemData);
      }
    }
    this.splitReqPayload = {
      otherDetails: {
        data: { childItems: this.requiredChildItems },
        type: InStockConversionTypesEnum.OTHERDETAILS
      },
      items: this.items,
      remarks: this.form.get('remarks').value
    };
    // Below check is to validate parent & child items weight
    if (totalParentItemWeight !== Number(totalChildItemsWeight.toFixed(3))) {
      this.showWeightMismatchError = true;
    } else {
      this.showWeightMismatchError = false;
    }

    return this.splitReqPayload;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
