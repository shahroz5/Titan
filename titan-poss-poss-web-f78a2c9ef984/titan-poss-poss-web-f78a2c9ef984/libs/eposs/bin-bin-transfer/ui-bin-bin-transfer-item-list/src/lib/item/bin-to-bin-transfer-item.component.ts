import {
  BinToBinTransProductCategoryCodeEnum,
  BinToBinTransBinsferEnum,
  BinToBinTransferItem,
  StoreBin,
  ItemData,
  ImageEvent,
  StockItemBinGroupCodeEnum,
  SelectDropDownOption
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  HostListener,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { SelectionDialogGridService } from '@poss-web/shared/components/ui-selection-dialog-grid';
import { FormControl } from '@angular/forms';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-bin-to-bin-transfer-item',
  templateUrl: './bin-to-bin-transfer-item.component.html',
  styleUrls: ['./bin-to-bin-transfer-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BinToBinTransferItemComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() item: BinToBinTransferItem;
  @Input() canSelect = false;
  @Input() canDelete = false;
  @Input() showSourceBin = false;
  @Input() showDestinationBin = false;
  @Input() bins: StoreBin[] = [];
  @Input() isSelectAll = false;
  @Input() selectedBin: string;
  @Input() defectTypeDescriptionList: SelectDropDownOption[];
  @Input() defectCodeDescriptionList: SelectDropDownOption[];

  @Output() updateItem = new EventEmitter<BinToBinTransferItem>();
  @Output() delete = new EventEmitter<string>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  itemData: ItemData;
  selectDestinationBinLableText: string;
  searchDestinationBinLableText: string;
  binsForSelection: StoreBin[] = [];
  transferQuantity: FormControl;
  availableQuantityLable: string;
  stockItemBinGroupCodeEnumRef = StockItemBinGroupCodeEnum;
  defectTypeDescription: FormControl;
  defectCodeDescription: FormControl;

  private destroy$ = new Subject();

  constructor(
    private selectionDialog: SelectionDialogGridService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    const selectDestinationBinLableText =
      'pw.binToBinTransfer.selectDestinationBinLableText';
    const searchDestinationBinLableText =
      'pw.binToBinTransfer.searchDestinationBinLableText';
    const availableQuantityLableText =
      'pw.binToBinTransfer.itemQuantityLableText';
    this.translate
      .get([selectDestinationBinLableText, searchDestinationBinLableText])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectDestinationBinLableText =
          translatedMessages[selectDestinationBinLableText];
        this.searchDestinationBinLableText =
          translatedMessages[searchDestinationBinLableText];
        this.availableQuantityLable =
          translatedMessages[availableQuantityLableText];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      if (
        this.item.isDisabled &&
        this.transferQuantity?.value !== this.item.availableQuantity
      ) {
        this.transferQuantity.setValue(this.item.availableQuantity);
      }

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
    this.transferQuantity = new FormControl(this.item.availableQuantity, [
      this.fieldValidatorsService.quantityField(this.availableQuantityLable),
      this.fieldValidatorsService.requiredField(this.availableQuantityLable),
      this.fieldValidatorsService.min(1, this.availableQuantityLable),
      this.fieldValidatorsService.max(
        this.item.availableQuantity,
        this.availableQuantityLable
      )
    ]);
    this.defectTypeDescription = new FormControl(null, [
      this.fieldValidatorsService.requiredField(this.availableQuantityLable)
    ]);
    this.defectCodeDescription = new FormControl(null, [
      this.fieldValidatorsService.requiredField(this.availableQuantityLable)
    ]);

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
      isStudded: this.item.isStudded,
      isHallmarked:
        this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking === true
          ? true
          : false,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };

    if (
      this.item.productCategory &&
      this.item.productCategory.toUpperCase() !==
        BinToBinTransProductCategoryCodeEnum.COIN
    ) {
      this.bins = this.bins.filter(
        bin =>
          bin.binGroupCode.toUpperCase() !== BinToBinTransBinsferEnum.TEP_SALE
      );
    }

    this.binsForSelection = this.bins.filter(
      (bin: StoreBin) =>
        bin.binCode.toLowerCase() !== this.item.binCode.toLowerCase()
    );

    this.transferQuantity.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        if (this.item.isSelected) {
          this.sendSelectionChangeEvent(true);
        }
      });
    this.defectTypeDescription.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        if (this.item.isSelected) {
          this.sendSelectionChangeEvent(true);
        }
      });
    this.defectCodeDescription.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        if (this.item.isSelected) {
          this.sendSelectionChangeEvent(true);
        }
      });
  }

  deleteItem(): void {
    this.delete.emit(this.item.id);
  }

  openBinSelectionPopup() {
    this.selectionDialog
      .open({
        title: this.selectDestinationBinLableText,
        placeholder: this.searchDestinationBinLableText,
        options: this.binsForSelection,
        columnDefs: [
          {
            field: 'binCode',
            headerName: 'Bin Code'
          },
          {
            field: 'binGroupCode',
            headerName: 'Bin Group Code'
          }
        ],
        width: 500,
        searchBy: 'binCode'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: StoreBin) => {
        if (selectedOption) {
          this.updateItem.emit({
            ...this.item,
            transferQuantity: this.transferQuantity?.value,
            destinationBinCode: selectedOption.binCode,
            destinationBinGroupCode: selectedOption.binGroupCode
          });
        }
      });
  }

  sendSelectionChangeEvent(isSelected: boolean): void {
    this.updateItem.emit({
      ...this.item,
      transferQuantity: this.transferQuantity?.value,
      defectCodeDesc: this.defectCodeDescription.value,
      defectTypeDesc: this.defectTypeDescription.value,
      isSelected: isSelected,
      ...(!isSelected
        ? { destinationBinCode: null, destinationBinGroupCode: null }
        : {})
    });
  }

  validateQty(event: KeyboardEvent) {
    let pattern = fieldValidation.quantityField.pattern;
    return pattern.test(event.key);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.canDelete && (event.code === 'Delete' || event.key === 'Delete')) {
      this.deleteItem();
    }
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
