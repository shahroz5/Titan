import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CashMemoItemDetails,
  ItemDetailPopupserviceAbstraction,
  ItemDetailsPopupTabType,
  MetalTypeEnum,
  GrnEnums,
  GrnInitResponse
} from '@poss-web/shared/models';
import {
  POSS_WEB_COIN_PRODUCT_GROUP_CODE,
  POSS_WEB_CURRENCY_CODE
} from '@poss-web/shared/util-config';
import { Observable, Subject } from 'rxjs';
import { elementAt, takeUntil } from 'rxjs/operators';
import { ItemPreviewPopupComponent } from '@poss-web/shared/components/ui-item-preview-popup';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-create-grn-details',
  templateUrl: './create-grn-details.component.html',
  styleUrls: ['./create-grn-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateGrnDetailsComponent implements OnInit, OnDestroy {
  @Input() productDetails = [];
  @Input() item$: Observable<any>;
  @Output() loadImageUrl = new EventEmitter<any>();
  @Output() formData = new EventEmitter();
  @Output() grnType = new EventEmitter<any>();
  @Output() items = new EventEmitter<string[]>();
  @Input() imageUrlData$: Observable<any>;
  @Input() pgDesc$: Observable<{}>;
  @Input() rsoNames = [];
  @Input() isLegacy: boolean;
  @Input() grnDetails: GrnInitResponse;
  destroy$: Subject<null> = new Subject<null>();
  weightCode = 'gms';
  radioFormGroup: FormGroup;
  enumRef: typeof GrnEnums;
  type = GrnEnums.REGULAR_GRN;
  prodGroupDesc: {};
  //selectedAll= false;
  quantityValidatorForm: FormGroup;
  minQuantity = 1;
  maxQuantity: number;
  qtyMsg: string;

  totalQuantity = 0;
  totalPrice = 0;
  totalWeight = 0;

  productDetailsForm: FormGroup;
  itemsrow: FormArray;
  itemCodeArray = [];
  @Output() quantity = new EventEmitter();
  selectedAll: FormControl;

  constructor(
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    public dialog: MatDialog,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private formbuilder: FormBuilder,
    private fieldValidatorService: FieldValidatorsService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.productDetailsForm = this.formBuilder.group({
      itemsrow: this.formBuilder.array([])
    });
    this.radioFormGroup = new FormGroup({
      selectRadioButton: new FormControl(this.type)
    });
    this.enumRef = GrnEnums;
  }

  ngOnInit() {
    this.translate
      .get(['pw.productGrid.quantityFieldMsg'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.qtyMsg = translatedMessages['pw.productGrid.quantityFieldMsg'];
      });

    if (this.productDetails?.length > 0) {
      this.productDetails.forEach(item => {
        if (item !== null) {
          this.addItem(item);
          this.getTotalQuantity();
        }
      });
    }

    this.item$.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data !== null) {
        this.updateItem(data);
        this.getTotalQuantity();
      }
    });

    this.productDetailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formData: FormGroup) => {
        this.formData.emit({
          formData: formData,
          form: this.productDetailsForm
        });
        this.getTotalQuantity();
      });
    this.imageUrlData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== null) {
        this.openPopup(data);
      }
    });

    this.pgDesc$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== null) {
        this.prodGroupDesc = data;
      }
    });
    // this.grnType.emit(this.type);
    this.radioFormGroup
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(grnType => {
        this.grnType.emit(grnType);
      });

    this.selectedAll = new FormControl(false);
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

  addItem(item: any): void {
    this.itemsrow = this.productDetailsForm.get('itemsrow') as FormArray;
    if (!this.itemCodeArray.includes(item.id)) {
      this.itemsrow.push(this.createForm(item));
      this.itemCodeArray.push(item.id);
    }
  }

  createForm(data: any): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(data.id),
      itemCode: new FormControl(data.itemCode),
      lotNumber: new FormControl(data.lotNumber),
      inventoryId: new FormControl(data.inventoryId),
      unitWeight: new FormControl(data.unitWeight),
      unitValue: new FormControl(data.pricePerUnit),
      totalWeight: new FormControl(data.totalWeight),
      totalDiscount: new FormControl(data.totalDiscount),
      productGroupCode: new FormControl(data.productGroupCode),
      finalValue: new FormControl(data.finalValue),
      employeeCode: new FormControl(data.employeeCode),
      totalValue: new FormControl(data.totalValue),
      totalQuantity: new FormControl(data.totalQuantity, [
        this.fieldValidatorService.min(1, this.qtyMsg),
        this.fieldValidatorService.max(data.totalQuantity, this.qtyMsg),
        this.fieldValidatorService.quantityField(this.qtyMsg)
      ]),
      priceDetails: new FormControl(data.priceDetails),
      isHallmarked: new FormControl(
        data?.priceDetails?.itemHallmarkDetails?.isHallmarked
      ),
      hmQuantity: new FormControl(
        data?.priceDetails?.itemHallmarkDetails?.hmQuantity
          ? data?.priceDetails?.itemHallmarkDetails?.hmQuantity
          : 0
      ),
      isFOCForHallmarkingCharges: new FormControl(
        data?.priceDetails?.itemHallmarkDetails?.isFOCForHallmarkingCharges
      ),
      taxDetails: new FormControl(data.taxDetails),
      productCategoryCode: new FormControl(data.productCategoryCode),
      binCode: new FormControl(data.binCode),
      selected: new FormControl({
        value: data.selected,
        disabled: this.grnDetails?.isVoid ? true : false
      })
    });
  }

  get itemsArray(): FormArray {
    return this.productDetailsForm.get('itemsrow') as FormArray;
  }

  updateItem(data) {
    const index = this.itemsArray.controls.findIndex(
      x => x.value.id === data.id
    );
    if (index !== -1) {
      const updateArray = this.itemsArray.controls[index];
      updateArray.patchValue({
        id: data.id,
        itemCode: data.itemCode,
        lotNumber: data.lotNumber,
        inventoryId: data.inventoryId,
        unitWeight: data.unitWeight,
        unitValue: data.pricePerUnit,
        totalWeight: data.totalWeight,
        totalDiscount: data.totalDiscount,
        productGroupCode: data.productGroupCode,
        finalValue: data.finalValue,
        employeeCode: data.employeeCode,
        totalValue: data.totalValue,
        totalQuantity: data.totalQuantity,
        priceDetails: data.priceDetails,
        isHallmarked: data?.priceDetails?.itemHallmarkDetails?.isHallmarked,
        hmQuantity: data?.priceDetails?.itemHallmarkDetails?.hmQuantity
          ? data?.priceDetails?.itemHallmarkDetails?.hmQuantity
          : 0,
        isFOCForHallmarkingCharges:
          data?.priceDetails?.itemHallmarkDetails?.isFOCForHallmarkingCharges,
        taxDetails: data.taxDetails,
        productCategoryCode: data.productCategoryCode,
        binCode: data.binCode,
        selected: data.selected
      });
    }
  }

  quantityChange(index: number) {
    if (this.itemsArray.controls[index].get('totalQuantity').valid) {
      let item = this.itemsArray.controls[index].value;
      this.productDetails = this.productDetails.map(element => {
        if (element.id === item.id) {
          element = { ...element, totalQuantity: item.totalQuantity };
        }
        return element;
      });
      this.quantity.emit(item);
      if (item.selected) {
        this.emitIds();
      }
    }
  }

  showPopup(index): void {
    this.loadImageUrl.emit(
      this.itemsArray.controls[index].get('itemCode').value
    );
  }

  emitIds() {
    const selectedItems = [];
    this.productDetails.forEach(item => {
      if (item.selected) {
        selectedItems.push({
          itemId: item.id,
          totalQuantity: item.totalQuantity
        });
      }
    });
    this.items.emit(selectedItems);
  }

  selectAll(isChecked: boolean) {
    this.productDetails = this.productDetails.map(item => ({
      ...item,
      selected: isChecked
    }));
    this.productDetails.forEach(item => {
      if (item !== null) {
        this.updateItem(item);
        this.getTotalQuantity();
      }
    });
    this.emitIds();
    console.log(this.productDetails, 'Product Details');
  }

  selectionChange(itemId: number, isChecked: boolean) {
    this.productDetails = this.productDetails.map(element => {
      if (element.id === itemId) {
        element = { ...element, selected: isChecked };
      }
      return element;
    });
    this.emitIds();
    if (isChecked === false) {
      this.selectedAll.patchValue(false);
    } else {
      this.selectedAll.patchValue(
        this.productDetails.every(function (element: any) {
          return element.selected == true;
        })
      );
    }
    this.cdr.detectChanges();
    console.log(this.selectedAll.value, 'selectedAll');
  }

  openItemDetails(index?: any) {
    let dataToBeLoaded;
    if (this.productDetails.length) {
      dataToBeLoaded = this.productDetails.filter(
        element =>
          element.id === this.itemsArray.controls[index].get('id').value
      )[0];
    }
    const priceResult = calculatePriceBreakup(
      dataToBeLoaded.priceDetails,
      dataToBeLoaded.taxDetails?.data,
      {
        isUcp: dataToBeLoaded.priceDetails?.isUcp,
        totalValue: dataToBeLoaded.totalValue,
        weightUnit: this.weightCode,
        weight: dataToBeLoaded.totalWeight
      },
      dataToBeLoaded.totalDiscount
    );
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      dataToBeLoaded?.priceDetails?.metalPriceDetails?.metalPrices;
    dataArray?.forEach(element => {
      if (element.metalTypeCode === MetalTypeEnum.GOLD) {
        goldRate = {
          karat: element.karat,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.PLATINUM) {
        platinumRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.SILVER) {
        silverRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }
    });
    this.itemDetailPopupservice.open({
      tabs: [
        ItemDetailsPopupTabType.PRICE_DETAILS,
        ItemDetailsPopupTabType.STONE_DETAILS
      ],
      currencyCode: this.defaultCurrencyCode,
      weightUnit: this.weightCode,
      headerDetails: {
        showTitle: true,
        itemCode: dataToBeLoaded.itemCode,
        lotNumber:
          dataToBeLoaded.productGroupCode === '73' ||
          dataToBeLoaded.productGroupCode === '82'
            ? dataToBeLoaded.totalQuantity
            : dataToBeLoaded.lotNumber,
        productCategory: dataToBeLoaded.productCategoryCode,
        productGroup: dataToBeLoaded.productGroupCode,
        grossWeight: dataToBeLoaded.totalWeight,
        netWeight: dataToBeLoaded.priceDetails?.isUcp
          ? dataToBeLoaded.totalWeight
          : priceResult?.totalMetalWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate
      },
      priceBreakup: priceResult
    });
  }
  getQuantity(totalQuantity: number) {
    this.quantityValidatorForm.patchValue({
      itemQuantity: totalQuantity
    });
  }

  openPopup(data) {
    this.dialog.open(ItemPreviewPopupComponent, {
      height: '525px',
      width: '700px',
      autoFocus: false,
      data: {
        imageUrl: data.imageUrl,
        itemCode: data.itemCode
      }
    });
  }
  getProductGroupDesc(productGroupCode) {
    if (productGroupCode && this.prodGroupDesc) {
      return this.prodGroupDesc[`${productGroupCode}`];
    } else {
      return productGroupCode;
    }
  }
  // display rso name from rso code
  getRsoNameFromCode(code: string) {
    if (this.rsoNames.length !== 0) {
      for (const rso of this.rsoNames) {
        if (rso.code === code) return rso.name;
      }
    }
    return code;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
