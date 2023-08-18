import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import {
  BinCode,
  ConversionItemDetailsEnum,
  ImageEvent,
  ItemData,
  ProductPriceDetails
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-conversion-item',
  styleUrls: ['./conversion-item.component.scss'],
  templateUrl: './conversion-item.component.html'
})
export class ConversionItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: any;
  @Input() tab: any;
  @Input() isStudded = false;
  @Input() showButton: any = 'false';
  @Input() isSearching = false;

  @Input() parentForm: FormArray;
  @Input() hasForm: any;
  @Input() binCodes: BinCode[] = [];
  @Input() isWeightEditable = false;
  @Input() conversionWeightToleranceForBangle = 0;
  @Input() priceDetails: ProductPriceDetails;

  @Output() isSplitAvailable = new EventEmitter<any>();
  @Output() showPriceDetails = new EventEmitter<ProductPriceDetails>();

  itemForm: FormGroup;
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  weightLabel: string;
  binCodeLabel: string;

  binsForSelection: SelectionDailogOption[] = [];
  selectedBinCode = '';

  itemData: ItemData;
  conversionItemDetailsEnum = ConversionItemDetailsEnum;
  destroy$: Subject<null> = new Subject<null>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  constructor(
    private selectionDialog: SelectionDialogService,
    private translate: TranslateService,
    public weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.stockReceive.searchBinCodeLable',
        'pw.stockReceive.selectBinCodeLable',
        'pw.conversion.itemWeightText',
        'pw.conversion.binCodeLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.stockReceive.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.stockReceive.selectBinCodeLable'];
        this.weightLabel = translatedMessages['pw.conversion.itemWeightText'];
        this.binCodeLabel = translatedMessages['pw.conversion.binCodeLable'];
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['binCodes']) {
      this.binsForSelection = this.binCodes.map(bincode => ({
        id: bincode.binCode,
        description: bincode.binCode
      }));
    }
    if (changes['item']) {
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
        mfgDate: this.item.mfgDate ? this.item.mfgDate : null,
        orderType: null,
        isStudded: this.item.isStudded,
        sold: this.item?.itemDetails?.sold,
        isHallmarked:
          this.item?.itemDetails?.data?.isHallMarking === 'true' ||
          this.item?.itemDetails?.data?.isHallMarking === true
            ? true
            : false,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
      console.log(this.itemData, 'ItemData');
      if (this.priceDetails && this.itemForm && this.hasForm !== 0) {
        this.itemForm.patchValue({
          makingCharges: this.priceDetails?.priceDetails?.makingChargeDetails
            ?.preDiscountValue,
          makingChargesPct: this.priceDetails?.priceDetails?.makingChargeDetails
            ?.makingChargePercentage,
          finalValue: this.priceDetails?.finalValue
        });
      }
    }
  }

  ngOnInit() {
    if (this.hasForm !== 0) {
      this.itemForm = this.createForm(this.item);
      this.parentForm.push(this.itemForm);
    }
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id ? this.item.id : this.item.inventoryId,
      itemCode: this.item?.itemCode,
      imageUrl: this.item.imageURL
    });
  }

  checkIsSplitAvailable() {
    this.isSplitAvailable.emit(this.item);
  }
  createForm(item: any): FormGroup {
    return new FormGroup({
      inventoryId: new FormControl(item.inventoryId),
      itemCode: new FormControl(item.itemCode),
      lotNumber: new FormControl(item.lotNumber),
      quantity: new FormControl('1'),
      weight: new FormControl(
        this.isWeightEditable ? null : item.stdWeight ? item.stdWeight : '',
        Validators.compose(this.weightValidationCheck(item))
      ),
      binCode: new FormControl(
        this.selectedBinCode,
        Validators.compose([
          this.fieldValidatorsService.requiredField(this.binCodeLabel)
        ])
      ),
      makingCharges: new FormControl(
        item?.priceDetails?.priceDetails?.makingChargeDetails?.preDiscountValue
      ),
      makingChargesPct: new FormControl(
        item?.priceDetails?.priceDetails?.makingChargeDetails?.makingChargePercentage
      ),
      finalValue: new FormControl(item?.priceDetails?.finalValue)
    });
  }

  weightValidationCheck(item) {
    const weightToleranceIngmsmin: any = (
      item.stdWeight -
      (item.stdWeight * this.conversionWeightToleranceForBangle) / 100
    ).toFixed(2);
    const weightToleranceIngmsmax: any = (
      item.stdWeight +
      (item.stdWeight * this.conversionWeightToleranceForBangle) / 100
    ).toFixed(2);
    if (item?.stdWeight) {
      return [
        this.fieldValidatorsService.requiredField(this.weightLabel),
        this.fieldValidatorsService.weightField(this.weightLabel),
        this.fieldValidatorsService.min(
          weightToleranceIngmsmin,
          this.weightLabel
        ),
        this.fieldValidatorsService.max(
          weightToleranceIngmsmax,
          this.weightLabel
        )
      ];
    } else if (!item.stdWeight) {
      return [
        this.fieldValidatorsService.requiredField(this.weightLabel),
        this.fieldValidatorsService.weightField(this.weightLabel),
        this.fieldValidatorsService.min(0.001, this.weightLabel)
      ];
    } else {
      return [];
    }
  }
  openBinSelectionPopup(event = null) {
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
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          if (this.selectedBinCode !== selectedOption.id) {
            this.selectedBinCode = selectedOption.id;
            this.itemForm.patchValue({
              binCode: this.selectedBinCode
            });
          }
        }
      });
  }

  openPriceDetailsPopup() {
    this.showPriceDetails.emit(this.priceDetails);
  }

  ngOnDestroy() {
    if (this.hasForm === 1) {
      while (this.parentForm.length !== 0) {
        this.parentForm.clear();
      }
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
