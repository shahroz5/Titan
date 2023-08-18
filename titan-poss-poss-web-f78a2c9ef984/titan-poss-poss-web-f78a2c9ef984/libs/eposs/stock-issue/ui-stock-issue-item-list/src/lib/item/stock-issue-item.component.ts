import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  IssueInventoryItem,
  IssueItemToUpdate,
  ItemToleranceValidate,
  ItemData,
  StockIssueDetailsTabEnum,
  ImageEvent
} from '@poss-web/shared/models';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject, of, Observable } from 'rxjs';
import { debounceTime, takeUntil, delay } from 'rxjs/operators';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-stock-issue-item',
  templateUrl: './stock-issue-item.component.html',
  styleUrls: ['./stock-issue-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockIssueItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() item: IssueInventoryItem;
  @Input() selectionEvents: Observable<any>;
  @Input() tab: any;
  @Input() parentForm: FormArray;

  @Output() update = new EventEmitter<IssueItemToUpdate>();
  @Output() validate = new EventEmitter<ItemToleranceValidate>();
  @Output() updateHeader = new EventEmitter<boolean>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: string;
  }> = new EventEmitter();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  itemForm: FormGroup;
  destroy$ = new Subject<null>();

  showUpdateStatus = true;
  weight = 0;
  status: string;
  quantity: number;
  measuredWeight: number;
  itemWeight: any = 0;
  availableQty: number;
  initialQty: number;
  initialWt: number;
  selectionAllSubscription: any;
  disabled = false;
  weightErrorMsg = '';

  prevMeasuredWeight: number;
  isWeightMismatch = false;

  stockIssueDetailsTabEnumRef = StockIssueDetailsTabEnum;

  itemData: ItemData;
  quantityLabel: string;
  weightLabel: string;

  constructor(
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
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

      if (changes['item']['currentValue']['isUpdatingSuccess'] === true) {
        this.itemForm.markAsPristine();
        this.updateHeader.emit(true);
      }
    }

    if (
      changes &&
      changes['item'] &&
      changes['item']['currentValue'] &&
      (changes['item']['currentValue']['isValidatingSuccess'] === true ||
        changes['item']['currentValue']['isValidatingSuccess'] === false)
    ) {
      of(true)
        .pipe(delay(2000))
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.showUpdateStatus = false;
        });
      this.isWeightMismatch = !changes['item']['currentValue'][
        'isValidatingSuccess'
      ];
      this.prevMeasuredWeight = this.itemForm.get('weight').value;

      if (this.isWeightMismatch) {
        this.weightErrorMsg = 'Weight Mismatch';
      } else {
        this.weightErrorMsg = '';
      }

      if (!this.isWeightMismatch) {
        setTimeout(() => {
          this.updateItem();
        });
      }
    }
    if (
      changes &&
      changes['item'] &&
      changes['item']['currentValue'] &&
      changes['item']['currentValue']['isValidatingError']
    ) {
      of(true)
        .pipe(delay(2000))
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.resetWeightOnError();
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
      mfgDate: null,
      orderType: null,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isHallmarked:
        this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking === true
          ? true
          : false,
      isStudded: this.item.isStudded,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };

    this.selectionEvents
      .pipe(takeUntil(this.destroy$), debounceTime(10))
      .subscribe(data => {
        if (data.selectCheckbox === true) {
          this.itemForm.patchValue({ isItemSelected: true });
        } else {
          this.itemForm.patchValue({ isItemSelected: false });
        }

        if (data.enableCheckbox === false) {
          this.itemForm.controls.isItemSelected.disable();
        } else {
          this.itemForm.controls.isItemSelected.enable();
        }
        if (this.item.availableQuantity < 1) {
          this.itemForm.controls.isItemSelected.disable();
        }
      });

    this.itemForm = this.createForm(this.item);
    this.parentForm.push(this.itemForm);
    this.prevMeasuredWeight = this.itemForm.get('weight').value;

    if (this.item.availableQuantity <= 0) {
      if (this.tab !== StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB) {
        this.itemForm.disable();
      }
    } else {
      this.itemWeight = this.weightFormatter.format(
        this.item.availableWeight / this.item.availableQuantity
      );
    }

    this.itemForm
      .get('issueQuantity')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.itemForm.patchValue({ weight: null }, { emitEvent: false });
        if (this.item.availableQuantity === 0) {
          this.itemForm.patchValue(
            { issueQuantity: 0, weight: this.weightFormatter.format(0) },
            { emitEvent: false }
          );
          this.itemForm.markAsPristine();
        } else if (this.itemForm.get('issueQuantity').invalid) {
          of(true)
            .pipe(delay(2000))
            .subscribe(() => {
              this.itemForm.patchValue({
                issueQuantity: this.quantity,
                weight: this.weight
              });
            });
          this.makeFormDirty();
        }
      });

    this.itemForm
      .get('isItemSelected')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          this.itemForm.markAsDirty();
        } else {
          this.itemForm.get('isItemSelected').markAsPristine();
        }
      });
  }
  resetWeightOnError() {
    this.weightErrorMsg = '';
    this.isWeightMismatch = false;
    this.itemForm.patchValue(
      {
        issueQuantity: this.quantity,
        weight: this.weightFormatter.format(this.weight)
      },
      { emitEvent: false }
    );
    this.cdr.detectChanges();
  }
  createForm(item: IssueInventoryItem): FormGroup {
    item.availableQuantity == null
      ? (this.availableQty = 0)
      : (this.availableQty = this.item.availableQuantity);

    if (item.measuredQuantity === null || item.measuredQuantity === 0) {
      this.quantity = this.availableQty;
      this.weight = item.availableWeight;
    } else {
      this.quantity = item.measuredQuantity;
      this.weight = item.measuredWeight;
    }
    if (item.availableQuantity <= 0 || item.availableQuantity === null) {
      return new FormGroup({
        isItemSelected: new FormControl(''),
        issueQuantity: new FormControl(
          '0',

          [
            this.fieldValidatorsService.quantityField('Available Qty'),
            this.fieldValidatorsService.requiredField('Available Qty')
          ]
        ),
        weight: new FormControl(
          this.weightFormatter.format(0),
          Validators.compose([
            this.fieldValidatorsService.requiredField('Gross Wt.')
          ])
        ),
        bin: new FormControl(item.binCode)
      });
    }

    return new FormGroup({
      isItemSelected: new FormControl(''),
      issueQuantity: new FormControl(
        this.quantity,
        Validators.compose([
          this.fieldValidatorsService.requiredField('Quantity'),
          this.fieldValidatorsService.min(1, 'Quantity'),
          this.fieldValidatorsService.max(item.availableQuantity, 'Quantity')
        ])
      ),
      weight: new FormControl(
        this.weightFormatter.format(this.weight),
        Validators.compose([
          this.fieldValidatorsService.requiredField('Gross Wt.')
        ])
      ),
      bin: new FormControl(item.binCode)
    });
  }

  selectItem() {
    this.selection.emit({
      id: this.item.id,
      selected: this.itemForm.get('isItemSelected').value
    });
  }
  updateItem() {
    if (this.itemForm.valid) {
      this.showUpdateStatus = true;
      this.update.emit(this.createItemUpdatePayload());
    }
  }

  createItemUpdatePayload(): IssueItemToUpdate {
    if (
      this.item.measuredQuantity === null ||
      this.item.measuredQuantity === 0
    ) {
      this.quantity = this.availableQty;
      this.weight = +this.weightFormatter.format(this.item.availableWeight);
    } else {
      this.quantity = this.item.measuredQuantity;
      this.weight = +this.weightFormatter.format(this.item.measuredWeight);
    }
    return {
      id: this.item.id,
      newUpdate: {
        measuredQuantity: this.itemForm.get('issueQuantity').value,
        status: this.item.status,
        measuredWeight: +this.weightFormatter.format(
          this.itemForm.get('weight').value
        ),
        inventoryId: this.item.inventoryId
      },
      actualDetails: {
        measuredQuantity: this.quantity,
        status: this.item.status,
        measuredWeight: this.weight,
        inventoryId: this.item.inventoryId
      }
    };
  }

  makeFormDirty() {
    this.itemForm.markAsDirty();
    this.itemForm.controls['issueQuantity'].markAsDirty();
    this.itemForm.controls['weight'].markAsDirty();
  }
  measuredWeightChange() {
    const newMessuredWeight = +this.itemForm.get('weight').value;
    if (this.prevMeasuredWeight !== newMessuredWeight) {
      this.weightErrorMsg = '';
      this.showUpdateStatus = true;
      this.validate.emit({
        itemId: this.item.id,
        productGroupCode: this.item.productGroup,
        availableWeight: this.item.availableWeight,
        measuredWeight: newMessuredWeight,
        measuredQuantity: this.itemForm.get('issueQuantity').value,
        availableQuantity: this.item.availableQuantity
      });
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
    while (this.parentForm.length !== 0) {
      this.parentForm.clear();
    }
  }
}
