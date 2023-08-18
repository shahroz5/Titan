import { isActive } from './../../../../../../shared/ui-master-form-models/src/lib/brand-master/brand-master-constants';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import {
  OtherIssuesItem,
  OtherReceiptsIssuesEnum,
  ItemData
} from '@poss-web/shared/models';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-exhibition-issue-create-item',
  templateUrl: './exhibition-issue-create-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExhibitionIssueCreateItemComponent implements OnInit, OnDestroy {
  @Input() item: OtherIssuesItem;
  @Input() selectionEvents: Observable<any>;
  @Input() SelectedTab: any;
  @Input() dateFormat: string;

  @Output() quantityChange = new EventEmitter<any>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    item: any;
  }> = new EventEmitter();
  @Output() quantity = new EventEmitter<any>();

  itemForm: FormGroup;
  destroy$ = new Subject<null>();
  measuredWeight: number;
  itemWeight: number;
  showUpdateStatus = true;
  weight = 0;
  status: string;
  isChecked: boolean;
  selectionAllSubscription: any;
  isReadOnly: boolean;
  qty: number;
  weightToDisplay: any;
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;
  itemData: ItemData;
  quantityLabel: string;

  constructor(
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService
  ) {
    this.translationService
      .get(['pw.otherReceiptsIssues.RequestedQuantityLabelText'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.quantityLabel =
          translatedLabels['pw.otherReceiptsIssues.RequestedQuantityLabelText'];
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
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isHallmarked: this.item?.isHallmarked,
    };
    this.itemForm = this.createForm();
    this.itemWeight = this.item.itemWeight / this.item.totalQuantity;
    if (this.SelectedTab === OtherReceiptsIssuesEnum.ALL) {
      this.isReadOnly = true;
    } else if (
      this.SelectedTab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS &&
      this.item.requestedQuantity > 1
    ) {
      this.isReadOnly = false;
    }
    this.selectionAllSubscription = this.selectionEvents
      .pipe(
        debounceTime(10),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
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
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  createForm(): FormGroup {
    if (this.SelectedTab === OtherReceiptsIssuesEnum.ALL) {
      this.weight = this.item.availableWeight;
      this.weightToDisplay = this.weightFormatter.format(this.weight);
      this.qty = this.item.availableQuantity;
    } else if (this.SelectedTab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
      this.weight = this.item.measuredWeight;
      this.weightToDisplay = this.weightFormatter.format(this.weight);
      this.qty = this.item.measuredQuantity;
    }
    return new FormGroup({
      isItemSelected: new FormControl(false),
      issueQuantity: new FormControl(
        this.qty,
        [
          this.fieldValidatorsService.requiredField(this.quantityLabel),
          this.fieldValidatorsService.quantityField(this.quantityLabel),
          this.fieldValidatorsService.min(1, this.quantityLabel),
          this.fieldValidatorsService.max(
            this.item.availableQuantity,
            this.quantityLabel
          )
        ]
        // Validators.compose([
        //   Validators.required,
        //   Validators.min(1),
        //   Validators.pattern('^[1-9][0-9]*$'),
        //   Validators.max(this.item.availableQuantity)
        // ])
      ),
      weight: new FormControl(this.weightToDisplay)
    });
  }
  onRequestedQuantityChange() {
    if (
      this.itemForm.value.issueQuantity !== 0 &&
      this.itemForm.value.issueQuantity &&
      this.itemForm.value.issueQuantity <= this.item.availableQuantity
    ) {
      this.measuredWeight =
        this.item.stdWeight * this.itemForm.value.issueQuantity;
      this.itemForm.patchValue({
        weight: this.weightFormatter.format(this.measuredWeight)
      });
      this.quantity.emit({
        itemId: this.item.id,
        inventoryId: this.item.inventoryId,
        measuredWeight: this.measuredWeight,
        quantity: this.itemForm.value.issueQuantity,
        status: 'SELECTED'
      });
    } else {
      let ItemQuantity = 0;
      this.measuredWeight = this.item.measuredWeight;
      ItemQuantity = this.item.measuredQuantity;
      this.itemForm.patchValue({
        weight: this.weightFormatter.format(this.measuredWeight),
        issueQuantity: ItemQuantity
      });
    }
  }
  selectionEmit() {
    this.selection.emit({
      selected: this.itemForm.value.isItemSelected,
      item: this.item
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
