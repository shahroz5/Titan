import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  CashMemoTaxDetails,
  ProductDetailsInGrid,
  ProductTypesEnum
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-add-coin-popup-item',
  templateUrl: './add-coin-popup-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCoinPopupItemComponent implements OnInit, OnDestroy {
  @Input() item$: Observable<ProductDetailsInGrid>;
  @Input() tax$: Observable<{
    itemCode: string;
    taxDetails: CashMemoTaxDetails;
  }>;
  @Input() currencyCode: string;
  @Output() formData = new EventEmitter();
  @Output() quantity = new EventEmitter();
  totalQuantity = 0;
  totalPrice = 0;
  totalWeight = 0;
  destroy$: Subject<null> = new Subject<null>();
  coinDetailsForm: FormGroup;
  items: FormArray;
  itemCodeArray = [];
  qtyLabel: string;

  constructor(
    public fb: FormBuilder,
    public weightFormatter: WeightFormatterService,
    private fieldValidatorService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.coinDetailsForm = this.fb.group({
      items: this.fb.array([])
    });
    this.translate
      .get(['pw.coinPopup.qtyPlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.qtyLabel = translatedMessages['pw.coinPopup.qtyPlaceHolder'];
      });
  }

  ngOnInit(): void {
    this.item$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductDetailsInGrid) => {
        if (data !== null) {
          if (data.isAdd) this.addItem(data);
          else this.updateItem(data);
          this.getTotalQuantity();
        }
      });

    this.coinDetailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formData: FormGroup) => {
        this.formData.emit({
          formData: formData,
          form: this.coinDetailsForm
        });
        this.getTotalQuantity();
      });
  }

  getTotalQuantity() {
    this.totalQuantity = 0;
    this.totalPrice = 0;
    this.totalWeight = 0;
    this.itemsArray.controls.forEach(element => {
      this.totalQuantity = this.totalQuantity + element.value.quantity;
      this.totalWeight = this.totalWeight + Number(element.value.actualWeight);
      this.totalPrice = this.totalPrice + element.value.totalPrice;
    });
  }

  createForm(item: ProductDetailsInGrid): FormGroup {
    return this.fb.group({
      itemCode: new FormControl(item.itemCode),
      binCode: new FormControl(item.binCode),
      description: new FormControl(item.description),
      selectedLotNumber: new FormControl(item.selectedLotNumber),
      availableLotNumbers: new FormControl(item.availableLotNumbers),
      unitWeight: new FormControl(item.unitWeight),
      actualWeight: new FormControl(item.actualWeight),
      selectedRso: new FormControl(item.selectedRso),
      availableRso: new FormControl(item.availableRso),
      pricePerUnit: new FormControl(item.pricePerUnit),
      discount: new FormControl(0),
      finalPrice: new FormControl(item.finalPrice),
      priceBreakUp: new FormControl(item.priceBreakUp),
      productDetails: new FormControl(item.productDetails),
      inventoryId: new FormControl(item.inventoryId),
      itemId: new FormControl(item.itemId),
      productType: new FormControl(item.productType),
      isAdd: new FormControl(item.isAdd),
      remarks: new FormControl(item.remarks),
      priceDetails: new FormControl(item.priceDetails),
      quantity: new FormControl(item.quantity / item.totalQuantity, [
        this.fieldValidatorService.min(1, this.qtyLabel),
        this.fieldValidatorService.max(item.totalQuantity, this.qtyLabel),
        this.fieldValidatorService.quantityField(this.qtyLabel)
      ]),
      taxDetails: new FormControl(item.taxDetails),
      stdWeight: new FormControl(item.stdWeight),
      productCatergory: new FormControl(item.productCatergory),
      productGroup: new FormControl(item.productGroup),
      status: new FormControl(item.status),
      totalQuantity: new FormControl(item.totalQuantity),
      subTxnType: new FormControl(item.subTxnType),
      karatage: new FormControl(item.karatage),
      makingChargeValue: new FormControl(
        item.priceDetails.makingChargeDetails.preDiscountValue
      ),
      makingChargePercentage: new FormControl(
        item.priceDetails.makingChargeDetails.makingChargePercentage
      )
    });
  }

  addItem(item: ProductDetailsInGrid): void {
    this.items = this.coinDetailsForm.get('items') as FormArray;
    if (!this.itemCodeArray.includes(item.itemCode)) {
      this.items.push(this.createForm(item));
      this.itemCodeArray.push(item.itemCode);
    }
  }

  get itemsArray(): FormArray {
    return this.coinDetailsForm.get('items') as FormArray;
  }

  deleteRow(index: number) {
    this.getTotalQuantity();
    this.itemsArray.removeAt(index);
    this.itemCodeArray.splice(index, 1);
  }

  quantityChange(index: number) {
    if (this.itemsArray.controls[index].get('quantity').valid) {
      this.quantity.emit(this.itemsArray.controls[index]);
    }
  }

  updateItem(data) {
    const index = this.itemsArray.controls.findIndex(
      x => x.value.itemCode === data.itemCode
    );
    if (index !== -1) {
      const updateArray = this.itemsArray.controls[index];
      updateArray.patchValue({
        itemCode: data.itemCode,
        binCode: data.binCode,
        description: data.description,
        selectedLotNumber: data.selectedLotNumber,
        availableLotNumbers: data.availableLotNumbers,
        unitWeight: data.unitWeight,
        actualWeight: this.weightFormatter.format(data.actualWeight),
        selectedRso: data.selectedRso,
        availableRso: data.availableRso,
        pricePerUnit: data.pricePerUnit,
        discount: data.discount,
        karatage: data.karatage,
        quantity: data.quantity,
        makingChargeValue:
          data.priceDetails.makingChargeDetails.preDiscountValue,
        makingChargePercentage:
          data.priceDetails.makingChargeDetails.makingChargePercentage,
        taxDetails: data.taxDetails,
        stdWeight: data.stdWeight,
        productType: ProductTypesEnum.COINS,
        priceDetails: data.priceDetails,
        finalPrice: data.finalPrice,
        priceBreakUp: data.priceBreakUp,
        productDetails: data.productDetails,
        inventoryId: data.inventoryId,
        itemId: data.itemId,
        isAdd: data.isAdd,
        remarks: data.remarks,
        productCatergory: data.productCatergory,
        productGroup: data.productGroup,
        status: data.status,
        totalQuantity: data.totalQuantity,
        subTxnType: data.subTxnType
      });
    }
  }

  /**
   * Method to check quantity input field
   */
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
