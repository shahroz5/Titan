import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  AdjustmentItem,
  OtherReceiptUpdateAdjustementItemPayload,
  BinCode,
  OtherReceiptFilterOption,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-psv-receipt-item',
  templateUrl: './psv-receipt-item.component.html',
  styleUrls: ['./psv-receipt-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsvReceiptItemComponent implements OnInit, OnDestroy {
  @Input() hasRemove = true;
  @Input() item: AdjustmentItem;
  @Input() selectionEvents: Observable<any>;
  @Input() binGroupCode: string;
  @Input() binCodes: BinCode[] = [];

  @Output() selectedItem = new EventEmitter<AdjustmentItem>();
  @Output() checkBox = new EventEmitter<boolean>();
  @Output() updateItem = new EventEmitter<
    OtherReceiptUpdateAdjustementItemPayload
  >();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();
  @Output() remove = new EventEmitter<AdjustmentItem>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: string;
  }> = new EventEmitter();

  selectedAll: boolean;
  itemForm: FormGroup;
  selectForm: FormGroup;
  readonlyqty = true;
  checkBoxValue = false;
  assignBinCode: string;
  destroy$ = new Subject();
  readonlyData: boolean;
  productGroupError: string;
  weightMismatchError: string;
  quantityError: string;
  itemData: ItemData;
  selectedBinCode: string;
  searchBinCodeLable: any;
  selectBinCodeLable: any;
  binsForSelection: OtherReceiptFilterOption[] = [];
  quantityLabel: string;
  weightLabel: string;

  constructor(
    private selectionDialog: SelectionDialogService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private weightFormatter: WeightFormatterService
  ) {
    this.translate
      .get([
        'pw.otherReceiptsIssues.searchBinCodeLable',
        'pw.otherReceiptsIssues.selectBinCodeLable',
        'pw.otherReceiptsIssues.itemQuantityLabelText',
        'pw.otherReceiptsIssues.itemWeightLableText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.otherReceiptsIssues.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.otherReceiptsIssues.selectBinCodeLable'];
        this.quantityLabel =
          translatedMessages['pw.otherReceiptsIssues.itemQuantityLabelText'];
        this.weightLabel =
          translatedMessages['pw.otherReceiptsIssues.itemWeightLableText'];
      });
  }

  ngOnInit() {
    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: null,
      productGroup: this.item.productGroup,
      productCategory: this.item.productCategory,
      stdValue: this.item.stdValue,
      stdWeight: null,
      currencyCode: null,
      weightUnit: null,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.thumbnailImageURL,
      mfgDate: null,
      isStudded: this.item.isStudded,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage,
      isHallmarked: this.item?.isHallmarked,
    };
    this.readonlyqty = true;
    this.selectForm = new FormGroup({
      isItemSelected: new FormControl('')
    });
    this.selectionEvents.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.selectCheckbox === true) {
        this.selectForm.patchValue({ isItemSelected: true });
      } else {
        this.selectForm.patchValue({ isItemSelected: false });
      }
      if (data.enableCheckbox === true) {
        this.selectForm.controls.isItemSelected.enable();
      } else {
        this.selectForm.controls.isItemSelected.disable();
      }
    });
    this.itemForm = this.createForm(this.item);
    this.itemForm.markAllAsTouched();

    if (!this.hasRemove) {
      this.readonlyData = true;
    }
    if (this.binCodes.length > 0) {
      this.binsForSelection = this.binCodes.map(bincode => ({
        id: bincode.binCode,
        description: bincode.description
      }));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  change(event) {
    this.assignBinCode = event.value;
  }

  measuredWeight() {
    this.weightMismatchError = '';
    this.updateItemValue(
      this.itemForm.value.measuredQuantity,
      this.itemForm.value.measuredWeight,
      this.itemForm.value.assignedBin,
      this.selectedBinCode,
      this.itemForm.get('isHallmarked').value
    );
  }

  selecthallMark(event){
    if(event){
      this.itemForm.get('isHallmarked').setValue(event.checked);
      this.itemForm.get('isHallmarked').updateValueAndValidity()
    }
    this.updateItemValue(
      this.itemForm.value.measuredQuantity,
      this.itemForm.value.measuredWeight,
      this.itemForm.value.assignedBin,
      this.selectedBinCode,
       this.itemForm.get('isHallmarked').value,
    );
  }

  measuredQuantity() {
    this.updateItemValue(
      this.itemForm.value.measuredQuantity,
      this.itemForm.value.measuredWeight,
      this.itemForm.value.assignedBin,
      this.selectedBinCode,
      this.itemForm.get('isHallmarked').value
    );
    this.quantityError = '';
  }
  createForm(item: AdjustmentItem): FormGroup {
    this.selectedBinCode = item.binCode;
    return new FormGroup({
      measuredQuantity: new FormControl(
        item.measuredQuantity,
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
      measuredWeight: new FormControl(
        item.measuredWeight
          ? this.weightFormatter.format(item.measuredWeight)
          : null,
        // [Validators.required, Validators.min(1)]
        [
          this.fieldValidatorsService.weightField(this.weightLabel),
          this.fieldValidatorsService.requiredField(this.weightLabel),
          this.fieldValidatorsService.min(0.01, this.weightLabel)
        ]
      ),
      assignedBin: new FormControl(this.hasRemove ? this.binGroupCode : null),
      isHallmarked: new FormControl(item.isHallmarked)
    });
  }
  emitSelectedItem() {
    this.selectedItem.emit(this.item);
    this.checkBox.emit(this.checkBoxValue);
  }
  selectItem() {
    this.selection.emit({
      id: this.item.itemCode,
      selected: this.selectForm.get('isItemSelected').value
    });
  }
  removeItem() {
    this.remove.emit(this.item);
  }
  updateItemValue(
    quantity: number,
    weight: number,
    assignedBin: string,
    assignedBinCode: string,
    isHallmark:boolean
  ) {
    this.updateItem.emit({
      itemId: this.item.itemCode,
      items: {
        itemCode: this.item.itemCode,
        measuredWeight: weight,
        binCode: assignedBinCode,
        binGroupCode: assignedBin,
        value: this.item.stdValue,
        quantity: quantity,
        isHallmarked : isHallmark,
      }
    });
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
          this.selectedBinCode = selectedOption.id;
          this.updateItemValue(
            this.itemForm.value.measuredQuantity,
            this.itemForm.value.measuredWeight,
            this.itemForm.value.assignedBin,
            this.selectedBinCode,
            this.itemForm.get('isHallmarked').value
          );
        }
      });
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: '',
      itemCode: this.item?.itemCode,
      imageUrl: this.item.imageURL
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
