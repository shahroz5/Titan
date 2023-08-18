import { takeUntil, delay } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  FormArray
} from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  OtherReceiptItem,
  BinCode,
  Lov,
  OtherReceiptItemToUpdate,
  OtherReceiptFilterOption,
  OtherReceiptStockItemBinGroupCodeEnum,
  OtherReceiptStockItemBinCodeEnum,
  OtherReceiptItemValidate,
  otherReceiptProductCategoryCodeEnum,
  OtherReceiptOrderTypeEnum,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
@Component({
  selector: 'poss-web-other-receipt-item',
  templateUrl: './other-receipt-item.component.html',
  styleUrls: ['./other-receipt-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherReceiptItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() item: OtherReceiptItem;
  @Input() isVerified: boolean;
  @Input() binGroupCode: string;
  @Input() binCodes: BinCode[];
  @Input() remarks: Lov[];
  @Input() parentForm: FormArray;

  @Output() verify = new EventEmitter<OtherReceiptItemToUpdate>();
  @Output() update = new EventEmitter<OtherReceiptItemToUpdate>();
  @Output() validate = new EventEmitter<OtherReceiptItemValidate>();
  @Output() itemDelete = new EventEmitter();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  showUpdateStatus = true;
  itemForm: FormGroup;
  destroy$ = new Subject<null>();
  binGroupCodes: string[] = [];
  otherReceiptsStockItemBinGroupCodeEnumRef = OtherReceiptStockItemBinGroupCodeEnum;
  binsForSelection: OtherReceiptFilterOption[] = [];
  selectedBinCode: string;
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  isWeightMismatch = false;
  prevMeasuredWeight: number;
  prevBinGroupCode: string;
  matBadgeColor: string;
  itemData: ItemData;

  constructor(
    private selectionDialog: SelectionDialogService,
    private translate: TranslateService,
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.otherReceiptsIssues.searchBinCodeLable',
        'pw.otherReceiptsIssues.selectBinCodeLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.otherReceiptsIssues.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.otherReceiptsIssues.selectBinCodeLable'];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('sasd', this.binGroupCode);
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
      this.prevMeasuredWeight = +this.weightFormatter.format(
        this.itemForm.get('measuredWeight').value
      );

      if (!this.isWeightMismatch) {
        if (
          this.itemForm.get('binGroupCode').value ===
          OtherReceiptStockItemBinGroupCodeEnum.DISPUTE
        ) {
          this.prevBinGroupCode = this.binGroupCode;

          this.selectedBinCode = OtherReceiptStockItemBinCodeEnum.ZERO_BIN;
          this.itemForm.patchValue({
            binGroupCode: this.binGroupCode,
            remarkGroupCode: null
          });
        }
      } else {
        this.prevBinGroupCode = OtherReceiptStockItemBinGroupCodeEnum.DISPUTE;
        this.itemForm.patchValue({
          binGroupCode: OtherReceiptStockItemBinGroupCodeEnum.DISPUTE,
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
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage,
      isHallmarked: this.item.isHallmarked,
    };
    if (
      this.item.binGroupCode === OtherReceiptStockItemBinGroupCodeEnum.DISPUTE
    ) {
      this.isWeightMismatch = true;
    }
    this.binsForSelection = this.binCodes.map(bincode => ({
      id: bincode.binCode,
      description: bincode.description
    }));
    this.binGroupCodes = [
      this.binGroupCode,
      OtherReceiptStockItemBinGroupCodeEnum.DISPUTE,
      OtherReceiptStockItemBinGroupCodeEnum.DEFECTIVE
    ];
    this.itemForm = this.createForm(this.item);

    if (this.item.orderType) {
      switch (this.item.orderType.toLowerCase()) {
        case OtherReceiptOrderTypeEnum.PRIORITY:
          this.matBadgeColor = 'primary';
          break;
        case OtherReceiptOrderTypeEnum.REGUALR:
          this.matBadgeColor = 'warn';
          break;
        case OtherReceiptOrderTypeEnum.SPARE:
          this.matBadgeColor = 'accent';
          break;
      }
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
        availableQuantity: this.item.availableQuantity
      });
    }
  }
  createForm(item: OtherReceiptItem): FormGroup {
    this.selectedBinCode =
      item.binCode &&
      item.binCode !== '' &&
      item.binGroupCode !== OtherReceiptStockItemBinGroupCodeEnum.DISPUTE &&
      item.binGroupCode !== OtherReceiptStockItemBinGroupCodeEnum.DEFECTIVE
        ? item.binCode
        : null;
    const form = new FormGroup(
      {
        id: new FormControl(item.id),

        measuredQuantity: new FormControl(item.measuredQuantity, [
          this.fieldValidatorsService.requiredField('Measured Qty'),
          this.fieldValidatorsService.quantityField('Measured Qty'),
          this.fieldValidatorsService.max(
            item.availableQuantity,
            'Measured Qty'
          ),
          this.fieldValidatorsService.min(
            item.availableQuantity,
            'Measured Qty'
          )
        ]),
        measuredWeight: new FormControl(
          this.weightFormatter.format(item.measuredWeight),
          [
            this.fieldValidatorsService.requiredField('Measured Wt.'),
            this.measuredWeightValidator()
          ]
        ),
        binGroupCode: new FormControl(
          item.binGroupCode,
          this.fieldValidatorsService.requiredField('Bin Group Cod')
        ),
        remarkGroupCode: new FormControl(
          item.remarks && item.remarks !== '' ? item.remarks : null
        )
      },
      [this.remarksValidator()]
    );

    form.get('measuredQuantity').disable();
    if (
      this.item.productCategory &&
      this.item.productCategory.toUpperCase() ===
        otherReceiptProductCategoryCodeEnum.COIN
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
      .subscribe(value => {
        if (this.prevBinGroupCode !== value) {
          this.prevBinGroupCode = value;
          if (value === OtherReceiptStockItemBinGroupCodeEnum.DEFECTIVE) {
            form.patchValue({
              remarkGroupCode: this.remarks[0].code
            });
          }
          if (value === this.binGroupCode) {
            this.selectedBinCode = value;
          }
          form.updateValueAndValidity();

          this.updateItem();
        }
      });

    if (!this.isVerified) {
      this.parentForm.push(form);
      form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(formValue => {
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

  measuredWeightValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value <= 0
        ? { minZero: 'pw.otherReceiptsIssues.weightInvalidErrorMessage' }
        : null;
    };
  }

  remarksValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.get('binGroupCode').value ===
        OtherReceiptStockItemBinGroupCodeEnum.DEFECTIVE &&
        control.get('remarkGroupCode').value === null
        ? {
            remarkGroupCode:
              'pw.otherReceiptsIssues.remarksRequiredErrorMessage'
          }
        : null;
    };
  }

  verifyItem() {
    if (this.itemForm.valid) {
      this.verify.emit(this.createItemPayload());
    } else {
      this.makeFormDirty();
    }
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

  createItemPayload(): OtherReceiptItemToUpdate {
    const itemFormValue = this.itemForm.getRawValue();
    let binCode = this.selectedBinCode;
    if (
      itemFormValue.binGroupCode ===
        OtherReceiptStockItemBinGroupCodeEnum.DISPUTE ||
      itemFormValue.binGroupCode ===
        OtherReceiptStockItemBinGroupCodeEnum.DEFECTIVE
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
          itemFormValue.binGroupCode ===
          OtherReceiptStockItemBinGroupCodeEnum.DEFECTIVE
            ? itemFormValue.remarkGroupCode
            : null,
        // TODO : UIN Verification
        itemDetails: this.item.itemDetails
      },
      actualDetails: {
        binCode: this.item.binCode,
        binGroupCode: this.item.binGroupCode,
        measuredWeight: this.item.measuredWeight,
        remarks: this.item.remarks,
        // TODO : UIN Verification
        itemDetails: this.item.itemDetails
      }
    };
  }

  makeFormDirty() {
    this.itemForm.markAsDirty();
    this.itemForm.controls['measuredQuantity'].markAsDirty();
    this.itemForm.controls['measuredWeight'].markAsDirty();
    this.itemForm.controls['binGroupCode'].markAsDirty();
    this.itemForm.controls['remarkGroupCode'].markAsDirty();
    this.itemForm.controls['binCode'].markAsDirty();
  }

  openBinSelectionPopup(event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectionDialog
      .open({
        title: this.selectBinCodeLable,
        placeholder: this.searchBinCodeLable,
        options: this.binsForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: OtherReceiptFilterOption) => {
        if (selectedOption) {
          if (this.selectedBinCode !== selectedOption.id) {
            this.selectedBinCode = selectedOption.id;
            this.updateItem();
          }
        }
      });
  }
  removeForm(form) {
    form.markAsPristine();
    this.parentForm.removeAt(
      this.parentForm.controls.findIndex(
        itemForm => itemForm.get('id').value === this.item.id
      )
    );
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
