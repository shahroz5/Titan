import {
  SelectionDialogService,
  SelectionDailogOption
} from '@poss-web/shared/components/ui-selection-dialog';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  FormArray
} from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  ItemOrderTypeEnum,
  StockReceiveProductCategoryCodeEnum,
  StockReceiveItemToUpdate,
  StockReceiveItem,
  StockReceiveItemValidate,
  StockItemBinGroupCodeEnum,
  StockItemBinCodeEnum,
  Lov,
  BinCode,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
@Component({
  selector: 'poss-web-stock-receive-item',
  templateUrl: './stock-receive-item.component.html',
  styleUrls: ['./stock-receive-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReceiveItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() item: StockReceiveItem;
  @Input() isVerified: boolean; // verified/nonVerified
  @Input() binGroupCode: string;
  @Input() binCodes: BinCode[];
  @Input() remarks: Lov[];
  @Input() parentForm: FormArray;
  @Input() isL3Store: boolean;

  @Output() private verify = new EventEmitter<StockReceiveItemToUpdate>();
  @Output() private update = new EventEmitter<StockReceiveItemToUpdate>();
  @Output() private validate = new EventEmitter<StockReceiveItemValidate>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  binGroupCodes: string[] = [];
  showUpdateStatus = true;
  stockItemBinGroupCodeEnumRef = StockItemBinGroupCodeEnum;
  itemForm: FormGroup;
  selectedBinCode: string;
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  isWeightMismatch = false;
  itemData: ItemData;
  quantityLabel: string;
  binGroupLabel: string;
  weightLabel: string;

  private binsForSelection: SelectionDailogOption[] = [];
  private prevMeasuredWeight: number;
  private prevBinGroupCode: string;
  private destroy$ = new Subject<null>();
  itembinGroup: StockItemBinGroupCodeEnum;

  constructor(
    private selectionDialog: SelectionDialogService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private weightFormatter: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {
    this.translate
      .get([
        'pw.stockReceive.searchBinCodeLable',
        'pw.stockReceive.selectBinCodeLable',
        'pw.stockReceive.measuredQuantityPlaceholderText',
        'pw.stockReceive.measuredWeightPlaceholderText',
        'pw.stockReceive.binLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.stockReceive.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.stockReceive.selectBinCodeLable'];
        this.quantityLabel =
          translatedMessages['pw.stockReceive.measuredQuantityPlaceholderText'];
        this.weightLabel =
          translatedMessages['pw.stockReceive.measuredWeightPlaceholderText'];
        this.binGroupLabel = translatedMessages['pw.stockReceive.binLable'];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.isVerified &&
      changes &&
      changes['item'] &&
      changes['item']['currentValue'] &&
      changes['item']['currentValue']['binCode']
    ) {
      this.selectedBinCode = changes['item']['currentValue']['binCode'];
    }
    if (
      this.isVerified &&
      changes &&
      changes['item'] &&
      changes['item']['currentValue'] &&
      (changes['item']['currentValue']['isUpdatingSuccess'] === true ||
        changes['item']['currentValue']['isUpdatingSuccess'] === false)
    ) {
      of(true)
        .pipe(delay(2000))
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => (this.showUpdateStatus = false));

      if (changes['item']['currentValue']['isUpdatingSuccess'] === false) {
        this.itemForm = this.createForm(this.item);
      }
    }
    if (
      changes &&
      changes['item'] &&
      changes['item']['currentValue'] &&
      (changes['item']['currentValue']['isValidatingSuccess'] === true ||
        changes['item']['currentValue']['isValidatingSuccess'] === false)
    ) {
      this.isWeightMismatch = !changes['item']['currentValue'][
        'isValidatingSuccess'
      ];
      this.prevMeasuredWeight = +this.itemForm.get('measuredWeight').value;

      if (!this.isWeightMismatch) {
        if (
          this.itemForm.get('binGroupCode').value ===
          StockItemBinGroupCodeEnum.DISPUTE
        ) {
          this.prevBinGroupCode = this.binGroupCode;
          if (
            this.binGroupCode === StockItemBinGroupCodeEnum.STN ||
            this.binGroupCode === StockItemBinGroupCodeEnum.PURCFA
          ) {
            this.selectedBinCode = StockItemBinCodeEnum.ZERO_BIN;
          }
          if (
            this.binGroupCode === StockItemBinGroupCodeEnum.HALLMARKDISPUTEBIN
          ) {
            this.selectedBinCode = StockItemBinCodeEnum.HALLMARKDISPUTEBIN;
          }
          this.itemForm.patchValue({
            binGroupCode: this.binGroupCode,
            remarkGroupCode: null
          });
        }
      } else {
        this.prevBinGroupCode = StockItemBinGroupCodeEnum.DISPUTE;
        this.itemForm.patchValue({
          binGroupCode: StockItemBinGroupCodeEnum.DISPUTE,
          remarkGroupCode: null
        });
      }
      setTimeout(() => {
        this.updateItem();
      });
    }
    if (
      changes &&
      changes['item'] &&
      changes['item']['currentValue'] &&
      changes['item']['currentValue']['isValidatingError']
    ) {
      console.log(this.item, 'Item Details');
      this.itemForm.patchValue({
        measuredWeight: this.weightFormatter.format(this.prevMeasuredWeight)
      });
    }
    if (changes['item']) {
      this.itemData = {
        ...this.itemData,
        imageURL: this.item.imageURL,
        thumbnailURL: this.item.thumbnailImageURL,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
    }
  }

  ngOnInit() {
    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: this.item.lotNumber,
      productGroup: this.item.productGroupDesc,
      productCategory: this.item.productCategoryDesc,
      stdValue: this.item.stdValue,
      stdWeight: this.item.stdWeight,
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.thumbnailImageURL,
      mfgDate: this.item.mfgDate,
      orderType: this.item.orderType,
      isStudded: this.item.isStudded,
      isHallmarked:
        this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking === true
          ? true
          : false,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      itemDetails: this.item?.itemDetails ? this.item?.itemDetails : null,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };
    if (this.item.binGroupCode === StockItemBinGroupCodeEnum.DISPUTE) {
      this.isWeightMismatch = true;
    }
    if (this.item.binGroupCode === StockItemBinGroupCodeEnum.FOC) {
      this.itembinGroup = StockItemBinGroupCodeEnum.FOC;
    }
    if (this.item.binGroupCode === StockItemBinGroupCodeEnum.STN) {
      this.itembinGroup = StockItemBinGroupCodeEnum.STN;
    }
    if (this.item.binGroupCode === StockItemBinGroupCodeEnum.PURCFA) {
      this.itembinGroup = StockItemBinGroupCodeEnum.PURCFA;
    }
    this.createBinList();
    this.itemForm = this.createForm(this.item);
    if (this.isL3Store) {
      this.itemForm.get('measuredWeight').disable();
    }
  }

  createBinList() {
    this.binsForSelection = this.binCodes.map((bincode: BinCode) => ({
      id: bincode.binCode,
      description: bincode.binCode
    }));
    if (this.isHallMarkItem()) {
      switch (this.item.orderType) {
        case ItemOrderTypeEnum.PRIORITY: {
          this.binGroupCode = StockItemBinGroupCodeEnum.CUSTOMERORDERBIN;
          this.binGroupCodes = [
            this.binGroupCode,
            StockItemBinGroupCodeEnum.DISPUTE
          ];
          break;
        }
        case ItemOrderTypeEnum.REGUALR: {
          // if(this.itembinGroup === StockItemBinGroupCodeEnum.STN){
          //   this.binGroupCode = this.itembinGroup;
          // }
          if (
            this.itembinGroup === StockItemBinGroupCodeEnum.FOC ||
            this.itembinGroup === StockItemBinGroupCodeEnum.CUSTOMERORDERBIN
          ) {
            this.binGroupCode = this.itembinGroup;
          } else {
            if (this.isL3Store) {
              this.binGroupCode = StockItemBinGroupCodeEnum.PURCFA;
            } else {
              this.binGroupCode = StockItemBinGroupCodeEnum.STN;
            }
          }
          this.binGroupCodes = [
            this.binGroupCode,
            StockItemBinGroupCodeEnum.DISPUTE,
            StockItemBinGroupCodeEnum.DEFECTIVE
          ];
          break;
        }
        case ItemOrderTypeEnum.SPARE: {
          this.binGroupCode = StockItemBinGroupCodeEnum.SPARE;
          this.binGroupCodes = [
            this.binGroupCode,
            StockItemBinGroupCodeEnum.DISPUTE
          ];
          break;
        }
      }
    } else {
      this.binGroupCode = StockItemBinGroupCodeEnum.HALLMARKDISPUTEBIN;
      this.binGroupCodes = [
        this.binGroupCode,
        StockItemBinGroupCodeEnum.DISPUTE,
        StockItemBinGroupCodeEnum.DEFECTIVE
      ];
    }
  }

  measuredWeightChange() {
    const newMessuredWeight = +this.itemForm.get('measuredWeight').value;

    if (this.prevMeasuredWeight !== newMessuredWeight) {
      this.showUpdateStatus = true;
      this.validate.emit({
        itemId: this.item.id,
        productGroupCode: this.item.productGroup,
        availableWeight: this.item.availableWeight,
        measuredWeight: newMessuredWeight,
        measuredQuantity: this.item.measuredQuantity,
        availableQuantity: this.item.availableQuantity,
        itemLevelDiscount: this.item.itemLevelDiscount
      });
    }
  }

  openBinSelectionPopup() {
    this.selectionDialog
      .open({
        title: this.selectBinCodeLable,
        placeholder: this.searchBinCodeLable,
        options: this.binsForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          if (this.selectedBinCode !== selectedOption.id) {
            this.selectedBinCode = selectedOption.id;
            this.updateItem();
          }
        }
      });
  }

  updateItem() {
    if (this.isVerified) {
      if (this.itemForm.valid) {
        this.showUpdateStatus = true;
        this.update.emit(this.createItemPayload());
      } else {
        this.makeFormDirty();
      }
    }
  }

  verifyItem() {
    if (!this.isVerified) {
      if (this.itemForm.valid) {
        this.verify.emit(this.createItemPayload());
      } else {
        this.makeFormDirty();
      }
    }
  }

  private createForm(item: StockReceiveItem): FormGroup {
    this.selectedBinCode =
      item.binCode &&
      item.binCode !== '' &&
      (item.binGroupCode === StockItemBinGroupCodeEnum.STN ||
        item.binGroupCode === StockItemBinGroupCodeEnum.PURCFA ||
        item.binGroupCode === StockItemBinGroupCodeEnum.HALLMARKDISPUTEBIN)
        ? item.binCode
        : null;

    const form = new FormGroup(
      {
        id: new FormControl(item.id),
        measuredQuantity: new FormControl(item.measuredQuantity, [
          this.fieldValidatorsService.quantityField(this.quantityLabel),
          this.fieldValidatorsService.requiredField(this.quantityLabel),
          this.fieldValidatorsService.min(
            item.availableQuantity,
            this.quantityLabel
          ),
          this.fieldValidatorsService.max(
            item.availableQuantity,
            this.quantityLabel
          )
        ]),
        measuredWeight: new FormControl(item.measuredWeight, [
          this.fieldValidatorsService.requiredField(this.weightLabel),
          this.measuredWeightValidator()
        ]),
        itemLevelDiscount: new FormControl(
          this.currencyFormatterService.format(
            item.itemLevelDiscount,
            null,
            false
          ),
          [
            //this.fieldValidatorsService.requiredField(this.weightLabel),
            this.measuredWeightValidator()
          ]
        ),
        binGroupCode: new FormControl(
          item.binGroupCode,
          this.fieldValidatorsService.requiredField(this.binGroupLabel)
        ),
        remarkGroupCode: new FormControl(
          item.remarks && item.remarks !== '' ? item.remarks : null
        ),
        value: new FormControl(
          this.currencyFormatterService.format(item.value, null, false)
        ),
        finalValue: new FormControl(
          this.currencyFormatterService.format(item.finalValue, null, false)
        ),
        pricePerUnit: new FormControl(item.pricePerUnit),
        preTaxValue: new FormControl(item.preTaxValue),
        totalTax: new FormControl(item.totalTax)
      },
      [this.remarksValidator()]
    );

    form.get('measuredQuantity').disable();
    form.get('itemLevelDiscount').disable();
    form.get('value').disable();
    if (
      this.item.productCategory &&
      this.item.productCategory.toUpperCase() ===
        StockReceiveProductCategoryCodeEnum.COIN
    ) {
      form.get('measuredWeight').disable();
    }

    this.prevMeasuredWeight = +this.weightFormatter.format(
      form.get('measuredWeight').value
    );
    this.prevBinGroupCode = form.get('binGroupCode').value;

    form
      .get('binGroupCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (this.prevBinGroupCode !== value) {
          this.prevBinGroupCode = value;
          if (value === StockItemBinGroupCodeEnum.DEFECTIVE) {
            form.patchValue({
              remarkGroupCode: ''
            });
          } else if (
            value === StockItemBinGroupCodeEnum.STN ||
            value === StockItemBinGroupCodeEnum.PURCFA
          ) {
            this.selectedBinCode = StockItemBinCodeEnum.ZERO_BIN;
          } else if (value === StockItemBinGroupCodeEnum.HALLMARKDISPUTEBIN) {
            this.selectedBinCode = StockItemBinCodeEnum.HALLMARKDISPUTEBIN;
          }
          form.updateValueAndValidity();
          this.updateItem();
        }
      });

    if (!this.isVerified) {
      this.parentForm.push(form);
      form.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((formValue: any) => {
          if (
            formValue['binGroupCode'] === this.item.binGroupCode &&
            +formValue['measuredWeight'] === +this.item.measuredWeight
          ) {
            form.markAsPristine();
          }
        });
    }
    return form;
  }

  private createItemPayload(): StockReceiveItemToUpdate {
    const itemFormValue = this.itemForm.getRawValue();
    let binCode = this.selectedBinCode;
    if (
      itemFormValue.binGroupCode !== StockItemBinGroupCodeEnum.STN &&
      itemFormValue.binGroupCode !== StockItemBinGroupCodeEnum.PURCFA
    ) {
      binCode = itemFormValue.binGroupCode;
    }

    return {
      id: this.item.id,
      newUpdate: {
        measuredWeight: itemFormValue.measuredWeight,
        binGroupCode: itemFormValue.binGroupCode,
        binCode: binCode,
        remarks:
          itemFormValue.binGroupCode === StockItemBinGroupCodeEnum.DEFECTIVE
            ? itemFormValue.remarkGroupCode
            : null,
        itemDetails: this.item.itemDetails
      },
      actualDetails: {
        binCode: this.item.binCode,
        binGroupCode: this.item.binGroupCode,
        measuredWeight: this.item.measuredWeight,
        remarks: this.item.remarks,
        itemDetails: this.item.itemDetails
      }
    };
  }

  private remarksValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.get('binGroupCode').value ===
        StockItemBinGroupCodeEnum.DEFECTIVE &&
        control.get('remarkGroupCode').value === null
        ? { remarkGroupCode: 'pw.stockReceive.remarksRequiredErrorMessage' }
        : null;
    };
  }

  private removeForm(form) {
    form.markAsPristine();
    this.parentForm.removeAt(
      this.parentForm.controls.findIndex(
        itemForm => itemForm.get('id').value === this.item.id
      )
    );
  }

  private makeFormDirty() {
    this.itemForm.markAsDirty();
    this.itemForm.controls['measuredQuantity'].markAsDirty();
    this.itemForm.controls['itemLevelDiscount'].markAsDirty();
    this.itemForm.controls['measuredWeight'].markAsDirty();
    this.itemForm.controls['binGroupCode'].markAsDirty();
    this.itemForm.controls['remarkGroupCode'].markAsDirty();
  }

  private measuredWeightValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value <= 0
        ? { minZero: 'pw.stockReceive.weightInvalidErrorMessage' }
        : null;
    };
  }

  private isHallMarkItem(): boolean {
    if (this.item?.itemDetails?.data?.isHallmarkEligible) {
      return this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking
        ? true
        : false;
    } else {
      return true;
    }
  }
  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (!this.isVerified) {
      this.removeForm(this.itemForm);
    }
  }
}
